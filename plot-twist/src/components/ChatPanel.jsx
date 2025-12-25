import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatPanel({ setVizConfig }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Welcome to Newton's Canvas. Ask me to add vectors or calculate derivatives! (Try: 'derivative of sin(x)')" },
  ]);
  const [loading, setLoading] = useState(false);

  // --- THE "FAKE" AI BRAIN ---
  const generateMockResponse = (query) => {
    const q = query.toLowerCase();
    const numbers = query.match(/-?\d+(\.\d+)?/g)?.map(Number);

    // Default Vectors
    let vecA = [3, 0];
    let vecB = [2, 3];

    if (numbers && numbers.length >= 4) {
      vecA = [numbers[0], numbers[1]];
      vecB = [numbers[2], numbers[3]];
    }

    // --- LOGIC A: CALCULUS MODE (Check first) ---
    if (q.includes("derivative") || q.includes("slope") || q.includes("function") || q.includes("curve") || q.includes("sin") || q.includes("cos")) {
        let func = "x^2"; // Default
        if (q.includes("sin")) func = "sin(x)";
        if (q.includes("cos")) func = "cos(x)";
        if (q.includes("tan")) func = "tan(x)";
        if (q.includes("cube") || q.includes("3")) func = "x^3";

        return {
            mode: "analysis", // <--- Important Flag
            type: "derivative",
            func: func,
            xPoint: 1, 
            title: "Derivative Visualizer",
            explanation: `**Calculus Mode:**\n\nWe are looking at the function $f(x) = ${func}$.\n\nThe **Tangent Line** (yellow) shows the slope at a specific point. Drag the point to see how the derivative changes!`
        };
    }

    // --- LOGIC B: VECTOR MULTIPLICATION ---
    if (q.includes("multiply") || q.includes("dot") || q.includes("product")) {
        const dot = (vecA[0]*vecB[0]) + (vecA[1]*vecB[1]);
        return {
            mode: "vector", // <--- Important Flag
            type: "vector",
            operation: "dot_product",
            params: { a: vecA, b: vecB },
            title: "Dot Product",
            explanation: `**Dot Product:**\n\n$$ \\vec{a} \\cdot \\vec{b} = ${dot.toFixed(2)} $$\n\nThis measures how much Vector B points in the same direction as Vector A.`
        };
    }

    // --- LOGIC C: VECTOR ADDITION (Fallback) ---
    const vecC = [vecA[0] + vecB[0], vecA[1] + vecB[1]];
    return {
      mode: "vector", // <--- Important Flag
      type: "vector",
      operation: "addition",
      params: { a: vecA, b: vecB },
      explanation: `**Vector Addition:**\n\n$$ \\vec{c} = \\vec{a} + \\vec{b} = [${vecC[0]}, ${vecC[1]}] $$`
    };
  };

  const handleSend = (text) => {
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    setTimeout(() => {
      const responseData = generateMockResponse(text);

      setMessages((m) => [...m, { role: "ai", text: responseData.explanation }]);
      
      // --- FIX: DYNAMICALLY UPDATE CONFIG ---
      if (responseData.mode === "analysis") {
         // Calculus Mode Update
         setVizConfig({
            mode: "analysis",
            type: "derivative",
            func: responseData.func,
            xPoint: responseData.xPoint
         });
      } else {
         // Vector Mode Update
         setVizConfig({
            mode: "vector",
            type: "vector",
            operation: responseData.operation,
            vectors: responseData.params, // Map 'params' to 'vectors'
            showSteps: true,
         });
      }
      
      setLoading(false);
    }, 600); 
  };

  return (
    <div className="w-[450px] flex flex-col bg-[#161616] border-r border-[#333] shadow-2xl z-10">
      <div className="p-5 border-b border-[#333] bg-[#1a1a1a] flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
        <h1 className="text-gray-100 font-bold tracking-tight">Newton's Canvas</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg, i) => <ChatMessage key={i} {...msg} />)}
        {loading && <div className="text-gray-500 text-sm ml-4">AI is thinking...</div>}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}