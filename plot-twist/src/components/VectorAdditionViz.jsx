import { Mafs, Coordinates, Vector, Text, MovablePoint } from "mafs";
import "mafs/core.css";
import * as React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function VectorAdditionViz({ config, setConfig }) {
  // Safely destructure with defaults
  const vectors = config?.vectors || { a: [0, 0], b: [0, 0] };
  const { a, b } = vectors;

  // --- 1. MATH LOGIC ---
  const result = [a[0] + b[0], a[1] + b[1]];
  const totalDisplacement = Math.hypot(result[0], result[1]);

  // --- 2. DRAG HANDLER ---
  const handleDrag = (vectorName, point) => {
    setConfig((prev) => ({
      ...prev,
      vectors: { ...prev.vectors, [vectorName]: point },
    }));
  };

  // --- 3. AI INTUITION STATE ---
  const [aiIntuition, setAiIntuition] = React.useState("");

  // --- 4. FETCH AI INTUITION ---
  const fetchAIIntuition = async (vectorA, vectorB) => {
    try {
      const response = await fetch("http://localhost:5000/api/vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Explain the addition of vector A [${vectorA[0].toFixed(
            1
          )}, ${vectorA[1].toFixed(1)}] and vector B [${vectorB[0].toFixed(
            1
          )}, ${vectorB[1].toFixed(1)}]`,
        }),
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setAiIntuition(data.intuition);
    } catch (err) {
      setAiIntuition(
        `Think of it as a journey:\nVector A goes first, then Vector B.\nThe resultant is $$[${result[0].toFixed(
          1
        )}, ${result[1].toFixed(1)}]$$.`
      );
    }
  };

  // Debounced fetch
  React.useEffect(() => {
    const id = setTimeout(() => fetchAIIntuition(a, b), 500);
    return () => clearTimeout(id);
  }, [a, b]);

  // --- 5. RENDER LATEX ---
  const renderAIIntuition = (text) =>
    text.split("\n").map((line, idx) => {
      const block = line.match(/^\$\$(.+)\$\$/);
      if (block)
        return (
          <div key={idx} className="my-1 overflow-x-auto">
            <BlockMath>{block[1]}</BlockMath>
          </div>
        );

      const parts = line.split(/(\$[^$]+\$)/g);
      return (
        <p key={idx} className="leading-relaxed my-1">
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

  return (
    <div className="h-full w-full flex bg-[#0a0a0a] overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <div className="w-80 bg-[#1a1a1a] border-r border-[#333] flex flex-col h-full">

        {/* Header */}
        <div className="p-6 shrink-0 border-b border-[#333]">
          <h2 className="text-2xl font-light text-white tracking-tight">Vector Addition</h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest opacity-70 mt-1">Interactive Visualization</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">

          {/* Net Displacement */}
          <div className="bg-[#252525] rounded-lg p-4 border border-[#333]">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">
              Net Displacement
            </span>
            <div className="text-2xl font-light mt-2 text-[#ff6b6b]">
              {totalDisplacement.toFixed(2)} units
            </div>
            <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
              The red vector is the shortcut from origin to destination.
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3">Components</div>
            <div className="bg-[#252525] rounded-lg p-3 border border-[#333] font-mono text-sm">
              <div className="flex justify-between text-[#fcc419] mb-2">
                <span>Vector A:</span>
                <span>[{a[0].toFixed(1)}, {a[1].toFixed(1)}]</span>
              </div>
              <div className="flex justify-between text-[#74c0fc] mb-3">
                <span>Vector B:</span>
                <span>[{b[0].toFixed(1)}, {b[1].toFixed(1)}]</span>
              </div>
              <div className="border-t border-[#333] pt-3 flex justify-between font-bold text-white">
                <span>Result:</span>
                <span>
                  [{result[0].toFixed(1)}, {result[1].toFixed(1)}]
                </span>
              </div>
            </div>
          </div>

          {/* AI Intuition */}
          {aiIntuition && (
            <div className="bg-[#252525] rounded-lg p-4 border border-[#333]">
              <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3">
                Intuition
              </div>
              <div className="text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto">
                {renderAIIntuition(aiIntuition)}
              </div>
            </div>
          )}
        </div>

        {/* Footer Tip */}
        <div className="p-4 shrink-0 border-t border-[#333] text-[11px] text-blue-400/70 leading-relaxed">
          💡 Order doesn't matter: A + B = B + A
        </div>
      </div>

      {/* ================= CANVAS ================= */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-[#111]">
        <Mafs viewBox={{ x: [-1, 7], y: [-1, 7] }} preserveAspectRatio={false} pan zoom>
          <Coordinates.Cartesian subdivisions={2} opacity={0.15} />

          <Vector tail={a} tip={result} color="#74c0fc" opacity={0.3} weight={2} style="dashed" />
          <Vector tail={b} tip={result} color="#fcc419" opacity={0.3} weight={2} style="dashed" />

          <Vector tail={[0, 0]} tip={result} color="#ff6b6b" weight={5} />
          <Text x={result[0]} y={result[1]} attach="ne" className="text-[#ff6b6b] text-xs font-bold">
            A + B
          </Text>

          <Vector tail={[0, 0]} tip={a} color="#fcc419" weight={4} />
          <Vector tail={[0, 0]} tip={b} color="#74c0fc" weight={4} />

          <MovablePoint point={a} color="#fcc419" onMove={(p) => handleDrag("a", p)} />
          <MovablePoint point={b} color="#74c0fc" onMove={(p) => handleDrag("b", p)} />
        </Mafs>
      </div>
    </div>
  );
}
