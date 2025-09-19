#include "neural_network.h"
#include <random>
#include <cmath>
#include <fstream>
#include <iostream>

namespace MusicAI {

NeuralNetwork::NeuralNetwork(double learning_rate) 
    : learning_rate_(learning_rate) {
    initializeWeights();
    initializeLayerInfo();
}

void NeuralNetwork::initializeWeights() {
    // Network architecture: 8 -> 64 -> 32 -> 16 -> 5
    std::vector<int> layer_sizes = {INPUT_SIZE, 64, 32, 16, OUTPUT_SIZE};
    
    std::random_device rd;
    std::mt19937 gen(rd());
    
    // Initialize weights and biases for each layer
    for (size_t i = 0; i < layer_sizes.size() - 1; ++i) {
        int input_size = layer_sizes[i];
        int output_size = layer_sizes[i + 1];
        
        // Xavier initialization
        double scale = std::sqrt(2.0 / (input_size + output_size));
        std::normal_distribution<double> dist(0.0, scale);
        
        Eigen::MatrixXd weight(output_size, input_size);
        for (int row = 0; row < output_size; ++row) {
            for (int col = 0; col < input_size; ++col) {
                weight(row, col) = dist(gen);
            }
        }
        weights_.push_back(weight);
        
        // Initialize biases to small positive values
        Eigen::VectorXd bias = Eigen::VectorXd::Constant(output_size, 0.01);
        biases_.push_back(bias);
        
        // Initialize activation storage
        activations_.push_back(Eigen::VectorXd::Zero(output_size));
    }
    
    // Add input layer activations
    activations_.insert(activations_.begin(), Eigen::VectorXd::Zero(INPUT_SIZE));
}

void NeuralNetwork::initializeLayerInfo() {
    layer_info_ = {
        {INPUT_SIZE, "Input", "#4CAF50"},
        {64, "Hidden1", "#2196F3"},
        {32, "Hidden2", "#FF9800"},
        {16, "Hidden3", "#9C27B0"},
        {OUTPUT_SIZE, "Output", "#F44336"}
    };
}

double NeuralNetwork::relu(double x) {
    return std::max(0.0, x);
}

double NeuralNetwork::sigmoid(double x) {
    return 1.0 / (1.0 + std::exp(-x));
}

Eigen::VectorXd NeuralNetwork::softmax(const Eigen::VectorXd& x) {
    Eigen::VectorXd exp_x = x.array().exp();
    return exp_x / exp_x.sum();
}

Eigen::VectorXd NeuralNetwork::forward(const Eigen::VectorXd& input) {
    if (input.size() != INPUT_SIZE) {
        throw std::invalid_argument("Input size mismatch");
    }
    
    // Store input activations
    activations_[0] = input;
    Eigen::VectorXd current = input;
    
    // Forward propagation through hidden layers
    for (size_t i = 0; i < weights_.size() - 1; ++i) {
        current = weights_[i] * current + biases_[i];
        
        // Apply ReLU activation to hidden layers
        for (int j = 0; j < current.size(); ++j) {
            current(j) = relu(current(j));
        }
        
        activations_[i + 1] = current;
    }
    
    // Output layer with softmax
    size_t output_layer = weights_.size() - 1;
    current = weights_[output_layer] * current + biases_[output_layer];
    current = softmax(current);
    
    activations_[output_layer + 1] = current;
    return current;
}

void NeuralNetwork::backward(const Eigen::VectorXd& input, const Eigen::VectorXd& target) {
    // Forward pass to get current activations
    Eigen::VectorXd output = forward(input);
    
    // Compute gradients using backpropagation
    std::vector<Eigen::VectorXd> deltas(weights_.size());
    
    // Output layer error
    deltas[weights_.size() - 1] = output - target;
    
    // Backpropagate errors
    for (int i = static_cast<int>(weights_.size()) - 2; i >= 0; --i) {
        Eigen::VectorXd error = weights_[i + 1].transpose() * deltas[i + 1];
        
        // Apply ReLU derivative
        for (int j = 0; j < error.size(); ++j) {
            error(j) *= (activations_[i + 1](j) > 0) ? 1.0 : 0.0;
        }
        
        deltas[i] = error;
    }
    
    // Update weights and biases
    for (size_t i = 0; i < weights_.size(); ++i) {
        Eigen::VectorXd prev_activation = (i == 0) ? input : activations_[i];
        
        weights_[i] -= learning_rate_ * (deltas[i] * prev_activation.transpose());
        biases_[i] -= learning_rate_ * deltas[i];
    }
}

std::vector<double> NeuralNetwork::getActivations(int layer) const {
    if (layer < 0 || layer >= static_cast<int>(activations_.size())) {
        return {};
    }
    
    const Eigen::VectorXd& activations = activations_[layer];
    std::vector<double> result(activations.size());
    
    for (int i = 0; i < activations.size(); ++i) {
        result[i] = activations(i);
    }
    
    return result;
}

double NeuralNetwork::calculateLoss(const Eigen::VectorXd& predicted, const Eigen::VectorXd& target) const {
    // Cross-entropy loss
    double loss = 0.0;
    for (int i = 0; i < predicted.size(); ++i) {
        if (target(i) > 0) {
            loss -= target(i) * std::log(std::max(predicted(i), 1e-15));
        }
    }
    return loss;
}

void NeuralNetwork::updateWeights(const std::vector<Eigen::VectorXd>& inputs,
                                 const std::vector<Eigen::VectorXd>& targets) {
    for (size_t i = 0; i < inputs.size(); ++i) {
        backward(inputs[i], targets[i]);
    }
}

void NeuralNetwork::saveWeights(const std::string& filename) const {
    std::ofstream file(filename, std::ios::binary);
    if (!file.is_open()) {
        throw std::runtime_error("Cannot open file for writing: " + filename);
    }
    
    // Save architecture info
    size_t num_layers = weights_.size();
    file.write(reinterpret_cast<const char*>(&num_layers), sizeof(num_layers));
    
    // Save weights and biases
    for (size_t i = 0; i < weights_.size(); ++i) {
        int rows = static_cast<int>(weights_[i].rows());
        int cols = static_cast<int>(weights_[i].cols());
        
        file.write(reinterpret_cast<const char*>(&rows), sizeof(rows));
        file.write(reinterpret_cast<const char*>(&cols), sizeof(cols));
        file.write(reinterpret_cast<const char*>(weights_[i].data()), 
                  rows * cols * sizeof(double));
        
        int bias_size = static_cast<int>(biases_[i].size());
        file.write(reinterpret_cast<const char*>(&bias_size), sizeof(bias_size));
        file.write(reinterpret_cast<const char*>(biases_[i].data()), 
                  bias_size * sizeof(double));
    }
}

void NeuralNetwork::loadWeights(const std::string& filename) {
    std::ifstream file(filename, std::ios::binary);
    if (!file.is_open()) {
        throw std::runtime_error("Cannot open file for reading: " + filename);
    }
    
    size_t num_layers;
    file.read(reinterpret_cast<char*>(&num_layers), sizeof(num_layers));
    
    weights_.clear();
    biases_.clear();
    
    for (size_t i = 0; i < num_layers; ++i) {
        int rows, cols;
        file.read(reinterpret_cast<char*>(&rows), sizeof(rows));
        file.read(reinterpret_cast<char*>(&cols), sizeof(cols));
        
        Eigen::MatrixXd weight(rows, cols);
        file.read(reinterpret_cast<char*>(weight.data()), rows * cols * sizeof(double));
        weights_.push_back(weight);
        
        int bias_size;
        file.read(reinterpret_cast<char*>(&bias_size), sizeof(bias_size));
        
        Eigen::VectorXd bias(bias_size);
        file.read(reinterpret_cast<char*>(bias.data()), bias_size * sizeof(double));
        biases_.push_back(bias);
    }
    
    // Reinitialize activations
    activations_.clear();
    activations_.push_back(Eigen::VectorXd::Zero(INPUT_SIZE));
    for (const auto& weight : weights_) {
        activations_.push_back(Eigen::VectorXd::Zero(weight.rows()));
    }
}

} // namespace MusicAI
