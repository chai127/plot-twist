import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function ChatMessage({ role, text }) {
  const isUser = role === "user";

  // --- Custom Parser Logic ---
  const renderContent = (rawText) => {
    // 1. Split by Math Delimiters ($$ or $)
    // This Regex captures the delimiters so we know which is which
    const parts = rawText.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return parts.map((part, index) => {
      // Case A: Block Math ($$ ... $$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <BlockMath key={index}>{part.slice(2, -2)}</BlockMath>;
      }
      
      // Case B: Inline Math ($ ... $)
      if (part.startsWith('$') && part.endsWith('$')) {
        return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
      }

      // Case C: Regular Text (Handle newlines and bolding)
      return (
        <span key={index}>
          {part.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {parseBold(line)}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  // Helper to handle **bold** text without a library
  const parseBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-400 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600/90 text-white shadow-lg shadow-blue-900/20 rounded-br-none"
            : "bg-[#252525] text-gray-200 border border-[#333] rounded-bl-none"
        }`}
      >
        {isUser ? text : renderContent(text)}
      </div>
    </div>
  );
}