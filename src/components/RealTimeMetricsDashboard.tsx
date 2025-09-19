import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Activity, 
  TrendingUp, 
  Clock, 
  Database,
  Cpu,
  BarChart3
} from 'lucide-react';

interface MetricsProps {
  metrics: {
    inference_time?: number;
    accuracy?: number;
    training_step?: number;
    epsilon?: number;
    loss?: number;
    experience_buffer_size?: number;
    recent_rewards?: number[];
    layer_details?: Array<{
      layerIndex: number;
      layerName: string;
      neuronCount: number;
      activeNeurons: number;
      maxActivation: number;
      avgActivation: number;
    }>;
    realtime_performance?: {
      predictions_per_second: number;
      memory_efficiency: number;
      neural_efficiency: number;
    };
    context_analysis?: {
      dominant_input: string;
      prediction_confidence: number;
      decision_factors: Record<string, number>;
    };
  };
  isActive: boolean;
}

interface MetricCardProps {
  icon: React.ComponentType<{className?: string}>;
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  unit = '', 
  trend, 
  color, 
  description 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="glass-dark p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>
      {trend && (
        <div className={`text-xs px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-500/20 text-green-400' :
          trend === 'down' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </div>
      )}
    </div>
    
    <div className="flex items-baseline space-x-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      {unit && <span className="text-sm text-gray-400">{unit}</span>}
    </div>
    
    {description && (
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    )}
  </motion.div>
);

export const RealTimeMetricsDashboard: React.FC<MetricsProps> = ({ metrics, isActive }) => {
  const [, setRealtimeStats] = useState({
    predictionsCount: 0,
    avgInferenceTime: 0,
    totalNeuralActivity: 0
  });

  useEffect(() => {
    if (isActive && metrics) {
      setRealtimeStats(prev => ({
        predictionsCount: prev.predictionsCount + 1,
        avgInferenceTime: (prev.avgInferenceTime + (metrics.inference_time || 0)) / 2,
        totalNeuralActivity: prev.totalNeuralActivity + (metrics.layer_details?.reduce((acc: number, layer) => 
          acc + layer.activeNeurons, 0) || 0)
      }));
    }
  }, [metrics, isActive]);

  if (!metrics) {
    return (
      <div className="glass-dark p-6 rounded-2xl border border-white/10">
        <div className="text-center text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Waiting for neural network activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Zap}
          title="Inference Time"
          value={metrics.inference_time?.toFixed(2) || '0.00'}
          unit="ms"
          trend={(metrics.inference_time || 0) < 1 ? 'up' : (metrics.inference_time || 0) < 3 ? 'stable' : 'down'}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          description="Neural network execution speed"
        />
        
        <MetricCard
          icon={TrendingUp}
          title="Accuracy"
          value={((metrics.accuracy || 0) * 100).toFixed(1)}
          unit="%"
          trend={(metrics.accuracy || 0) > 0.8 ? 'up' : 'stable'}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          description="Prediction accuracy rate"
        />
        
        <MetricCard
          icon={Activity}
          title="Active Neurons"
          value={metrics.layer_details?.reduce((acc: number, layer) => 
            acc + layer.activeNeurons, 0) || 0}
          trend="stable"
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          description="Currently firing neurons"
        />
        
        <MetricCard
          icon={Database}
          title="Experience"
          value={metrics.experience_buffer_size || 0}
          trend={(metrics.experience_buffer_size || 0) > 100 ? 'up' : 'stable'}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          description="Training experiences stored"
        />
      </div>

      {/* Real-time Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Real-time Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Predictions/sec</div>
            <div className="text-xl font-bold text-green-400">
              {(metrics.realtime_performance?.predictions_per_second || 0).toFixed(0)}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Memory Usage</div>
            <div className="text-xl font-bold text-blue-400">
              {(metrics.realtime_performance?.memory_efficiency || 0).toFixed(1)} KB
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Neural Efficiency</div>
            <div className="text-xl font-bold text-purple-400">
              {((metrics.realtime_performance?.neural_efficiency || 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decision Transparency */}
      {metrics.context_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Decision Transparency</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Dominant Factor:</span>
              <span className="text-sm font-medium text-orange-400 capitalize">
                {metrics.context_analysis.dominant_input}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Confidence:</span>
              <span className="text-sm font-medium text-green-400">
                {(metrics.context_analysis.prediction_confidence * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-400 mb-2">Decision Factors:</div>
              {Object.entries(metrics.context_analysis.decision_factors || {}).map(([factor, influence]: [string, number]) => (
                <div key={factor} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 w-20 capitalize">
                    {factor.replace('_influence', '')}:
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(influence * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12">
                    {(influence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Training Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Training Progress</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Training Steps:</span>
              <span className="text-sm font-medium text-white">{metrics.training_step || 0}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Exploration Rate:</span>
              <span className="text-sm font-medium text-blue-400">
                {((metrics.epsilon || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Loss:</span>
              <span className="text-sm font-medium text-red-400">
                {(metrics.loss || 0).toFixed(3)}
              </span>
            </div>
          </div>
          
          {metrics.recent_rewards && (
            <div>
              <div className="text-sm text-gray-400 mb-2">Recent Rewards:</div>
              <div className="flex items-center space-x-1">
                {metrics.recent_rewards.slice(-8).map((reward: number, i: number) => (
                  <div
                    key={i}
                    className={`w-3 h-6 rounded-sm ${
                      reward > 0 ? 'bg-green-500' : reward < 0 ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ opacity: 0.3 + (i / 8) * 0.7 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
