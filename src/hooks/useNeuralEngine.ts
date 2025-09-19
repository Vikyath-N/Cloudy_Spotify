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
        script.src = '/music_engine_mock.js';
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

  // Predict music recommendation
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
    const inferenceTime = endTime - startTime;

    // Update activations for visualization
    const newActivations: number[][] = [];
    for (let i = 0; i < layerInfo.length; i++) {
      newActivations.push(window.MusicEngine.getActivations(i));
    }
    setActivations(newActivations);

    // Update metrics
    const newMetrics = window.MusicEngine.getTrainingMetrics();
    setMetrics({
      ...newMetrics,
      inference_time: inferenceTime
    });

    return action;
  }, [engineState.isReady, layerInfo.length]);

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
