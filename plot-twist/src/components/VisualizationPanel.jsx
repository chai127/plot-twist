import React from "react";
import VectorAdditionViz from "./VectorAdditionViz";
import VectorDotProductViz from "./VectorDotProductViz";
import FunctionViz from "./FunctionViz"; 
import VectorControls from "./VectorControls"; 

export default function VisualizationPanel({ config, setVizConfig }) {
  
  const renderViz = () => {
    // 1. Calculus Mode
    if (config.mode === "analysis") {
       return <FunctionViz config={config} setVizConfig={setVizConfig} />;
    }

    // 2. Vector Modes
    if (config.operation === "dot_product") {
        return <VectorDotProductViz config={config} />;
    }
    return <VectorAdditionViz config={config} />;
  };

  // Helper for dynamic title
  const getTitle = () => {
      if (config.mode === "analysis") return "Calculus Analysis";
      if (config.operation === "dot_product") return "Dot Product";
      return "Vector Addition";
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111] relative h-full">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-3xl font-light text-white tracking-tight">
          {getTitle()}
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-widest opacity-70">
            Interactive Visualizer
        </p>
      </div>

      <div className="flex-1 w-full h-full">
        {renderViz()}
      </div>

      {/* Only show vector sliders if we are NOT in analysis mode */}
      {config.mode !== "analysis" && (
        <div className="z-20">
          <VectorControls config={config} setVizConfig={setVizConfig} />
        </div>
      )}
    </div>
  );
}