import { Mafs, Coordinates, Vector, Line, MovablePoint } from "mafs";
import "mafs/core.css";
import * as React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// Helper for visual alignment intuition
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

  return `${percent}% ${cosTheta > 0 ? "Helping" : "Hindering"}`;
};

// --- Component ---
export default function VectorDotProductViz({ config, setConfig }) {
  // Safely destructure with defaults
  const vectors = config?.vectors || { a: [0, 0], b: [0, 0] };
  const { a, b } = vectors;
  const aiIntuition = config?.aiIntuition || "";

  // --- 1. MATH ENGINE ---
  const magA = Math.hypot(a[0], a[1]);
  const dotProduct = a[0] * b[0] + a[1] * b[1];

  const angleRadA = Math.atan2(a[1], a[0]);
  const angleRadB = Math.atan2(b[1], b[0]);
  const thetaRad = angleRadB - angleRadA;

  const cosTheta = Math.cos(thetaRad);
  const alignmentText = getAlignmentText(cosTheta);

  const scalarProjection = magA === 0 ? 0 : dotProduct / magA;
  const projection =
    magA === 0
      ? [0, 0]
      : [(scalarProjection / magA) * a[0], (scalarProjection / magA) * a[1]];

  let displayAngle = ((thetaRad * 180) / Math.PI + 360) % 360;
  if (displayAngle > 180) displayAngle -= 360;

  let statusColor = "#40c057";
  if (Math.abs(cosTheta) < 0.05) statusColor = "#868e96";
  else if (cosTheta < 0) statusColor = "#fa5252";

  // --- 2. EVENT HANDLERS ---
  const handleDrag = (vectorName, point) => {
    setConfig({
      ...config,
      vectors: { ...config.vectors, [vectorName]: point },
    });
  };

  const updateBFromSlider = (mag, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180 + angleRadA;
    handleDrag("b", [mag * Math.cos(rad), mag * Math.sin(rad)]);
  };

  // --- 3. RENDER AI INTUITION ---
  const renderAIIntuition = (text) => {
    if (!text) return null;

    return text.split("\n").map((line, idx) => {
      const block = line.match(/^\$\$(.+)\$\$/);
      if (block) return <BlockMath key={idx}>{block[1]}</BlockMath>;

      const parts = line.split(/(\$[^$]+\$)/g);
      return (
        <p key={idx} className="leading-relaxed">
          {parts.map((p, i) => {
            const inline = p.match(/^\$(.+)\$$/);
            return inline ? (
              <InlineMath key={i}>{inline[1]}</InlineMath>
            ) : (
              p
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className="h-full w-full flex bg-[#0a0a0a] overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <div className="w-80 bg-[#1a1a1a] border-r border-[#333] flex flex-col h-full">

        {/* Header */}
        <div className="p-6 shrink-0 border-b border-[#333]">
          <h2 className="text-2xl font-light text-white tracking-tight">Dot Product</h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest opacity-70 mt-1">Alignment & Projection</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">

          {/* Visual Intuition */}
          <div className="bg-[#252525] rounded-lg p-4 border border-[#333]">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">
              Alignment Status
            </span>

            <div className="text-lg font-light mt-3" style={{ color: statusColor }}>
              {alignmentText}
            </div>

            <div className="mt-4 h-2 bg-[#333] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${Math.abs(cosTheta) * 100}%`,
                  backgroundColor: statusColor,
                }}
              />
            </div>

            {aiIntuition && (
              <div className="mt-4 text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                {renderAIIntuition(aiIntuition)}
              </div>
            )}
          </div>

          {/* Math Breakdown */}
          <div className="bg-[#252525] rounded-lg p-4 border border-[#333]">
            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3">Components</div>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between text-gray-300">
                <span>Magnitude A</span>
                <span className="text-[#fcc419]">{magA.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Projection</span>
                <span style={{ color: statusColor }}>
                  {scalarProjection.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-[#333] pt-3 flex justify-between font-bold text-white">
                <span>A · B</span>
                <span>{dotProduct.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Angle Slider (fixed bottom) */}
        <div className="p-6 shrink-0 border-t border-[#333]">
          <div className="flex justify-between mb-3">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Angle θ</span>
            <span className="text-blue-400 text-sm font-mono">
              {displayAngle.toFixed(0)}°
            </span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={displayAngle}
            onChange={(e) =>
              updateBFromSlider(Math.hypot(b[0], b[1]), +e.target.value)
            }
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* ================= CANVAS ================= */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#111]">
        <Mafs viewBox={{ x: [-2, 6], y: [-2, 6] }} pan zoom>
          <Coordinates.Cartesian subdivisions={2} opacity={0.15} />

          <Line.ThroughPoints
            point1={[0, 0]}
            point2={a}
            style="dashed"
            opacity={0.1}
          />

          <Vector tail={[0, 0]} tip={projection} color={statusColor} weight={6} />
          <Vector tail={[0, 0]} tip={a} color="#fcc419" />
          <Vector tail={[0, 0]} tip={b} color="#74c0fc" />

          <MovablePoint point={a} onMove={(p) => handleDrag("a", p)} />
          <MovablePoint point={b} onMove={(p) => handleDrag("b", p)} />
        </Mafs>
      </div>
    </div>
  );
}
