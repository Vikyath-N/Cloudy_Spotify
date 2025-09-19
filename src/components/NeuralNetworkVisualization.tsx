import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface NeuralNetworkVisualizationProps {
  width?: number;
  height?: number;
  isActive?: boolean;
  activations?: number[][];
  layerInfo?: Array<{name: string; size: number; color: string}>;
}

interface Neuron {
  id: string;
  layer: number;
  index: number;
  x: number;
  y: number;
  activation: number;
  color: string;
}

interface Connection {
  source: Neuron;
  target: Neuron;
  weight: number;
}

export const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({
  width = 800,
  height = 400,
  isActive = false,
  activations = [],
  layerInfo = []
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNeuron, setHoveredNeuron] = useState<Neuron | null>(null);

  // Default layer configuration if none provided
  const defaultLayers = [
    { name: "Input", size: 8, color: "#4CAF50" },
    { name: "Hidden1", size: 64, color: "#2196F3" },
    { name: "Hidden2", size: 32, color: "#FF9800" },
    { name: "Hidden3", size: 16, color: "#9C27B0" },
    { name: "Output", size: 5, color: "#F44336" }
  ];

  const layers = layerInfo.length > 0 ? layerInfo : defaultLayers;

  // Initialize network structure
  useEffect(() => {
    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];

    // Create neurons with better spacing
    layers.forEach((layer, layerIndex) => {
      const layerX = (width / (layers.length + 1)) * (layerIndex + 1);
      
      // Calculate optimal spacing based on layer size
      const maxNeuronsToShow = Math.min(layer.size, 12); // Limit visible neurons for large layers
      const neuronSpacing = Math.min(30, (height - 100) / maxNeuronsToShow);
      const startY = (height - (maxNeuronsToShow * neuronSpacing)) / 2;
      
      // For large layers, sample neurons to display
      const neuronsToShow = layer.size <= 12 ? 
        Array.from({ length: layer.size }, (_, i) => i) :
        Array.from({ length: 12 }, (_, i) => Math.floor(i * layer.size / 12));
      
      neuronsToShow.forEach((neuronIndex, displayIndex) => {
        const neuron: Neuron = {
          id: `${layerIndex}-${neuronIndex}`,
          layer: layerIndex,
          index: neuronIndex,
          x: layerX,
          y: startY + (displayIndex * neuronSpacing) + 40,
          activation: Math.max(0, activations[layerIndex]?.[neuronIndex] || Math.random() * 0.5),
          color: layer.color
        };
        newNeurons.push(neuron);
      });
    });

    // Create connections (sample connections to avoid overcrowding)
    for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
      const sourceLayer = newNeurons.filter(n => n.layer === layerIndex);
      const targetLayer = newNeurons.filter(n => n.layer === layerIndex + 1);
      
      // Sample connections to avoid visual clutter
      const maxConnections = Math.min(100, sourceLayer.length * targetLayer.length);
      const connectionSample = Math.min(maxConnections, 50);
      
      for (let i = 0; i < connectionSample; i++) {
        const sourceNeuron = sourceLayer[Math.floor(Math.random() * sourceLayer.length)];
        const targetNeuron = targetLayer[Math.floor(Math.random() * targetLayer.length)];
        
        newConnections.push({
          source: sourceNeuron,
          target: targetNeuron,
          weight: (Math.random() - 0.5) * 2 // Weight between -1 and 1
        });
      }
    }

    setNeurons(newNeurons);
    setConnections(newConnections);
  }, [width, height, layers, activations]);

  // Update activations
  useEffect(() => {
    if (activations.length > 0) {
      setNeurons(prev => prev.map(neuron => ({
        ...neuron,
        activation: Math.max(0, activations[neuron.layer]?.[neuron.index] || neuron.activation)
      })));
    }
  }, [activations]);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create gradient definitions
    const defs = svg.append("defs");
    
    layers.forEach((layer, i) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `gradient-${i}`)
        .attr("gradientUnits", "objectBoundingBox")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 1).attr("y2", 1);

      gradient.append("stop")
        .attr("stop-color", layer.color)
        .attr("stop-opacity", 0.8);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(layer.color)?.brighter(0.5)?.toString() || layer.color)
        .attr("stop-opacity", 0.3);
    });

    // Draw connections
    const connectionGroup = svg.append("g").attr("class", "connections");
    
    connectionGroup.selectAll(".connection")
      .data(connections)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", d => d.weight > 0 ? "#4CAF50" : "#F44336")
      .attr("stroke-width", d => Math.abs(d.weight) * 2)
      .attr("stroke-opacity", 0.3)
      .attr("class", () => isActive ? "connection connection-active" : "connection");

    // Draw neurons
    const neuronGroup = svg.append("g").attr("class", "neurons");
    
    const neuronSelection = neuronGroup.selectAll(".neuron")
      .data(neurons)
      .enter()
      .append("g")
      .attr("class", "neuron")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Neuron circles
    neuronSelection.append("circle")
      .attr("r", d => Math.max(2, 4 + Math.max(0, d.activation) * 6)) // Ensure positive radius
      .attr("fill", d => `url(#gradient-${d.layer})`)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("class", d => d.activation > 0.5 && isActive ? "neuron-active" : "")
      .on("mouseenter", (event, d) => {
        setHoveredNeuron(d);
        
        // Highlight connected neurons
        svg.selectAll(".connection")
          .attr("stroke-opacity", conn => 
            (conn.source.id === d.id || conn.target.id === d.id) ? 0.8 : 0.1
          );
      })
      .on("mouseleave", () => {
        setHoveredNeuron(null);
        svg.selectAll(".connection").attr("stroke-opacity", 0.3);
      });

    // Layer labels
    const labelGroup = svg.append("g").attr("class", "labels");
    
    layers.forEach((layer, i) => {
      const layerX = (width / (layers.length + 1)) * (i + 1);
      
      labelGroup.append("text")
        .attr("x", layerX)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", layer.color)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(layer.name);

      labelGroup.append("text")
        .attr("x", layerX)
        .attr("y", 45)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .text(`${layer.size} neurons`);
    });

  }, [neurons, connections, isActive, width, height, layers]);

    return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="neural-network-svg w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(15, 15, 35, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Enhanced Tooltip for hovered neuron */}
      {hoveredNeuron && (
        <div className="absolute top-4 left-4 glass-dark p-4 rounded-xl text-sm z-10 border border-white/20 shadow-2xl">
          <div className="font-bold text-white text-base mb-2">
            {layers[hoveredNeuron.layer]?.name} Layer
          </div>
          <div className="text-gray-300 mb-1">
            Neuron #{hoveredNeuron.index + 1}
          </div>
          <div className="text-gray-300 mb-2">
            Activation: <span className="text-orange-400 font-mono">{hoveredNeuron.activation.toFixed(3)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${hoveredNeuron.activation * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Enhanced Network stats overlay */}
      <div className="absolute bottom-4 right-4 glass-dark p-4 rounded-xl text-sm border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-semibold">
            {neurons.filter(n => n.activation > 0.5).length} active neurons
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-blue-400 font-semibold">
            {connections.length} connections
          </span>
        </div>
      </div>
    </div>
  );
};
