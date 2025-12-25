import { Mafs, Coordinates, Vector, Line, Text, MovablePoint } from "mafs";
import "mafs/core.css";
import * as React from "react";

// Helper for the alignment intuition text
const getAlignmentText = (cosTheta) => {
  const percent = Math.round(Math.abs(cosTheta) * 100);
  
  if (Math.abs(cosTheta) > 0.99) {
    return cosTheta > 0 
      ? "🚀 100% Alignment (Max Boost)" 
      : "⛔ 100% Opposition (Full Drag)";
  }
  if (Math.abs(cosTheta) < 0.05) {
    return "😐 0% Alignment (Irrelevant)";
  }
  
  const direction = cosTheta > 0 ? "Helping" : "Hindering";
  return `${percent}% ${direction}`;
};

export default function VectorDotProductViz({ config, setConfig }) {
  const { a, b } = config.vectors;

  // --- 1. MATH ENGINE ---
  const magA = Math.hypot(a[0], a[1]);
  const magB = Math.hypot(b[0], b[1]);
  const dotProduct = (a[0] * b[0]) + (a[1] * b[1]);

  // Angle Math
  const angleRadA = Math.atan2(a[1], a[0]);
  const angleRadB = Math.atan2(b[1], b[0]);
  let thetaRad = angleRadB - angleRadA;
  
  // Normalize theta for the UI display (-180 to 180)
  const thetaDegRaw = (thetaRad * 180) / Math.PI;
  let displayAngle = ((thetaDegRaw % 360) + 360) % 360; 
  if (displayAngle > 180) displayAngle -= 360; 

  const cosTheta = Math.cos(thetaRad); 
  const alignmentText = getAlignmentText(cosTheta);

  // Projection Logic (The Shadow)
  const scalarProjection = magA === 0 ? 0 : dotProduct / magA;
  const projX = magA === 0 ? 0 : (scalarProjection / magA) * a[0];
  const projY = magA === 0 ? 0 : (scalarProjection / magA) * a[1];
  const projection = [projX, projY];

  // --- 2. EVENT HANDLERS ---
  
  // Direct Drag Handler
  const handleDrag = (vectorName, point) => {
    setConfig({
      ...config,
      vectors: { ...config.vectors, [vectorName]: point }
    });
  };

  // Sidebar Slider Handler (Polar -> Cartesian)
  const updateBFromSlider = (newMag, newAngleDeg) => {
    const newAngleRad = (newAngleDeg * Math.PI) / 180 + angleRadA;
    const newBx = newMag * Math.cos(newAngleRad);
    const newBy = newMag * Math.sin(newAngleRad);
    handleDrag('b', [newBx, newBy]);
  };

  // Intuition Color Coding
  let statusColor = "#40c057"; // Green (Helping)
  if (Math.abs(cosTheta) < 0.05) statusColor = "#868e96"; // Grey (Neutral)
  else if (cosTheta < 0) statusColor = "#fa5252"; // Red (Opposing)

  return (
    <div className="relative h-full w-full bg-[#1a1a1a] rounded-xl overflow-hidden font-sans select-none flex flex-col md:flex-row">
      
      {/* --- SIDEBAR CONTROLS --- */}
      <div className="md:w-80 w-full bg-[#111] border-r border-gray-800 p-5 flex flex-col gap-6 overflow-y-auto z-10 shadow-2xl">
        <div className="border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Dot Product</h2>
          <p className="text-gray-400 text-xs">A measure of alignment and projection.</p>
        </div>

        {/* Intuition Panel */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-inner">
           <span className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Intuition</span>
           <div className="text-md font-bold mt-1 leading-tight" style={{ color: statusColor }}>
             {alignmentText}
           </div>
           <div className="mt-3 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
             <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${Math.abs(cosTheta) * 100}%`,
                  backgroundColor: statusColor, 
                  opacity: 0.9 
                }}
             />
           </div>
        </div>

        {/* Math Breakdown */}
        <div className="space-y-2 text-[13px] font-mono text-gray-400">
            <div className="flex justify-between italic">
               <span>Base |A|</span>
               <span className="text-[#fcc419]">{magA.toFixed(1)}</span>
            </div>
            <div className="flex justify-between italic">
               <span>Shadow |B|cos(θ)</span>
               <span style={{ color: statusColor }}>{scalarProjection.toFixed(1)}</span>
            </div>
             <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-white text-base">
               <span>Result</span>
               <span>{dotProduct.toFixed(2)}</span>
            </div>
        </div>

        {/* Manual Input Sliders */}
        <div className="space-y-5 pt-4 border-t border-gray-800">
           <label className="block">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-400 uppercase font-black">Angle (θ)</span>
                <span className="text-blue-400 font-mono text-xs">{displayAngle.toFixed(0)}°</span>
             </div>
             <input 
               type="range" min="-180" max="180" 
               value={displayAngle.toFixed(0)}
               onChange={(e) => updateBFromSlider(magB, parseFloat(e.target.value))}
               className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
           </label>
           
           <div className="bg-blue-500/5 p-3 rounded-md border border-blue-500/10">
             <p className="text-[10px] text-blue-300/60 leading-relaxed italic">
               💡 Interact: You can drag the arrow tips directly on the graph or use the slider for precise angles.
             </p>
           </div>
        </div>
      </div>

      {/* --- INTERACTIVE CANVAS --- */}
      <div className="flex-1 relative cursor-crosshair">
        <Mafs
          viewBox={{ x: [-2, 6], y: [-2, 6] }}
          preserveAspectRatio={false}
          pan={true} 
          zoom={true}
        >
          <Coordinates.Cartesian subdivisions={2} opacity={0.15} />

          {/* Guidelines */}
          <Line.ThroughPoints point1={[0, 0]} point2={a} style="dashed" opacity={0.1} color="#fcc419" />

          {/* The Shadow (Projection) - Visually placed under the main vectors */}
          <Vector tail={[0, 0]} tip={projection} color={statusColor} weight={6} opacity={0.5} />
          <Text x={projX} y={projY} attach={scalarProjection >= 0 ? "nw" : "ne"} className="text-[10px] font-black uppercase tracking-tighter" style={{ fill: statusColor }}>
             Shadow
          </Text>
          <Line.Segment point1={b} point2={projection} style="dashed" opacity={0.3} color="white" />

          {/* Vector A */}
          <Vector tail={[0, 0]} tip={a} color="#fcc419" weight={4} />
          <Text x={a[0]} y={a[1]} attach="sw" className="text-yellow-400 font-bold translate-y-2">A</Text>

          {/* Vector B */}
          <Vector tail={[0, 0]} tip={b} color="#74c0fc" weight={4} />
          <Text x={b[0]} y={b[1]} attach="ne" className="text-blue-400 font-bold">B</Text>

          {/* --- DRAG HANDLES (RENDERED LAST TO BE ON TOP) --- */}
          <MovablePoint 
            point={a} 
            color="#fcc419" 
            onMove={(p) => handleDrag('a', p)} 
          />
          <MovablePoint 
            point={b} 
            color="#74c0fc" 
            onMove={(p) => handleDrag('b', p)} 
          />
        </Mafs>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 text-[9px] uppercase tracking-widest text-gray-500 bg-black/80 backdrop-blur-sm border border-gray-800 px-3 py-1.5 rounded-full pointer-events-none">
          Scroll: Zoom • Drag BG: Pan • Tips: Move Vectors
        </div>
      </div>
    </div>
  );
}