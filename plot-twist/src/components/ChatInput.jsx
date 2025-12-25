import { useState } from "react"
import { Send } from "lucide-react" 

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("")

  const submit = () => {
    if (!value.trim()) return
    onSend(value)
    setValue("")
  }

  return (
    <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
      <div className="relative flex items-center">
        <input
          className="w-full bg-[#111] text-gray-200 rounded-xl px-4 py-3 pr-12 outline-none border border-[#333] focus:border-blue-500 transition-colors placeholder-gray-600 text-sm"
          placeholder="Ask a math question..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}