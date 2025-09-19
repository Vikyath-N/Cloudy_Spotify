import React, { useState } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  MapPin,
  Thermometer,
  Clock,
  Heart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';

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
  // collapsed state removed for minimalist layout

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
    <div className="space-y-8">
            {/* Location */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Location</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={weather.location}
                  onChange={(e) => setWeather({ ...weather, location: e.target.value })}
                  placeholder="Enter city or zip code"
                />
                <Button variant="secondary" onClick={() => onWeatherChange(weather)}>Apply</Button>
              </div>
            </div>

            {/* Weather Condition */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Weather Condition</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weatherIcons.map((option, index) => {
                  const Icon = option.icon;
                  const isSelected = weather.condition === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleWeatherConditionChange(index)}
                      className={`p-3 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-slate-800 ring-1 ring-slate-700'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <Icon 
                        className="w-6 h-6 mx-auto mb-2" 
                        style={{ color: option.color }}
                      />
                      <div className="text-xs text-slate-300 font-medium text-center">
                        {option.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-slate-300">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {weather.temperature}°C
                </div>
              </div>
              <div className="relative">
                <Slider
                  min={-10}
                  max={40}
                  step={1}
                  value={[weather.temperature]}
                  onValueChange={(v) => handleTemperatureChange(v[0] ?? weather.temperature)}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
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
                <span className="text-sm font-medium text-slate-300">Current Mood</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodChange(mood.value)}
                    className={`p-3 rounded-xl transition-colors ${
                      selectedMood === mood.value
                        ? 'bg-slate-800 ring-1 ring-slate-700'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-2xl mb-1 text-center">{mood.emoji}</div>
                    <div className="text-xs text-slate-300 font-medium text-center">
                      {mood.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Context */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">Time Context</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-slate-900/50">
                  <div className="text-xs text-slate-500 mb-1">Current Time</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="rounded-xl p-4 bg-slate-900/50">
                  <div className="text-xs text-slate-500 mb-1">Day</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date().toLocaleDateString([], { weekday: 'short' })}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Activity Indicator */}
            <div className="flex items-center justify-center py-2 text-xs text-slate-500">
              {isLoading ? 'AI Processing…' : 'Ready for prediction'}
            </div>
    </div>
  );
};
