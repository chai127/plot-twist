export default function ChatMessage({ role, text }) {
    const isUser = role === "user"
  
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-600/90 text-white shadow-lg shadow-blue-900/20 rounded-br-none"
              : "bg-[#252525] text-gray-200 border border-[#333] rounded-bl-none"
          }`}
        >
          {text}
        </div>
      </div>
    )
  }