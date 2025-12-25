import React from "react";
import { Mafs, Coordinates, Plot } from "mafs";
import { BlockMath, InlineMath } from "react-katex";
import "mafs/core.css";
import "katex/dist/katex.min.css";

function FunctionViz({ config }) {
  if (!config || config.mode !== "analysis") {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p>Select a function from the chat to visualize</p>
      </div>
    );
  }

  const operation = config.operation;
  const title = config.title || "Function Visualization";
  const explanation = config.explanation || "";
  const intuition = config.intuition || "";
  
  // Function transformation parameters
  const amplitude = config.amplitude ?? 1;
  const frequency = config.frequency ?? 1;
  const phase = config.phase ?? 0;

  // Helper to safely render LaTeX in the intuition/explanation
  const renderRichText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>;
      }
      return part;
    });
  };

  return (
    <div className="w-full h-full flex bg-[#0a0a0a] text-white">
      {/* LEFT: INFO PANEL */}
      <div className="w-80 bg-[#1a1a1a] border-r border-[#333] overflow-y-auto p-6 space-y-6 shrink-0">
        <div>
          <h2 className="text-2xl font-light text-white mb-1 tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest opacity-70">Function Analysis</p>
        </div>

        {/* Explanation Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Mathematical Definition</h3>
          <div className="text-sm text-gray-300 leading-relaxed bg-[#252525] p-3 rounded-lg border border-[#333]">
            {renderRichText(explanation)}
          </div>
        </div>

        {/* Intuition Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intuition</h3>
          <div className="text-sm text-gray-300 leading-relaxed bg-[#252525] p-3 rounded-lg border border-[#333]">
            {renderRichText(intuition)}
          </div>
        </div>
      </div>

      {/* RIGHT: THE PLOTTER */}
      <div className="flex-1 relative bg-[#111] min-h-0">
        <Mafs viewBox={{ x: [-10, 10], y: [-4, 4] }} preserveAspectRatio={false}>
          <Coordinates.Cartesian subdivisions={2} opacity={0.15} />

          {/* Dynamic Plotting based on operation */}
          <Plot.OfX
            y={(x) => {
              let result = 0;
              const absX = Math.abs(x);
              
              try {
                switch (operation) {
                  case "sin":
                    result = amplitude * Math.sin(frequency * x + phase);
                    break;
                  case "cos":
                    result = amplitude * Math.cos(frequency * x + phase);
                    break;
                  case "tan": {
                    // Avoid asymptotes by clamping extreme values
                    const val = Math.tan(frequency * x + phase);
                    result = amplitude * (Math.abs(val) > 50 ? NaN : val);
                    break;
                  }
                  case "sinh":
                    result = amplitude * Math.sinh(frequency * x);
                    break;
                  case "cosh":
                    result = amplitude * Math.cosh(frequency * x / 2);
                    break;
                  case "tanh":
                    result = amplitude * Math.tanh(frequency * x);
                    break;
                  case "exp":
                    // Limit exp to prevent overflow
                    const expVal = frequency * x;
                    result = amplitude * (expVal > 100 ? NaN : Math.exp(expVal));
                    break;
                  case "log":
                    result = amplitude * (x > 0 ? Math.log(x * frequency + 1) : NaN);
                    break;
                  case "sqrt":
                    result = amplitude * (x >= 0 ? Math.sqrt(x * frequency) : NaN);
                    break;
                  case "cbrt":
                    result = amplitude * Math.cbrt(x * frequency);
                    break;
                  case "abs":
                    result = amplitude * Math.abs(x * frequency);
                    break;
                  case "reciprocal":
                    result = amplitude * (Math.abs(x) < 0.01 ? NaN : 1 / (x * frequency + 0.1));
                    break;
                  case "asin":
                    const asinVal = x * frequency;
                    result = amplitude * (Math.abs(asinVal) <= 1 ? Math.asin(asinVal) : NaN);
                    break;
                  case "acos":
                    const acosVal = x * frequency;
                    result = amplitude * (Math.abs(acosVal) <= 1 ? Math.acos(acosVal) : NaN);
                    break;
                  default:
                    result = 0;
                }
              } catch (e) {
                result = NaN;
              }
              
              return isNaN(result) || !isFinite(result) ? undefined : result;
            }}
            color="#3b82f6"
            weight={3}
          />
        </Mafs>
      </div>
    </div>
  );
}

export default FunctionViz;