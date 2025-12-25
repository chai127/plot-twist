import VectorAdditionViz from "./VectorAdditionViz"
import VectorControls from "./VectorControls"

export default function VisualizationPanel({ config, setVizConfig }) {
  return (
    <div className="flex-1 flex flex-col bg-[#111] relative">
      {/* Label Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h2 className="text-2xl font-light text-white tracking-tight">Vector <span className="text-blue-400">Addition</span></h2>
         <p className="text-xs text-gray-500 mt-1 font-mono">INTERACTIVE MODE</p>
      </div>

      <div className="flex-1">
        <VectorAdditionViz config={config} />
      </div>

      <VectorControls config={config} setVizConfig={setVizConfig} />
    </div>
  )
}