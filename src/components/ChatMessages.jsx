import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessages = ({ messages, loading, setMessagesRef }) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && setMessagesRef) {
      setMessagesRef(containerRef.current);
    }
  }, [setMessagesRef]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.sender === "user"
                ? theme === 'dark'
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : theme === 'dark'
                  ? "bg-slate-800 text-gray-100"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-1">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 whitespace-pre-wrap">{children}</p>
                  ),
                  li: ({ children }) => (
                    <li className="ml-4 list-disc mb-1">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{msg.text}</p>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              theme === 'dark'
                ? "bg-slate-800 text-gray-100"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="animate-pulse">Thinking</div>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-current animate-bounce" />
                <div className="w-1 h-1 rounded-full bg-current animate-bounce delay-150" />
                <div className="w-1 h-1 rounded-full bg-current animate-bounce delay-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </section>
  );
};

export default ChatMessages;
