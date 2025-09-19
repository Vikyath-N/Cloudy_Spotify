import { useState, useEffect } from 'react'
import { Brain, Music, Zap, Activity, Target, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { NeuralNetworkVisualization } from './components/NeuralNetworkVisualization'
import { PremiumControlPanel } from './components/PremiumControlPanel'
import { useNeuralEngine } from './hooks/useNeuralEngine'

const musicGenres = [
  "Chill/Lofi", "Pop Hits", "Rock/Energy", "Jazz/Smooth", "Electronic/Dance"
]

function App() {
  const {
    isReady: isEngineReady,
    isLoading,
    activations,
    layerInfo,
    metrics,
    predict,
    train,
    simulateActivity
  } = useNeuralEngine()

  const [currentPrediction, setCurrentPrediction] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState([
    { name: "Lofi Hip Hop Study", confidence: 89.2, genre: 0 },
    { name: "Cloudy Day Indie", confidence: 76.8, genre: 1 },
    { name: "Afternoon Jazz", confidence: 85.5, genre: 3 }
  ])

  // Auto-simulate activity for demo (less frequent to reduce performance violations)
  useEffect(() => {
    if (isEngineReady) {
      const interval = setInterval(() => {
        simulateActivity()
      }, 5000) // Increased from 3000ms to 5000ms
      return () => clearInterval(interval)
    }
  }, [isEngineReady, simulateActivity])

  const handleWeatherChange = async (weather: {temperature: number; condition: number; location: string}) => {
    // Mock prediction based on weather context
    const mockContext = {
      temperature: weather.temperature / 20, // Normalize
      weather_condition: weather.condition,
      hour: new Date().getHours() / 24,
      day_of_week: new Date().getDay() / 7,
      user_mood: 2, // Default neutral
      genre_history: [0.5, 0.3, 0.7]
    }

    try {
      const prediction = await predict(mockContext)
      setCurrentPrediction(prediction)
      
      // Update recommendations based on prediction
      setRecommendations([
        { name: `${musicGenres[prediction]} Mix`, confidence: 90 + Math.random() * 8, genre: prediction },
        { name: "Contextual Playlist", confidence: 80 + Math.random() * 10, genre: (prediction + 1) % 5 },
        { name: "AI Discovery", confidence: 75 + Math.random() * 10, genre: (prediction + 2) % 5 }
      ])
    } catch (error) {
      console.error('Prediction failed:', error)
    }
  }

  const handleMoodChange = (mood: number) => {
    console.log('Mood changed to:', mood)
  }

  const handleTraining = async (rating: number) => {
    if (currentPrediction !== null) {
      const mockContext = {
        temperature: 0.5,
        weather_condition: 1,
        hour: new Date().getHours() / 24,
        day_of_week: new Date().getDay() / 7,
        user_mood: 2,
        genre_history: [0.5, 0.3, 0.7]
      }

      try {
        await train(mockContext, currentPrediction, rating)
      } catch (error) {
        console.error('Training failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative z-10">
      {/* Premium Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-6 m-4 rounded-3xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="relative"
              animate={{ 
                scale: isEngineReady ? [1, 1.05, 1] : 1,
                rotate: isLoading ? 360 : 0
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <Brain className="w-10 h-10 text-spotify-green" />
              {isEngineReady && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              )}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-spotify-green via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Cloudy Spotify AI
              </h1>
              <p className="text-sm text-gray-400">Neural Network Music Recommendation Engine</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">
                Active Neurons: {activations.flat().filter(a => a > 0.5).length}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">
                Accuracy: {(metrics.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <motion.div 
              animate={{ 
                backgroundColor: isEngineReady ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                borderColor: isEngineReady ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'
              }}
              className="px-4 py-2 rounded-full text-xs font-medium border"
            >
              <span className={isEngineReady ? 'text-green-400' : 'text-yellow-400'}>
                {isEngineReady ? '🧠 AI Ready' : '⏳ Loading...'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Premium Layout */}
      <main className="p-6 space-y-8">
        {/* Top Row - Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PremiumControlPanel 
            onWeatherChange={handleWeatherChange}
            onMoodChange={handleMoodChange}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Bottom Row - Neural Network + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Neural Network Visualization - Takes 2/3 of space */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-dark p-8 rounded-3xl backdrop-blur-xl min-h-[500px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Neural Network</h2>
                    <p className="text-gray-400">Real-time decision visualization</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Inference Time</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {metrics.inference_time.toFixed(1)}ms
                  </div>
                  <div className="text-xs text-gray-500">
                    {activations.flat().filter(a => a > 0.5).length} neurons active
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <NeuralNetworkVisualization
                  width={800}
                  height={400}
                  isActive={isEngineReady}
                  activations={activations}
                  layerInfo={layerInfo}
                />
              </div>
            </motion.div>
          </div>

          {/* AI Recommendations - Takes 1/3 of space */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark p-8 rounded-3xl backdrop-blur-xl min-h-[500px]"
              style={{
                background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(29, 185, 84, 0.02) 100%)',
                border: '1px solid rgba(29, 185, 84, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(29, 185, 84, 0.2)'
              }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-spotify-green to-green-400 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: -5 }}
                >
                  <Music className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
                  <p className="text-gray-400">Personalized for you</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((track, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                    }}
                    className="group p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-spotify-green/30 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-spotify-green to-green-400 rounded-2xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <Music className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-semibold text-white group-hover:text-spotify-green transition-colors text-lg">
                          {track.name}
                        </p>
                        <p className="text-sm text-gray-400 mb-3">
                          Genre: {musicGenres[track.genre]}
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-spotify-green to-green-400 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${track.confidence}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                            />
                          </div>
                          <span className="text-sm text-spotify-green font-bold">
                            {track.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating buttons */}
                    <motion.div 
                      className="flex items-center justify-center space-x-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ y: 10 }}
                      whileHover={{ y: 0 }}
                    >
                      <button 
                        onClick={() => handleTraining(-1)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition-colors border border-red-500/30 hover:border-red-500/50"
                      >
                        👎 Not for me
                      </button>
                      <button 
                        onClick={() => handleTraining(1)}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm hover:bg-green-500/30 transition-colors border border-green-500/30 hover:border-green-500/50"
                      >
                        👍 Love it
                      </button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Premium Status Bar */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-4 m-4 rounded-3xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Neural Engine v2.0.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">Training Step: {metrics.training_step}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Epsilon: {metrics.epsilon.toFixed(3)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Built with ❤️ using C++ • WebAssembly • React • TypeScript • D3.js
          </div>
        </div>
      </motion.footer>
      </div>
    </div>
  )
}

export default App
