import React from "react";
import { Send, Paperclip } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ChatInput = ({ input, setInput, onSend, loading }) => {
  const { theme } = useTheme();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer
      className={`p-4 border-t ${
        theme === "dark" ? "border-slate-800" : "border-gray-200"
      }`}
    >
      <div
        className={`rounded-2xl px-3 py-2 ${
          theme === "dark"
            ? "bg-slate-900"
            : "bg-white border border-gray-300"
        }`}
      >
        {/* TEXTAREA (TOP) */}
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepSeek"
          disabled={loading}
          className={`w-full p-3 resize-none bg-transparent text-sm outline-none ${
            theme === "dark"
              ? "text-white placeholder-gray-400"
              : "text-gray-800 placeholder-gray-500"
          }`}
        />

        {/* BUTTON ROW (BOTTOM) */}
        <div className="flex items-center justify-between mt-2">
          {/* Left buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                theme === "dark"
                  ? "border-slate-700 text-gray-300"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              ⊗ DeepThink
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium border text-blue-500 ${
                theme === "dark"
                  ? "border-slate-700"
                  : "border-gray-300"
              }`}
            >
              🌐 Search
            </button>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "hover:bg-slate-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Paperclip size={18} />
            </button>

            <button
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;
