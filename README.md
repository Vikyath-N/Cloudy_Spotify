# 🧠 Cloudy Spotify AI

> **Next-Generation Music Recommendation System powered by Reinforcement Learning**

An intelligent web application that combines real-time weather data with advanced neural network-driven music recommendations. Unlike traditional rule-based systems, this AI learns from user preferences and contextual factors to provide personalized music suggestions with complete algorithmic transparency.

![Neural Network Status](https://img.shields.io/badge/Neural%20Network-Active-brightgreen)
![WebAssembly](https://img.shields.io/badge/WebAssembly-C%2B%2B%20Engine-blue)
![React](https://img.shields.io/badge/React-TypeScript-61dafb)
![Reinforcement Learning](https://img.shields.io/badge/ML-Deep%20Q--Network-orange)

## 🚀 **What Makes This Special**

### **🧠 Transparent AI Decision Making**
- **Real-time Neural Network Visualization**: Watch every neuron fire as the AI makes decisions
- **Interactive Layer Exploration**: Click on any layer to see weights, biases, and activations
- **Decision Explanation**: Understand exactly why the AI recommended each song

### **⚡ High-Performance C++ Engine**
- **Sub-millisecond Inference**: Optimized C++ neural network compiled to WebAssembly
- **Reinforcement Learning**: Deep Q-Network that learns from user feedback
- **Memory Efficient**: Advanced memory pooling and SIMD optimizations

### **🎨 Modern Interactive UI**
- **Glassmorphism Design**: Beautiful, modern interface with smooth animations
- **Real-time Visualizations**: D3.js-powered neural network graphics
- **Responsive Layout**: Works perfectly on desktop and mobile

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/TypeScript)              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Weather UI    │  │  Neural Net     │  │   Music Player  │ │
│  │   Dashboard     │  │  Visualizer     │  │   Interface     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │ WebSocket/API
┌─────────────────────────────────────────────────────────────┐
│              C++ RL ENGINE (WebAssembly)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Deep Q-Network │  │   Experience    │  │   Environment   │ │
│  │   (Eigen/C++)   │  │     Buffer      │  │   Simulator     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ **Technology Stack**

### **Frontend**
- **React 19** with TypeScript for type-safe UI development
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for utility-first styling with custom neural network themes
- **D3.js** for interactive data visualizations
- **Three.js** for 3D neural network rendering
- **Framer Motion** for smooth animations

### **AI Engine**
- **C++17** with Eigen library for optimized linear algebra
- **WebAssembly (WASM)** for near-native performance in browsers
- **Deep Q-Network (DQN)** implementation for reinforcement learning
- **Experience Replay Buffer** for stable training

### **Build System**
- **Emscripten** for C++ to WebAssembly compilation
- **CMake** for cross-platform C++ build management
- **GitHub Actions** for automated CI/CD pipeline
- **GitHub Pages** for seamless deployment

## 📁 **Project Structure**

```
Cloudy_Spotify/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── cpp/                # C++ neural network engine
│   │   ├── neural_network.{h,cpp}    # Core neural network
│   │   ├── music_rl_engine.{h,cpp}   # Reinforcement learning
│   │   ├── experience_buffer.h        # Training data management
│   │   └── music_environment.h        # Environment simulation
│   ├── App.tsx             # Main React application
│   └── index.css           # Global styles with neural animations
├── public/                 # Static assets and compiled WASM
├── legacy/                 # Original Flask implementation (archived)
├── package.json            # Node.js dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md              # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Emscripten SDK (for C++ compilation)
- Modern web browser with WebAssembly support

### **Development Setup**

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd Cloudy_Spotify
npm install
```

2. **Setup C++ build environment:**
```bash
npm run setup:eigen  # Downloads Eigen library
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build  # Compiles C++ to WASM and builds React app
```

### **Available Scripts**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run build:wasm` - Compile C++ engine to WebAssembly
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## 🧠 **Neural Network Architecture**

The AI engine uses a Deep Q-Network with the following architecture:

```
Input Layer (8 neurons)
├── Weather temperature (normalized)
├── Weather condition (categorical)
├── Hour of day (cyclical encoding)
├── Day of week (cyclical encoding)
├── User mood (categorical)
└── Listening history (3 recent genres)

Hidden Layer 1 (64 neurons) - ReLU activation
Hidden Layer 2 (32 neurons) - ReLU activation  
Hidden Layer 3 (16 neurons) - ReLU activation

Output Layer (5 neurons) - Softmax activation
├── Chill/Lofi (Q-value)
├── Pop Hits (Q-value)
├── Rock/Energy (Q-value)
├── Jazz/Smooth (Q-value)
└── Electronic/Dance (Q-value)
```

## 🎯 **Features**

### **🤖 AI-Powered Recommendations**
- Learns from user feedback and ratings
- Considers weather, time, and personal preferences
- Continuously improves recommendation accuracy

### **👁️ Neural Network Transparency**
- Real-time visualization of neural network layers
- Interactive exploration of weights and activations
- Decision explanation with confidence scores

### **🌤️ Weather-Aware Intelligence**
- Integrates real-time weather data
- Learns weather-music preference patterns
- Adapts to seasonal and daily patterns

### **📱 Modern User Experience**
- Responsive design for all devices
- Smooth animations and micro-interactions
- Glassmorphism UI with neural network themes

## 🔬 **Advanced Features**

- **Experience Replay**: Stable reinforcement learning with memory buffer
- **Target Network**: Improved training stability with periodic updates
- **Epsilon-Greedy Exploration**: Balanced exploration vs exploitation
- **Real-time Performance Monitoring**: Track inference time and accuracy
- **Model Versioning**: A/B testing with different neural network versions

## 🚀 **Deployment**

The application is designed for seamless deployment to GitHub Pages:

1. **Automated Builds**: GitHub Actions compiles C++ and builds React app
2. **Static Hosting**: No server required - runs entirely in the browser
3. **WASM Distribution**: Optimized WebAssembly modules for fast loading
4. **CDN Delivery**: Global content distribution for optimal performance

## 🤝 **Contributing**

This project showcases cutting-edge web technologies and AI techniques. Contributions are welcome in areas such as:

- Neural network architecture improvements
- Additional music recommendation algorithms  
- Enhanced visualizations and UI components
- Performance optimizations
- Mobile responsiveness enhancements

## 📜 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **Eigen Library** for high-performance linear algebra
- **Emscripten** for enabling C++ in web browsers
- **React Team** for the amazing development experience
- **D3.js Community** for powerful data visualization tools

---

**Built with ❤️ and advanced AI • Powered by C++ • Enhanced by TypeScript • Visualized with D3.js**

## Deployment Note
Deployment is triggered automatically on git push to main via GitHub Actions.