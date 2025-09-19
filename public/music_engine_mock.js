// Mock WebAssembly module for development
// This simulates the C++ neural network until we have Emscripten compiled WASM

// Prevent duplicate class declarations
if (typeof MockMusicEngine === 'undefined') {
  class MockMusicEngine {
  constructor() {
    this.isReady = false;
    this.layers = [
      { name: "Input", size: 8, neurons: new Array(8).fill(0) },
      { name: "Hidden1", size: 64, neurons: new Array(64).fill(0) },
      { name: "Hidden2", size: 32, neurons: new Array(32).fill(0) },
      { name: "Hidden3", size: 16, neurons: new Array(16).fill(0) },
      { name: "Output", size: 5, neurons: new Array(5).fill(0) }
    ];
    this.training_step = 0;
    this.epsilon = 0.1;
  }

  initialize() {
    return new Promise((resolve) => {
      // Use requestAnimationFrame for smoother initialization
      requestAnimationFrame(() => {
        this.isReady = true;
        console.log("🧠 Mock Neural Network Engine initialized");
        resolve();
      });
    });
  }

  predict(temperature, weather_condition, hour, day_of_week, user_mood, 
          genre_history_1, genre_history_2, genre_history_3) {
    
    if (!this.isReady) {
      console.warn("Engine not initialized");
      return 0;
    }

    // Simulate neural network forward pass
    const input = [temperature, weather_condition, hour, day_of_week, 
                   user_mood, genre_history_1, genre_history_2, genre_history_3];
    
    // Update input layer activations
    this.layers[0].neurons = [...input];
    
    // Simulate forward propagation with random activations
    for (let i = 1; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].size; j++) {
        // Simulate ReLU activation with some logic based on inputs
        let activation = 0;
        for (let k = 0; k < this.layers[i-1].size; k++) {
          activation += this.layers[i-1].neurons[k] * (Math.random() - 0.5);
        }
        this.layers[i].neurons[j] = Math.max(0, activation + Math.random() * 0.5);
      }
    }
    
    // Apply softmax to output layer
    const output = this.layers[4].neurons;
    const max = Math.max(...output);
    const exp_values = output.map(x => Math.exp(x - max));
    const sum_exp = exp_values.reduce((a, b) => a + b, 0);
    this.layers[4].neurons = exp_values.map(x => x / sum_exp);
    
    // Return action with highest Q-value
    let best_action = 0;
    for (let i = 1; i < output.length; i++) {
      if (this.layers[4].neurons[i] > this.layers[4].neurons[best_action]) {
        best_action = i;
      }
    }
    
    return best_action;
  }

  train(temperature, weather_condition, hour, day_of_week, user_mood,
        genre_history_1, genre_history_2, genre_history_3, action, reward) {
    
    this.training_step++;
    
    // Simulate training by slightly adjusting activations based on reward
    const reward_factor = reward > 0 ? 1.1 : 0.9;
    
    for (let i = 1; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].size; j++) {
        this.layers[i].neurons[j] *= reward_factor + (Math.random() - 0.5) * 0.1;
        this.layers[i].neurons[j] = Math.max(0, this.layers[i].neurons[j]); // ReLU
      }
    }
    
    console.log(`🎯 Training step ${this.training_step}: action=${action}, reward=${reward}`);
  }

  getActivations(layer) {
    if (layer < 0 || layer >= this.layers.length) {
      return [];
    }
    return [...this.layers[layer].neurons];
  }

  getLayerInfo() {
    return this.layers.map(layer => ({
      name: layer.name,
      size: layer.size,
      color: this.getLayerColor(layer.name)
    }));
  }

  getLayerColor(name) {
    const colors = {
      "Input": "#4CAF50",
      "Hidden1": "#2196F3", 
      "Hidden2": "#FF9800",
      "Hidden3": "#9C27B0",
      "Output": "#F44336"
    };
    return colors[name] || "#666666";
  }

  getQValues(temperature, weather_condition, hour, day_of_week, user_mood,
             genre_history_1, genre_history_2, genre_history_3) {
    this.predict(temperature, weather_condition, hour, day_of_week, user_mood,
                genre_history_1, genre_history_2, genre_history_3);
    return this.getActivations(4); // Return output layer activations
  }

  getTrainingMetrics() {
    return {
      training_step: this.training_step,
      epsilon: this.epsilon,
      inference_time: Math.random() * 5 + 1, // Mock 1-6ms
      accuracy: Math.random() * 0.2 + 0.8,   // Mock 80-100%
      loss: Math.random() * 0.5 + 0.1        // Mock 0.1-0.6
    };
  }
  }

  // Global instance
  window.MusicEngine = new MockMusicEngine();

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockMusicEngine;
  }
}
