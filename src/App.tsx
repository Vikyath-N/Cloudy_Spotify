import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NeuralNetworkVisualization } from './components/NeuralNetworkVisualization'
import { PremiumControlPanel } from './components/PremiumControlPanel'
import { useNeuralEngine } from './hooks/useNeuralEngine'
import { useToast } from './hooks/useToast'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingRating, setPendingRating] = useState<{ rating: number; trackName: string } | null>(null)
  const { toasts, toast, dismiss } = useToast()

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

  const handleRatingClick = (rating: number, trackName: string) => {
    setPendingRating({ rating, trackName })
    setDialogOpen(true)
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
        setDialogOpen(false)
        setPendingRating(null)
        toast({
          title: "Training Complete",
          description: `Your feedback for "${pendingRating?.trackName}" has been recorded`,
          variant: "default"
        })
      } catch (error) {
        console.error('Training failed:', error)
        toast({
          title: "Training Failed",
          description: "Failed to record your feedback. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="min-h-screen text-white" style={{background: 'var(--bg)'}}>
      
      <div className="relative z-10">
      {/* Minimalist Header */}
      <header className="border-b border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-white">Cloudy Spotify AI</h1>
              <p className="text-sm text-slate-400 mt-1">Neural music recommendations</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>Neurons: {activations.flat().filter(a => a > 0.5).length}</span>
              <span>Accuracy: {(metrics.accuracy * 100).toFixed(1)}%</span>
              <Badge variant={isEngineReady ? 'default' : 'secondary'}>
                {isEngineReady ? 'Ready' : 'Loading'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Clean Layout */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Neural Network */}
          <div className="lg:col-span-2">
            <Card className="border-slate-800/30 bg-slate-900/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium">Neural Network</CardTitle>
                    <CardDescription className="text-slate-400">Real-time visualization</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => simulateActivity()}>
                    Simulate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <NeuralNetworkVisualization
                  width={600}
                  height={300}
                  isActive={isEngineReady}
                  activations={activations}
                  layerInfo={layerInfo}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recommendations */}
            <Card className="border-slate-800/30 bg-slate-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Recommendations</CardTitle>
                <CardDescription className="text-slate-400">AI curated for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((track, i) => (
                    <div key={i} className="group p-4 rounded-lg border border-slate-800/30 hover:border-slate-600/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white group-hover:text-green-400 transition-colors">
                          {track.name}
                        </h3>
                        <span className="text-sm text-green-400 font-medium">
                          {track.confidence.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {musicGenres[track.genre]}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRatingClick(-1, track.name)}
                          className="text-xs"
                        >
                          👎
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleRatingClick(1, track.name)}
                          className="text-xs"
                        >
                          👍
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card className="border-slate-800/30 bg-slate-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Context</CardTitle>
                <CardDescription className="text-slate-400">Adjust your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <PremiumControlPanel 
                  onWeatherChange={handleWeatherChange}
                  onMoodChange={handleMoodChange}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-6">
              <span>Engine v2.0.0</span>
              <span>Step: {metrics.training_step}</span>
            </div>
            <div>Built with React & TypeScript</div>
          </div>
        </div>
      </footer>

      {/* Rating Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Rating</DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingRating?.rating === 1 ? '👍 Love' : '👎 dislike'} "{pendingRating?.trackName}"? 
              This will help improve your future recommendations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => pendingRating && handleTraining(pendingRating.rating)}
              variant={pendingRating?.rating === 1 ? "default" : "outline"}
            >
              {pendingRating?.rating === 1 ? '👍 Love it' : '👎 Not for me'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simple Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`p-3 rounded-md border max-w-sm text-sm ${
              toastItem.variant === 'destructive'
                ? 'bg-red-950 border-red-700 text-red-200'
                : 'bg-red-900 border-red-600 text-red-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{toastItem.title}</p>
                {toastItem.description && (
                  <p className="text-xs opacity-80 mt-1">{toastItem.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toastItem.id)}
                className="ml-2 opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default App
