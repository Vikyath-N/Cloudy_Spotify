#pragma once

#include <vector>
#include <memory>
#include <Eigen/Dense>

namespace MusicAI {

class NeuralNetwork {
public:
    static constexpr int INPUT_SIZE = 8;   // Weather, time, context features
    static constexpr int OUTPUT_SIZE = 5;  // Music genres/moods
    
    struct LayerInfo {
        int size;
        std::string name;
        std::string color;
    };

private:
    std::vector<Eigen::MatrixXd> weights_;
    std::vector<Eigen::VectorXd> biases_;
    std::vector<Eigen::VectorXd> activations_;  // For visualization
    std::vector<LayerInfo> layer_info_;
    
    double learning_rate_;
    
    // Activation functions
    static double relu(double x);
    static double sigmoid(double x);
    static Eigen::VectorXd softmax(const Eigen::VectorXd& x);
    
public:
    NeuralNetwork(double learning_rate = 0.001);
    
    // Core functionality
    Eigen::VectorXd forward(const Eigen::VectorXd& input);
    void backward(const Eigen::VectorXd& input, const Eigen::VectorXd& target);
    
    // For visualization and debugging
    std::vector<double> getActivations(int layer) const;
    std::vector<LayerInfo> getLayerInfo() const { return layer_info_; }
    int getLayerCount() const { return static_cast<int>(weights_.size()) + 1; }
    
    // Serialization
    void saveWeights(const std::string& filename) const;
    void loadWeights(const std::string& filename);
    
    // Training utilities
    double calculateLoss(const Eigen::VectorXd& predicted, const Eigen::VectorXd& target) const;
    void updateWeights(const std::vector<Eigen::VectorXd>& inputs,
                      const std::vector<Eigen::VectorXd>& targets);
    
private:
    void initializeWeights();
    void initializeLayerInfo();
};

} // namespace MusicAI
