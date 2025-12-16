import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ChatMessages = ({ messages, loading }) => {
  const { theme } = useTheme();

  return (
    <section className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.sender === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              msg.sender === "user"
                ? theme === 'dark' 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-500 text-white"
                : theme === 'dark'
                  ? "bg-slate-800 text-gray-100"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
            theme === 'dark' 
              ? "bg-slate-800 text-gray-100" 
              : "bg-gray-100 text-gray-800"
          }`}>
            <div className="flex items-center gap-2">
              <div className="animate-pulse">Thinking</div>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatMessages;