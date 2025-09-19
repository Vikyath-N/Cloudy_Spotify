#include "music_environment.h"
#include <cmath>
#include <random>

namespace MusicAI {

MusicEnvironment::MusicEnvironment() : rng_(std::random_device{}()) {
    reset();
}

MusicEnvironment::State MusicEnvironment::reset() {
    // Initialize with random state for training diversity
    std::uniform_real_distribution<double> temp_dist(-1.0, 1.0);  // Normalized temperature
    std::uniform_int_distribution<int> weather_dist(0, 4);        // Weather conditions
    std::uniform_real_distribution<double> time_dist(0.0, 1.0);   // Normalized time
    std::uniform_int_distribution<int> mood_dist(0, 4);           // User moods
    std::uniform_real_distribution<double> history_dist(0.0, 1.0); // Genre history
    
    current_state_.temperature = temp_dist(rng_);
    current_state_.weather_condition = weather_dist(rng_);
    current_state_.hour_of_day = time_dist(rng_);
    current_state_.day_of_week = time_dist(rng_);
    current_state_.user_mood = mood_dist(rng_);
    
    for (int i = 0; i < 3; ++i) {
        current_state_.genre_history[i] = history_dist(rng_);
    }
    
    return current_state_;
}

double MusicEnvironment::calculateReward(Action action, const State& state, double user_rating) const {
    // Base reward from user rating (0-5 scale, normalized to -1 to 1)
    double base_reward = (user_rating - 2.5) / 2.5;
    
    // Weather-mood compatibility bonus
    double weather_bonus = getWeatherMoodCompatibility(
        static_cast<WeatherCondition>(static_cast<int>(state.weather_condition)), action);
    
    // Time-mood compatibility bonus
    double time_bonus = getTimeMoodCompatibility(state.hour_of_day * 24.0, action);
    
    // Genre consistency bonus (reward consistency with recent preferences)
    double consistency_bonus = getGenreConsistency(state.genre_history, action);
    
    // Temperature influence
    double temp_bonus = 0.0;
    if (state.temperature > 0.5 && (action == Action::ELECTRONIC_DANCE || action == Action::POP_HITS)) {
        temp_bonus = 0.1; // Hot weather + energetic music
    } else if (state.temperature < -0.5 && (action == Action::CHILL_LOFI || action == Action::JAZZ_SMOOTH)) {
        temp_bonus = 0.1; // Cold weather + calm music
    }
    
    // Combine all factors
    double total_reward = base_reward + 0.3 * weather_bonus + 0.2 * time_bonus + 
                         0.2 * consistency_bonus + temp_bonus;
    
    // Clamp to [-1, 1] range
    return std::max(-1.0, std::min(1.0, total_reward));
}

std::vector<double> MusicEnvironment::stateToVector(const State& state) const {
    return {
        state.temperature,
        state.weather_condition / 4.0,  // Normalize to [0,1]
        state.hour_of_day,
        state.day_of_week,
        state.user_mood / 4.0,          // Normalize to [0,1]
        state.genre_history[0],
        state.genre_history[1],
        state.genre_history[2]
    };
}

MusicEnvironment::State MusicEnvironment::vectorToState(const std::vector<double>& vec) const {
    if (vec.size() != 8) {
        throw std::invalid_argument("State vector must have exactly 8 elements");
    }
    
    State state;
    state.temperature = vec[0];
    state.weather_condition = vec[1] * 4.0;  // Denormalize
    state.hour_of_day = vec[2];
    state.day_of_week = vec[3];
    state.user_mood = vec[4] * 4.0;          // Denormalize
    state.genre_history[0] = vec[5];
    state.genre_history[1] = vec[6];
    state.genre_history[2] = vec[7];
    
    return state;
}

std::string MusicEnvironment::actionToString(Action action) {
    switch (action) {
        case Action::CHILL_LOFI: return "Chill/Lofi";
        case Action::POP_HITS: return "Pop Hits";
        case Action::ROCK_ENERGY: return "Rock/Energy";
        case Action::JAZZ_SMOOTH: return "Jazz/Smooth";
        case Action::ELECTRONIC_DANCE: return "Electronic/Dance";
        default: return "Unknown";
    }
}

MusicEnvironment::Action MusicEnvironment::intToAction(int action_int) {
    if (action_int < 0 || action_int > 4) {
        throw std::invalid_argument("Action must be in range [0, 4]");
    }
    return static_cast<Action>(action_int);
}

double MusicEnvironment::getWeatherMoodCompatibility(WeatherCondition weather, Action action) const {
    // Define weather-music compatibility matrix
    switch (weather) {
        case WeatherCondition::SUNNY:
            switch (action) {
                case Action::POP_HITS: return 0.8;
                case Action::ELECTRONIC_DANCE: return 0.7;
                case Action::ROCK_ENERGY: return 0.6;
                case Action::JAZZ_SMOOTH: return 0.4;
                case Action::CHILL_LOFI: return 0.3;
            }
            break;
            
        case WeatherCondition::CLOUDY:
            switch (action) {
                case Action::CHILL_LOFI: return 0.8;
                case Action::JAZZ_SMOOTH: return 0.7;
                case Action::POP_HITS: return 0.5;
                case Action::ROCK_ENERGY: return 0.4;
                case Action::ELECTRONIC_DANCE: return 0.3;
            }
            break;
            
        case WeatherCondition::RAINY:
            switch (action) {
                case Action::CHILL_LOFI: return 0.9;
                case Action::JAZZ_SMOOTH: return 0.8;
                case Action::POP_HITS: return 0.3;
                case Action::ROCK_ENERGY: return 0.2;
                case Action::ELECTRONIC_DANCE: return 0.1;
            }
            break;
            
        case WeatherCondition::SNOWY:
            switch (action) {
                case Action::JAZZ_SMOOTH: return 0.8;
                case Action::CHILL_LOFI: return 0.7;
                case Action::POP_HITS: return 0.4;
                case Action::ROCK_ENERGY: return 0.3;
                case Action::ELECTRONIC_DANCE: return 0.2;
            }
            break;
            
        case WeatherCondition::STORMY:
            switch (action) {
                case Action::ROCK_ENERGY: return 0.8;
                case Action::ELECTRONIC_DANCE: return 0.6;
                case Action::CHILL_LOFI: return 0.5;
                case Action::JAZZ_SMOOTH: return 0.4;
                case Action::POP_HITS: return 0.3;
            }
            break;
    }
    return 0.5; // Default compatibility
}

double MusicEnvironment::getTimeMoodCompatibility(double hour, Action action) const {
    // Early morning (5-9): Gentle wake-up music
    if (hour >= 5 && hour < 9) {
        switch (action) {
            case Action::CHILL_LOFI: return 0.8;
            case Action::JAZZ_SMOOTH: return 0.7;
            case Action::POP_HITS: return 0.5;
            case Action::ROCK_ENERGY: return 0.2;
            case Action::ELECTRONIC_DANCE: return 0.1;
        }
    }
    // Work hours (9-17): Focus music
    else if (hour >= 9 && hour < 17) {
        switch (action) {
            case Action::CHILL_LOFI: return 0.9;
            case Action::JAZZ_SMOOTH: return 0.6;
            case Action::POP_HITS: return 0.4;
            case Action::ROCK_ENERGY: return 0.3;
            case Action::ELECTRONIC_DANCE: return 0.2;
        }
    }
    // Evening (17-22): Energetic or relaxing
    else if (hour >= 17 && hour < 22) {
        switch (action) {
            case Action::POP_HITS: return 0.8;
            case Action::ROCK_ENERGY: return 0.7;
            case Action::ELECTRONIC_DANCE: return 0.6;
            case Action::JAZZ_SMOOTH: return 0.5;
            case Action::CHILL_LOFI: return 0.4;
        }
    }
    // Night (22-5): Calm, relaxing music
    else {
        switch (action) {
            case Action::CHILL_LOFI: return 0.9;
            case Action::JAZZ_SMOOTH: return 0.8;
            case Action::POP_HITS: return 0.3;
            case Action::ROCK_ENERGY: return 0.1;
            case Action::ELECTRONIC_DANCE: return 0.1;
        }
    }
    return 0.5; // Default compatibility
}

double MusicEnvironment::getGenreConsistency(const std::array<double, 3>& history, Action action) const {
    // Convert action to genre preference value
    double action_value = static_cast<double>(action) / 4.0; // Normalize to [0,1]
    
    // Calculate similarity to recent history
    double similarity = 0.0;
    for (int i = 0; i < 3; ++i) {
        double weight = 1.0 - (i * 0.2); // More recent history has higher weight
        similarity += weight * (1.0 - std::abs(action_value - history[i]));
    }
    
    return similarity / 3.0; // Average similarity
}

} // namespace MusicAI
