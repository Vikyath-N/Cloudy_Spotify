#pragma once

#include "neural_network.h"
#include "experience_buffer.h"
#include "music_environment.h"
#include <memory>

namespace MusicAI {

class MusicRecommendationDQN {
private:
    std::unique_ptr<NeuralNetwork> q_network_;
    std::unique_ptr<NeuralNetwork> target_network_;
    std::unique_ptr<ExperienceBuffer> experience_buffer_;
    std::unique_ptr<MusicEnvironment> environment_;
    
    double epsilon_;           // Exploration rate
    double epsilon_decay_;
    double epsilon_min_;
    double gamma_;            // Discount factor
    int target_update_freq_;  // How often to update target network
    int training_step_;
    
public:
    MusicRecommendationDQN(double learning_rate = 0.001,
                          double epsilon = 1.0,
                          double epsilon_decay = 0.995,
                          double epsilon_min = 0.01,
                          double gamma = 0.95);
    
    ~MusicRecommendationDQN();
    
    // Main interface
    int predict(const std::vector<double>& state);
    void train(const std::vector<double>& state, 
              int action, 
              double reward, 
              const std::vector<double>& next_state, 
              bool done);
    
    // For visualization
    std::vector<double> getActivations(int layer) const;
    std::vector<NeuralNetwork::LayerInfo> getLayerInfo() const;
    std::vector<double> getQValues(const std::vector<double>& state) const;
    
    // Model management
    void saveModel(const std::string& filepath) const;
    void loadModel(const std::string& filepath);
    
    // Training utilities
    void updateTargetNetwork();
    double getEpsilon() const { return epsilon_; }
    int getTrainingStep() const { return training_step_; }
    
private:
    Eigen::VectorXd vectorToEigen(const std::vector<double>& vec) const;
    std::vector<double> eigenToVector(const Eigen::VectorXd& vec) const;
    void replayExperience();
};

} // namespace MusicAI

// C interface for WebAssembly
extern "C" {
    // Initialize the engine
    void initialize();
    
    // Prediction interface
    int predict(double temperature, double weather_condition, double hour, 
               double day_of_week, double user_mood, double genre_history_1,
               double genre_history_2, double genre_history_3);
    
    // Training interface
    void train(double temperature, double weather_condition, double hour,
              double day_of_week, double user_mood, double genre_history_1,
              double genre_history_2, double genre_history_3,
              int action, double reward);
    
    // Visualization interface
    double* getActivations(int layer, int* size);
    void freeActivations(double* activations);
    
    // Model management
    void saveModel(const char* filepath);
    void loadModel(const char* filepath);
}
