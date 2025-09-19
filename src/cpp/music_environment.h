#pragma once

#include <vector>
#include <array>
#include <random>

namespace MusicAI {

class MusicEnvironment {
public:
    struct State {
        double temperature;      // Normalized temperature (-1 to 1)
        double weather_condition; // 0-4 (sunny, cloudy, rainy, snowy, stormy)
        double hour_of_day;      // 0-23 normalized to 0-1
        double day_of_week;      // 0-6 normalized to 0-1
        double user_mood;        // 0-4 (sad, calm, neutral, happy, energetic)
        std::array<double, 3> genre_history; // Recent genre preferences
    };
    
    enum class Action {
        CHILL_LOFI = 0,
        POP_HITS = 1,
        ROCK_ENERGY = 2,
        JAZZ_SMOOTH = 3,
        ELECTRONIC_DANCE = 4
    };
    
    enum class WeatherCondition {
        SUNNY = 0,
        CLOUDY = 1,
        RAINY = 2,
        SNOWY = 3,
        STORMY = 4
    };
    
private:
    std::mt19937 rng_;
    State current_state_;
    
public:
    MusicEnvironment();
    
    // Environment interface
    State reset();
    State getState() const { return current_state_; }
    void setState(const State& state) { current_state_ = state; }
    
    // Reward calculation
    double calculateReward(Action action, const State& state, double user_rating) const;
    
    // State utilities
    std::vector<double> stateToVector(const State& state) const;
    State vectorToState(const std::vector<double>& vec) const;
    
    // Action utilities
    static std::string actionToString(Action action);
    static Action intToAction(int action_int);
    
private:
    double getWeatherMoodCompatibility(WeatherCondition weather, Action action) const;
    double getTimeMoodCompatibility(double hour, Action action) const;
    double getGenreConsistency(const std::array<double, 3>& history, Action action) const;
};

} // namespace MusicAI
