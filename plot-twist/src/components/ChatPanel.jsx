import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatPanel({ setVizConfig }) {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Welcome to Plot Twist. Ask me to add vectors or calculate derivatives! (Try: 'derivative of sin(x)')" },
    ]);
    const [loading, setLoading] = useState(false);

    // Get API URL from environment or use relative path (for same-origin requests)
    const API_BASE_URL = import.meta.env.VITE_API_URL || "";

    // // --- THE "FAKE" AI BRAIN ---
    // const generateMockResponse = (query) => {
    //   const q = query.toLowerCase();
    //   const numbers = query.match(/-?\d+(\.\d+)?/g)?.map(Number);

    //   // Default Vectors
    //   let vecA = [3, 0];
    //   let vecB = [2, 3];

    //   if (numbers && numbers.length >= 4) {
    //     vecA = [numbers[0], numbers[1]];
    //     vecB = [numbers[2], numbers[3]];
    //   }

    //   // --- LOGIC A: CALCULUS MODE (Check first) ---
    //   if (q.includes("derivative") || q.includes("slope") || q.includes("function") || q.includes("curve") || q.includes("sin") || q.includes("cos")) {
    //       let func = "x^2"; // Default
    //       if (q.includes("sin")) func = "sin(x)";
    //       if (q.includes("cos")) func = "cos(x)";
    //       if (q.includes("tan")) func = "tan(x)";
    //       if (q.includes("cube") || q.includes("3")) func = "x^3";

    //       return {
    //           mode: "analysis", // <--- Important Flag
    //           type: "derivative",
    //           func: func,
    //           xPoint: 1, 
    //           title: "Derivative Visualizer",
    //           explanation: `**Calculus Mode:**\n\nWe are looking at the function $f(x) = ${func}$.\n\nThe **Tangent Line** (yellow) shows the slope at a specific point. Drag the point to see how the derivative changes!`
    //       };
    //   }

    //   // --- LOGIC B: VECTOR MULTIPLICATION ---
    //   if (q.includes("multiply") || q.includes("dot") || q.includes("product")) {
    //       const dot = (vecA[0]*vecB[0]) + (vecA[1]*vecB[1]);
    //       return {
    //           mode: "vector", // <--- Important Flag
    //           type: "vector",
    //           operation: "dot_product",
    //           params: { a: vecA, b: vecB },
    //           title: "Dot Product",
    //           explanation: `**Dot Product:**\n\n$$ \\vec{a} \\cdot \\vec{b} = ${dot.toFixed(2)} $$\n\nThis measures how much Vector B points in the same direction as Vector A.`
    //       };
    //   }

    //   // --- LOGIC C: VECTOR ADDITION (Fallback) ---
    //   const vecC = [vecA[0] + vecB[0], vecA[1] + vecB[1]];
    //   return {
    //     mode: "vector", // <--- Important Flag
    //     type: "vector",
    //     operation: "addition",
    //     params: { a: vecA, b: vecB },
    //     explanation: `**Vector Addition:**\n\n$$ \\vec{c} = \\vec{a} + \\vec{b} = [${vecC[0]}, ${vecC[1]}] $$`
    //   };
    // };

    const queryBackend = async (text) => {
       const res = await fetch("http://localhost:5000/api/vector", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: text }),
});

        if (!res.ok) {
            throw new Error("Backend error");
        }

        return res.json();
    };


    const handleSend = async (text) => {
        setMessages((m) => [...m, { role: "user", text }]);
        setLoading(true);

        const isFunction =
            /sin|cos|tan|log|sqrt|exp|sinh|cosh|tanh|cbrt|abs|reciprocal|asin|acos|function|curve/i.test(text);

        const endpoint = isFunction
            ? `${API_BASE_URL}/api/function`
            : `${API_BASE_URL}/api/vector`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: text }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages((m) => [
                ...m,
                {
                    role: "ai",
                    text: data.explanation + "\n\n" + data.intuition,
                },
            ]);

            // For vector operations, convert params to vectors
            if (data.type === "vector") {
                setVizConfig({
                    mode: "vector",
                    type: data.type,
                    operation: data.operation,
                    params: data.params,
                    vectors: data.params,  // Add this for VectorAdditionViz compatibility
                    title: data.title,
                    explanation: data.explanation,
                    intuition: data.intuition,
                });
            } else {
                // For function operations
                setVizConfig({
                    mode: "analysis",
                    type: data.type,
                    operation: data.operation,
                    title: data.title,
                    explanation: data.explanation,
                    intuition: data.intuition,
                    amplitude: 1,
                    frequency: 1,
                    phase: 0,
                });
            }

        } catch (error) {
            console.error("Error:", error);
            setMessages((m) => [
                ...m,
                { role: "ai", text: "❌ Error: " + error.message + ". Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-[450px] h-screen flex flex-col bg-[#0a0a0a] border-r border-[#333] shadow-2xl z-10">

            {/* Header */}
            <div className="p-6 border-b border-[#333] bg-[#1a1a1a] flex items-center gap-3 shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div>
                    <h1 className="text-white font-light text-lg tracking-tight">Plot Twist</h1>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest opacity-70">Interactive Math Tutor</p>
                </div>
            </div>

            {/* Messages (SCROLLS) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} {...msg} />
                ))}
                {loading && (
                    <div className="text-gray-500 text-sm ml-4 italic">
                        🤖 AI is thinking...
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} />
        </div>
    );

}