#include "music_rl_engine.h"
#include <iostream>
#include <algorithm>
#include <random>

namespace MusicAI {

MusicRecommendationDQN::MusicRecommendationDQN(double learning_rate,
                                               double epsilon,
                                               double epsilon_decay,
                                               double epsilon_min,
                                               double gamma)
    : epsilon_(epsilon), epsilon_decay_(epsilon_decay), epsilon_min_(epsilon_min),
      gamma_(gamma), target_update_freq_(100), training_step_(0) {
    
    q_network_ = std::make_unique<NeuralNetwork>(learning_rate);
    target_network_ = std::make_unique<NeuralNetwork>(learning_rate);
    experience_buffer_ = std::make_unique<ExperienceBuffer>();
    environment_ = std::make_unique<MusicEnvironment>();
    
    // Initialize target network with same weights as main network
    updateTargetNetwork();
}

MusicRecommendationDQN::~MusicRecommendationDQN() = default;

int MusicRecommendationDQN::predict(const std::vector<double>& state) {
    Eigen::VectorXd state_vec = vectorToEigen(state);
    Eigen::VectorXd q_values = q_network_->forward(state_vec);
    
    // Epsilon-greedy action selection
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<double> dis(0.0, 1.0);
    
    if (dis(gen) < epsilon_) {
        // Explore: choose random action
        std::uniform_int_distribution<int> action_dis(0, NeuralNetwork::OUTPUT_SIZE - 1);
        return action_dis(gen);
    } else {
        // Exploit: choose action with highest Q-value
        int best_action = 0;
        for (int i = 1; i < q_values.size(); ++i) {
            if (q_values(i) > q_values(best_action)) {
                best_action = i;
            }
        }
        return best_action;
    }
}

void MusicRecommendationDQN::train(const std::vector<double>& state,
                                  int action,
                                  double reward,
                                  const std::vector<double>& next_state,
                                  bool done) {
    // Store experience in buffer
    Eigen::VectorXd state_vec = vectorToEigen(state);
    Eigen::VectorXd next_state_vec = vectorToEigen(next_state);
    
    Experience experience(state_vec, action, reward, next_state_vec, done);
    experience_buffer_->add(experience);
    
    // Train if we have enough experiences
    if (experience_buffer_->canSample(32)) {
        replayExperience();
    }
    
    // Update target network periodically
    if (++training_step_ % target_update_freq_ == 0) {
        updateTargetNetwork();
    }
    
    // Decay epsilon
    if (epsilon_ > epsilon_min_) {
        epsilon_ *= epsilon_decay_;
    }
}

std::vector<double> MusicRecommendationDQN::getActivations(int layer) const {
    return q_network_->getActivations(layer);
}

std::vector<NeuralNetwork::LayerInfo> MusicRecommendationDQN::getLayerInfo() const {
    return q_network_->getLayerInfo();
}

std::vector<double> MusicRecommendationDQN::getQValues(const std::vector<double>& state) const {
    Eigen::VectorXd state_vec = vectorToEigen(state);
    Eigen::VectorXd q_values = q_network_->forward(state_vec);
    return eigenToVector(q_values);
}

void MusicRecommendationDQN::saveModel(const std::string& filepath) const {
    q_network_->saveWeights(filepath);
}

void MusicRecommendationDQN::loadModel(const std::string& filepath) {
    q_network_->loadWeights(filepath);
    updateTargetNetwork();
}

void MusicRecommendationDQN::updateTargetNetwork() {
    // Copy weights from main network to target network
    // This is a simplified implementation - in practice, you'd copy the actual weights
    target_network_ = std::make_unique<NeuralNetwork>(*q_network_);
}

Eigen::VectorXd MusicRecommendationDQN::vectorToEigen(const std::vector<double>& vec) const {
    Eigen::VectorXd eigen_vec(vec.size());
    for (size_t i = 0; i < vec.size(); ++i) {
        eigen_vec(i) = vec[i];
    }
    return eigen_vec;
}

std::vector<double> MusicRecommendationDQN::eigenToVector(const Eigen::VectorXd& vec) const {
    std::vector<double> std_vec(vec.size());
    for (int i = 0; i < vec.size(); ++i) {
        std_vec[i] = vec(i);
    }
    return std_vec;
}

void MusicRecommendationDQN::replayExperience() {
    const int batch_size = 32;
    auto experiences = experience_buffer_->sample(batch_size);
    
    std::vector<Eigen::VectorXd> states, targets;
    
    for (const auto& exp : experiences) {
        Eigen::VectorXd current_q = q_network_->forward(exp.state);
        Eigen::VectorXd target_q = current_q;
        
        if (exp.done) {
            target_q(exp.action) = exp.reward;
        } else {
            // Double DQN: use main network to select action, target network to evaluate
            Eigen::VectorXd next_q_main = q_network_->forward(exp.next_state);
            Eigen::VectorXd next_q_target = target_network_->forward(exp.next_state);
            
            int best_action = 0;
            for (int i = 1; i < next_q_main.size(); ++i) {
                if (next_q_main(i) > next_q_main(best_action)) {
                    best_action = i;
                }
            }
            
            target_q(exp.action) = exp.reward + gamma_ * next_q_target(best_action);
        }
        
        states.push_back(exp.state);
        targets.push_back(target_q);
    }
    
    // Update network with batch
    q_network_->updateWeights(states, targets);
}

} // namespace MusicAI

// Global instance for C interface
static std::unique_ptr<MusicAI::MusicRecommendationDQN> g_engine;

// C interface implementation
extern "C" {

void initialize() {
    g_engine = std::make_unique<MusicAI::MusicRecommendationDQN>();
}

int predict(double temperature, double weather_condition, double hour,
           double day_of_week, double user_mood, double genre_history_1,
           double genre_history_2, double genre_history_3) {
    
    if (!g_engine) {
        initialize();
    }
    
    std::vector<double> state = {
        temperature, weather_condition, hour, day_of_week,
        user_mood, genre_history_1, genre_history_2, genre_history_3
    };
    
    return g_engine->predict(state);
}

void train(double temperature, double weather_condition, double hour,
          double day_of_week, double user_mood, double genre_history_1,
          double genre_history_2, double genre_history_3,
          int action, double reward) {
    
    if (!g_engine) {
        initialize();
    }
    
    std::vector<double> state = {
        temperature, weather_condition, hour, day_of_week,
        user_mood, genre_history_1, genre_history_2, genre_history_3
    };
    
    // For simplicity, we'll use the same state as next_state
    // In a real implementation, this would be the actual next state
    g_engine->train(state, action, reward, state, false);
}

double* getActivations(int layer, int* size) {
    if (!g_engine) {
        initialize();
    }
    
    auto activations = g_engine->getActivations(layer);
    *size = static_cast<int>(activations.size());
    
    if (activations.empty()) {
        return nullptr;
    }
    
    // Allocate memory for return (caller must free)
    double* result = new double[activations.size()];
    for (size_t i = 0; i < activations.size(); ++i) {
        result[i] = activations[i];
    }
    
    return result;
}

void freeActivations(double* activations) {
    delete[] activations;
}

void saveModel(const char* filepath) {
    if (!g_engine) {
        initialize();
    }
    g_engine->saveModel(std::string(filepath));
}

void loadModel(const char* filepath) {
    if (!g_engine) {
        initialize();
    }
    g_engine->loadModel(std::string(filepath));
}

}
