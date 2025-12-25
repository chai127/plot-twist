import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-5 border-t border-[#333] bg-[#1a1a1a] shrink-0">
      <div className="relative flex items-center gap-2">
        <input
          className="flex-1 bg-[#252525] text-gray-200 rounded-lg px-4 py-3 outline-none border border-[#333] focus:border-blue-500 transition-colors placeholder-gray-600 text-sm"
          placeholder="Ask math questions... (e.g. 'sin(x)', 'add vectors 2,3 and 4,1')"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 shrink-0"
          title="Send (Enter)"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}