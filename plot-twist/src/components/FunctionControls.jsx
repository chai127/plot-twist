import React, { useRef, useState } from "react";

// --- Sub-Component: Smooth Slider ---
const SmoothSlider = ({ label, value, min = -5, max = 10, color, onChange }) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = (clientX) => {
    if (!trackRef.current) return;
    const { left, width } = trackRef.current.getBoundingClientRect();
    let percentage = (clientX - left) / width;
    percentage = Math.max(0, Math.min(1, percentage));
    const newValue = min + percentage * (max - min);
    return Math.round(newValue * 100) / 100;
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(calculateValue(e.clientX));
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    onChange(calculateValue(e.clientX));
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="group flex items-center gap-4 text-sm select-none">
      <span className="w-4 font-mono font-bold text-gray-500 group-hover:text-gray-300 transition-colors cursor-default">{label}</span>
      <div
        ref={trackRef}
        className="relative flex-1 h-8 flex items-center cursor-ew-resize touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
           <div className="h-full opacity-30" style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
        <div
          className="absolute w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-transform duration-75 ease-out"
          style={{
            left: `${percentage}%`,
            backgroundColor: color,
            transform: `translate(-50%, 0) scale(${isDragging ? 1.3 : 1})`,
          }}
        />
      </div>
      <div className="w-12 text-right font-mono text-gray-400">
        {Number(value).toFixed(2)}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function FunctionControls({ config, setVizConfig }) {
  const amplitude = config.amplitude ?? 1;
  const frequency = config.frequency ?? 1;
  const phase = config.phase ?? 0;

  const update = (key, value) => {
    setVizConfig({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="p-6 border-t border-[#333] bg-[#1a1a1a] space-y-6 select-none shadow-2xl">
      {/* Function Parameters */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"></div>
          <h3 className="font-bold text-[#3b82f6] tracking-widest text-[10px] uppercase opacity-80">Function Parameters</h3>
        </div>
        <SmoothSlider 
          label="A" 
          value={amplitude} 
          min={0.1}
          max={3} 
          color="#3b82f6" 
          onChange={(v) => update("amplitude", v)} 
        />
        <SmoothSlider 
          label="F" 
          value={frequency} 
          min={0.1}
          max={3} 
          color="#3b82f6" 
          onChange={(v) => update("frequency", v)} 
        />
        <SmoothSlider 
          label="P" 
          value={phase} 
          min={-Math.PI}
          max={Math.PI} 
          color="#3b82f6" 
          onChange={(v) => update("phase", v)} 
        />
      </div>

      {/* Info Text */}
      <div className="text-[11px] text-gray-500 leading-relaxed space-y-1">
        <p><span className="text-gray-400">A</span> = Amplitude</p>
        <p><span className="text-gray-400">F</span> = Frequency</p>
        <p><span className="text-gray-400">P</span> = Phase Shift</p>
      </div>
    </div>
  );
}
