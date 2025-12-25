import { useState } from "react"
import ChatPanel from "./components/ChatPanel"
import VisualizationPanel from "./components/VisualizationPanel"

export default function App() {
  const [vizConfig, setVizConfig] = useState({
    type: "vector-addition",
    vectors: {
      a: [2, 1],
      b: [1, 2],
    },
    showSteps: true,
  })

  return (
    <div className="h-screen w-screen flex bg-[#111111] text-[#ece6d9] overflow-hidden">
      <ChatPanel setVizConfig={setVizConfig} />
      <VisualizationPanel config={vizConfig} setVizConfig={setVizConfig} />
    </div>
  )
}
