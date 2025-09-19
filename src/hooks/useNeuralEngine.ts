import { useState, useEffect, useCallback } from 'react';

interface EngineState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

interface NeuralMetrics {
  training_step: number;
  epsilon: number;
  inference_time: number;
  accuracy: number;
  loss: number;
}

interface LayerInfo {
  name: string;
  size: number;
  color: string;
}

export const useNeuralEngine = () => {
  const [engineState, setEngineState] = useState<EngineState>({
    isReady: false,
    isLoading: true,
    error: null
  });

  const [activations, setActivations] = useState<number[][]>([]);
  const [layerInfo, setLayerInfo] = useState<LayerInfo[]>([]);
  const [metrics, setMetrics] = useState<NeuralMetrics>({
    training_step: 0,
    epsilon: 0.1,
    inference_time: 0,
    accuracy: 0,
    loss: 0
  });

  // Initialize the neural engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setEngineState(prev => ({ ...prev, isLoading: true, error: null }));

        // Load the mock engine for development
        const script = document.createElement('script');
        script.src = `${import.meta.env.BASE_URL}music_engine_mock.js`;
        script.onload = async () => {
          if (window.MusicEngine) {
            await window.MusicEngine.initialize();
            const info = window.MusicEngine.getLayerInfo();
            setLayerInfo(info);
            setEngineState({
              isReady: true,
              isLoading: false,
              error: null
            });
          }
        };
        script.onerror = () => {
          setEngineState({
            isReady: false,
            isLoading: false,
            error: 'Failed to load neural engine'
          });
        };
        document.head.appendChild(script);
      } catch (error) {
        setEngineState({
          isReady: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    initializeEngine();
  }, []);

  // Predict music recommendation with real-time neural transparency
  const predict = useCallback(async (context: {
    temperature: number;
    weather_condition: number;
    hour: number;
    day_of_week: number;
    user_mood: number;
    genre_history: number[];
  }) => {
    if (!engineState.isReady || !window.MusicEngine) {
      throw new Error('Neural engine not ready');
    }

    const startTime = performance.now();

    // REAL-TIME NEURAL NETWORK EXECUTION
    const action = window.MusicEngine.predict(
      context.temperature,
      context.weather_condition,
      context.hour,
      context.day_of_week,
      context.user_mood,
      context.genre_history[0] || 0,
      context.genre_history[1] || 0,
      context.genre_history[2] || 0
    );

    const endTime = performance.now();
    const actualInferenceTime = endTime - startTime;

    // CAPTURE REAL-TIME ACTIVATIONS FOR TRANSPARENCY
    const newActivations: number[][] = [];
    const layerActivationDetails: Array<{
      layerIndex: number;
      layerName: string;
      neuronCount: number;
      activeNeurons: number;
      maxActivation: number;
      avgActivation: number;
      activationDistribution: {
        low: number;
        medium: number;
        high: number;
      };
    }> = [];
    
    for (let i = 0; i < layerInfo.length; i++) {
      const layerActivations = window.MusicEngine.getActivations(i);
      newActivations.push(layerActivations);
      
      // Detailed layer analysis for educational transparency
      layerActivationDetails.push({
        layerIndex: i,
        layerName: layerInfo[i]?.name || `Layer ${i}`,
        neuronCount: layerActivations.length,
        activeNeurons: layerActivations.filter(a => a > 0.1).length,
        maxActivation: Math.max(...layerActivations),
        avgActivation: layerActivations.reduce((a, b) => a + b, 0) / layerActivations.length,
        activationDistribution: {
          low: layerActivations.filter(a => a < 0.3).length,
          medium: layerActivations.filter(a => a >= 0.3 && a < 0.7).length,
          high: layerActivations.filter(a => a >= 0.7).length
        }
      });
    }
    
    setActivations(newActivations);

    // COMPREHENSIVE PERFORMANCE METRICS
    const engineMetrics = window.MusicEngine.getTrainingMetrics();
    const enhancedMetrics = {
      ...engineMetrics,
      inference_time: actualInferenceTime,
      realtime_performance: {
        predictions_per_second: 1000 / Math.max(actualInferenceTime, 0.1),
        memory_efficiency: layerActivationDetails.reduce((acc, layer) => 
          acc + layer.neuronCount * 4, 0) / 1024, // KB estimate
        neural_efficiency: layerActivationDetails.reduce((acc, layer) => 
          acc + layer.activeNeurons, 0) / layerActivationDetails.reduce((acc, layer) => 
          acc + layer.neuronCount, 0)
      },
      layer_details: layerActivationDetails,
      context_analysis: {
        dominant_input: context.temperature > 0.5 ? 'temperature' : 
                       context.weather_condition > 2 ? 'weather' : 
                       context.user_mood > 2 ? 'mood' : 'time',
        prediction_confidence: Math.max(...newActivations[newActivations.length - 1] || [0]),
        decision_factors: {
          weather_influence: Math.abs(context.weather_condition - 2) * 0.25,
          time_influence: Math.abs(context.hour - 0.5) * 0.3,
          mood_influence: Math.abs(context.user_mood - 2) * 0.35,
          history_influence: context.genre_history.reduce((a, b) => a + b, 0) / 3 * 0.1
        }
      }
    };
    
    setMetrics(enhancedMetrics);

    // Log detailed decision process for transparency
    console.log('🧠 Neural Decision Process:', {
      input_context: context,
      predicted_action: action,
      inference_time: `${actualInferenceTime.toFixed(2)}ms`,
      layer_analysis: layerActivationDetails,
      decision_confidence: enhancedMetrics.context_analysis.prediction_confidence.toFixed(3)
    });

    return action;
  }, [engineState.isReady, layerInfo]);

  // Train the model with user feedback
  const train = useCallback(async (
    context: {
      temperature: number;
      weather_condition: number;
      hour: number;
      day_of_week: number;
      user_mood: number;
      genre_history: number[];
    },
    action: number,
    reward: number
  ) => {
    if (!engineState.isReady || !window.MusicEngine) {
      throw new Error('Neural engine not ready');
    }

    window.MusicEngine.train(
      context.temperature,
      context.weather_condition,
      context.hour,
      context.day_of_week,
      context.user_mood,
      context.genre_history[0] || 0,
      context.genre_history[1] || 0,
      context.genre_history[2] || 0,
      action,
      reward
    );

    // Update metrics after training
    const newMetrics = window.MusicEngine.getTrainingMetrics();
    setMetrics(newMetrics);
  }, [engineState.isReady]);

  // Get Q-values for all actions
  const getQValues = useCallback(async (context: {
    temperature: number;
    weather_condition: number;
    hour: number;
    day_of_week: number;
    user_mood: number;
    genre_history: number[];
  }) => {
    if (!engineState.isReady || !window.MusicEngine) {
      return [];
    }

    return window.MusicEngine.getQValues(
      context.temperature,
      context.weather_condition,
      context.hour,
      context.day_of_week,
      context.user_mood,
      context.genre_history[0] || 0,
      context.genre_history[1] || 0,
      context.genre_history[2] || 0
    );
  }, [engineState.isReady]);

  // Simulate neural activity for demo purposes
  const simulateActivity = useCallback(() => {
    if (!engineState.isReady) return;

    const mockContext = {
      temperature: Math.random() * 2 - 1, // -1 to 1
      weather_condition: Math.floor(Math.random() * 5),
      hour: Math.random(),
      day_of_week: Math.random(),
      user_mood: Math.floor(Math.random() * 5),
      genre_history: [Math.random(), Math.random(), Math.random()]
    };

    predict(mockContext).catch(console.error);
  }, [engineState.isReady, predict]);

  return {
    // State
    ...engineState,
    activations,
    layerInfo,
    metrics,

    // Actions
    predict,
    train,
    getQValues,
    simulateActivity
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    MusicEngine: {
      initialize: () => Promise<void>;
      predict: (...args: number[]) => number;
      train: (...args: number[]) => void;
      getActivations: (layer: number) => number[];
      getLayerInfo: () => LayerInfo[];
      getQValues: (...args: number[]) => number[];
      getTrainingMetrics: () => NeuralMetrics;
    };
  }
}
