import React from "react";
import VectorAdditionViz from "./VectorAdditionViz";
import VectorDotProductViz from "./VectorDotProductViz";
import FunctionViz from "./FunctionViz"; 
import VectorControls from "./VectorControls";
import FunctionControls from "./FunctionControls";

export default function VisualizationPanel({ config, setVizConfig }) {
  
  const renderViz = () => {
    // 1. Calculus Mode
    if (config.mode === "analysis") {
       return <FunctionViz config={config} setVizConfig={setVizConfig} />;
    }

    // 2. Vector Modes
    if (config.operation === "dot_product") {
        return <VectorDotProductViz config={config} setConfig={setVizConfig} />;
    }
    return <VectorAdditionViz config={config} setConfig={setVizConfig} />;
  };

  // Helper for dynamic title
  const getTitle = () => {
      if (config.mode === "analysis") return "Calculus Analysis";
      if (config.operation === "dot_product") return "Dot Product";
      return "Vector Addition";
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111] h-full overflow-hidden">
      {/* Header - Not overlapping */}
      <div className="shrink-0 px-6 py-6 border-b border-[#333] bg-[#0a0a0a]">
        <h2 className="text-3xl font-light text-white tracking-tight">
          {getTitle()}
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-widest opacity-70">
            Interactive Visualizer
        </p>
      </div>

      {/* Main Visualization - Takes up remaining space */}
      <div className="flex-1 w-full min-h-0 overflow-hidden">
        {renderViz()}
      </div>

      {/* Controls - Fixed at bottom */}
      {config.mode === "analysis" && (
        <FunctionControls config={config} setVizConfig={setVizConfig} />
      )}
      {config.mode !== "analysis" && (
        <VectorControls config={config} setVizConfig={setVizConfig} />
      )}
    </div>
  );
}