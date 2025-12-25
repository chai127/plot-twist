import React, { useRef, useState, useEffect } from "react";

// Reusable Smooth Slider Component
const SmoothSlider = ({ label, value, min = -5, max = 5, color, onChange }) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to calculate value from mouse X position
  const calculateValue = (clientX) => {
    if (!trackRef.current) return;
    const { left, width } = trackRef.current.getBoundingClientRect();
    let percentage = (clientX - left) / width;
    percentage = Math.max(0, Math.min(1, percentage)); // Clamp between 0 and 1
    const newValue = min + percentage * (max - min);
    // Round to 2 decimals for clean output
    return Math.round(newValue * 100) / 100;
  };

  // --- Slider Drag Handlers ---
  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const newValue = calculateValue(e.clientX);
    onChange(newValue);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // --- Number Scrubbing Handlers (Bonus) ---
  const handleNumberDragStart = (e) => {
    e.target.requestPointerLock();
  };

  const handleNumberDrag = (e) => {
    if (document.pointerLockElement === e.target) {
      // Sensitivity: smaller divisor = faster change
      const delta = e.movementX * 0.05; 
      let newValue = value + delta;
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(Math.round(newValue * 100) / 100);
    }
  };

  const handleNumberDragEnd = () => {
    document.exitPointerLock();
  };

  // Percentage for CSS positioning
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="group flex items-center gap-4 text-sm select-none">
      {/* Label */}
      <span className="w-4 font-mono font-bold text-gray-500 group-hover:text-gray-300 transition-colors cursor-default">
        {label}
      </span>

      {/* Interactive Track Area */}
      <div
        ref={trackRef}
        className="relative flex-1 h-8 flex items-center cursor-ew-resize touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // Safety fallback
      >
        {/* Background Rail */}
        <div className="absolute w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
           {/* Filled Bar (Optional - adds visual weight) */}
           <div 
             className="h-full opacity-30" 
             style={{ width: `${percentage}%`, backgroundColor: color }}
           />
        </div>

        {/* The Thumb / Handle */}
        <div
          className="absolute w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-transform duration-75 ease-out"
          style={{
            left: `${percentage}%`,
            backgroundColor: color,
            color: color,
            transform: `translate(-50%, 0) scale(${isDragging ? 1.3 : 1})`, // Pop effect on drag
          }}
        />
      </div>

      {/* Scrubbable Number Display */}
      <div 
        className="w-12 text-right font-mono text-gray-400 group-hover:text-white transition-colors cursor-ew-resize"
        title="Click and drag to scrub value"
        onPointerDown={handleNumberDragStart}
        onPointerMove={handleNumberDrag}
        onPointerUp={handleNumberDragEnd}
      >
        {Number(value).toFixed(2)}
      </div>
    </div>
  );
};

// Main Component
export default function VectorControls({ config, setVizConfig }) {
  const { a, b } = config.vectors;

  const update = (vec, index, value) => {
    const newVec = [...config.vectors[vec]];
    newVec[index] = parseFloat(value);
    setVizConfig({
      ...config,
      vectors: { ...config.vectors, [vec]: newVec },
    });
  };

  return (
    <div className="p-6 border-t border-[#333] bg-[#1a1a1a] space-y-8 select-none">
      {/* Vector A */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#fcc419] shadow-[0_0_8px_#fcc419]"></div>
          <h3 className="font-bold text-[#fcc419] tracking-widest text-[10px] uppercase opacity-80">
            Vector A
          </h3>
        </div>
        <SmoothSlider label="X" value={a[0]} color="#fcc419" onChange={(v) => update("a", 0, v)} />
        <SmoothSlider label="Y" value={a[1]} color="#fcc419" onChange={(v) => update("a", 1, v)} />
      </div>

      {/* Vector B */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#74c0fc] shadow-[0_0_8px_#74c0fc]"></div>
          <h3 className="font-bold text-[#74c0fc] tracking-widest text-[10px] uppercase opacity-80">
            Vector B
          </h3>
        </div>
        <SmoothSlider label="X" value={b[0]} color="#74c0fc" onChange={(v) => update("b", 0, v)} />
        <SmoothSlider label="Y" value={b[1]} color="#74c0fc" onChange={(v) => update("b", 1, v)} />
      </div>
    </div>
  );
}