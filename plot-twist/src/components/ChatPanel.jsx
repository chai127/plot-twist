import { useState } from "react"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"

export default function ChatPanel({ setVizConfig }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Welcome to Plot Twist. Ask me to add vectors!" },
  ])

  const handleSend = (text) => {
    setMessages((m) => [...m, { role: "user", text }])
    
    // Simulate AI Response
    setTimeout(() => {
        const aiViz = {
        type: "vector-addition",
        vectors: { a: [3, 1], b: [1, 3] }, // Example change
        showSteps: true,
        }
        setMessages((m) => [
        ...m,
        { role: "ai", text: "Here is the visual representation of that addition." },
        ])
        setVizConfig(aiViz)
    }, 600)
  }

  return (
    <div className="w-[450px] flex flex-col bg-[#161616] border-r border-[#333] shadow-2xl z-10">
      {/* Header */}
      <div className="p-5 border-b border-[#333] bg-[#1a1a1a] flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
        <h1 className="text-gray-100 font-bold tracking-tight">Plot Twist</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}