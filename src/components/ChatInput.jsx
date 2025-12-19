import React from "react";
import { Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ChatInput = ({ input, setInput, onSend, loading, onButtonClick }) => {
  const { theme } = useTheme();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Button configurations
  const buttons = [
    {
      id: "platform_strategy",
      title: "Platform Strategy",
      description: "I'll ask 5 questions (including location) to recommend best advertising platforms"
    },
    {
      id: "meta_ads_creative", 
      title: "Meta Ads Creative",
      description: "I'll ask 4 questions (including location) to create location-specific Meta Ads strategy"
    },
    {
      id: "google_ads_keywords",
      title: "Google Ads Keywords",
      description: "I'll ask 4 questions (including location) to develop location-specific Google Ads keywords"
    },
    {
      id: "ad_copy",
      title: "Ad Copy",
      description: "I'll ask 7 questions (including location) to generate location-specific ad copies"
    }
  ];

  const handleButtonClick = (e, flowType) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("ChatInput: Button clicked", flowType);
    onButtonClick(flowType);
  };

  return (
    <footer
      className={`p-4 border-t ${
        theme === "dark" ? "border-slate-800" : "border-gray-200"
      }`}
    >
      {/* Button Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={(e) => handleButtonClick(e, btn.id)}
            disabled={loading}
            className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors relative group ${
              theme === "dark"
                ? "border-slate-700 text-gray-300 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
            title={btn.description}
          >
            {btn.title}
            {btn.description && (
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center pointer-events-none z-10 ${
                theme === "dark" 
                  ? "bg-slate-800 text-gray-300 border border-slate-700" 
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}>
                {btn.description}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div>
        <div
          className={`rounded-2xl px-3 py-2 ${
            theme === "dark"
              ? "bg-slate-900"
              : "bg-white border border-gray-300"
          }`}
        >
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

          {/* Send Button */}
          <div className="flex items-center justify-end mt-2">
            <button
              type="button"
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
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