import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  MapPin,
  Thermometer,
  Clock,
  Heart,
  Settings
} from 'lucide-react';

interface PremiumControlPanelProps {
  onWeatherChange: (weather: WeatherData) => void;
  onMoodChange: (mood: number) => void;
  isLoading?: boolean;
}

interface WeatherData {
  temperature: number;
  condition: number;
  location: string;
}

const weatherIcons = [
  { icon: Sun, name: "Sunny", color: "#FFA726" },
  { icon: Cloud, name: "Cloudy", color: "#90A4AE" },
  { icon: CloudRain, name: "Rainy", color: "#42A5F5" },
  { icon: CloudSnow, name: "Snowy", color: "#E3F2FD" },
  { icon: Zap, name: "Stormy", color: "#AB47BC" }
];

const moodOptions = [
  { name: "Sad", emoji: "😢", color: "#5C6BC0", value: 0 },
  { name: "Calm", emoji: "😌", color: "#26C6DA", value: 1 },
  { name: "Neutral", emoji: "😐", color: "#66BB6A", value: 2 },
  { name: "Happy", emoji: "😊", color: "#FFA726", value: 3 },
  { name: "Energetic", emoji: "🚀", color: "#EF5350", value: 4 }
];

export const PremiumControlPanel: React.FC<PremiumControlPanelProps> = ({
  onWeatherChange,
  onMoodChange,
  isLoading = false
}) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 0,
    location: "San Francisco"
  });
  const [selectedMood, setSelectedMood] = useState(2);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleWeatherConditionChange = (condition: number) => {
    const newWeather = { ...weather, condition };
    setWeather(newWeather);
    onWeatherChange(newWeather);
  };

  const handleTemperatureChange = (temperature: number) => {
    const newWeather = { ...weather, temperature };
    setWeather(newWeather);
    onWeatherChange(newWeather);
  };

  const handleMoodChange = (mood: number) => {
    setSelectedMood(mood);
    onMoodChange(mood);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white">Context Control</h3>
            <p className="text-gray-400">Fine-tune your music experience</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ⌄
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Location */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Location</span>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={weather.location}
                onChange={(e) => setWeather({ ...weather, location: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="Enter city or zip code"
              />
            </div>

            {/* Weather Condition */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Weather Condition</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weatherIcons.map((option, index) => {
                  const Icon = option.icon;
                  const isSelected = weather.condition === index;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWeatherConditionChange(index)}
                      className={`p-4 rounded-2xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-white/20 ring-2 ring-white/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon 
                        className="w-6 h-6 mx-auto mb-2" 
                        style={{ color: option.color }}
                      />
                      <div className="text-xs text-gray-300 font-medium">
                        {option.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-gray-300">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {weather.temperature}°C
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="-10"
                  max="40"
                  value={weather.temperature}
                  onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, 
                      #3B82F6 0%, 
                      #10B981 ${((weather.temperature + 10) / 50) * 50}%, 
                      #EF4444 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>-10°C</span>
                  <span>15°C</span>
                  <span>40°C</span>
                </div>
              </div>
            </div>

            {/* Mood Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-gray-300">Current Mood</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodChange(mood.value)}
                    className={`p-4 rounded-2xl transition-all duration-200 ${
                      selectedMood === mood.value
                        ? 'bg-white/20 ring-2 ring-white/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mood.emoji}</div>
                    <div className="text-xs text-gray-300 font-medium">
                      {mood.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Context */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">Time Context</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-2xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Current Time</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Day</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date().toLocaleDateString([], { weekday: 'short' })}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Activity Indicator */}
            <div className="flex items-center justify-center space-x-3 py-4">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: isLoading ? [1, 1.2, 1] : 1,
                      opacity: isLoading ? [0.5, 1, 0.5] : 0.7
                    }}
                    transition={{
                      duration: 1,
                      repeat: isLoading ? Infinity : 0,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                {isLoading ? 'AI Processing...' : 'Ready for prediction'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
