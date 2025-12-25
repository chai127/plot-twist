import React, { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import VisualizationPanel from "./components/VisualizationPanel";

export default function App() {
  // Shared State for the Visualization
  const [vizConfig, setVizConfig] = useState({
    type: "vector-addition",
    vectors: { a: [2, 1], b: [1, 3] }, // Default Start State
    showSteps: true,
  });

  return (
    <div className="flex h-screen w-screen bg-[#111] overflow-hidden font-sans text-gray-100">
      {/* Left: Chat Interface */}
      <ChatPanel setVizConfig={setVizConfig} />

      {/* Right: Visualization & Controls */}
      <VisualizationPanel config={vizConfig} setVizConfig={setVizConfig} />
    </div>
  );
}