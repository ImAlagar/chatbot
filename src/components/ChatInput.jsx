import React from "react";
import { Send, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ChatInput = ({ input, setInput, onSend, loading, onButtonClick, onScrollUp, onScrollDown }) => {
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
      className={`p-4 border-t relative ${
        theme === "dark" ? "border-slate-800" : "border-gray-200"
      }`}
    >
      {/* Scroll buttons for long chats */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          type="button"
          onClick={onScrollUp}
          className={`p-2 rounded-full transition-colors ${
            theme === "dark"
              ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
          }`}
          title="Scroll up"
        >
          <ChevronUp size={20} />
        </button>
        <button
          type="button"
          onClick={onScrollDown}
          className={`p-2 rounded-full transition-colors ${
            theme === "dark"
              ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
          }`}
          title="Scroll down"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Mobile buttons - shown above input on mobile */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-4">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={(e) => handleButtonClick(e, btn.id)}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors relative group ${
              theme === "dark"
                ? "border-slate-700 text-gray-300 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
            title={btn.description}
          >
            {btn.title}
          </button>
        ))}
      </div>

      {/* Input Area - With buttons inside for desktop */}
      <div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            theme === "dark"
              ? "bg-slate-900"
              : "bg-white border border-gray-300"
          }`}
        >


          {/* Textarea and Send Button Row */}
          <div className="flex items-start gap-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message DeepSeek"
              disabled={loading}
              className={`flex-1 p-3 resize-none bg-transparent text-sm outline-none ${
                theme === "dark"
                  ? "text-white placeholder-gray-400"
                  : "text-gray-800 placeholder-gray-500"
              }`}
            />
            
            {/* Send Button */}
            <button
              type="button"
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors self-end"
            >
              <Send size={20} />
            </button>
          </div>

                    {/* Desktop buttons - Inside the input box */}
          <div className="hidden lg:flex flex-wrap gap-2 mb-3">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={(e) => handleButtonClick(e, btn.id)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 relative group ${
                  theme === "dark"
                    ? "border-slate-700 text-gray-200 hover:bg-slate-800 hover:border-slate-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
                }`}
                title={btn.description}
              >
                {btn.title}
                {btn.description && (
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-56 text-center pointer-events-none z-10 ${
                    theme === "dark" 
                      ? "bg-slate-800 text-gray-300 border border-slate-700 shadow-lg" 
                      : "bg-gray-100 text-gray-700 border border-gray-300 shadow-lg"
                  }`}>
                    {btn.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;