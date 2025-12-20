import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  }, [messages, loading]);

  return (
    <section
      ref={containerRef}
      className="
        flex-1 overflow-y-auto
        px-2 sm:px-4 lg:px-6
        py-3 sm:py-4
        space-y-3
      "
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`
              w-fit
              max-w-[92%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%]
              rounded-2xl
              px-3 sm:px-4
              py-2
              text-xs sm:text-sm lg:text-base
              break-words
              ${
                msg.sender === "user"
                  ? "bg-[#5E17EB] text-white" // User messages: #5E17EB with white text for both themes
                  : theme === "dark"
                  ? "bg-slate-800 text-gray-100" // Bot messages in dark theme (unchanged)
                  : "bg-white text-gray-800" // Bot messages in light theme: white background, black text
              }
            `}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-base sm:text-lg font-bold mb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm sm:text-base font-semibold mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-1">
                      {children}
                    </h3>
                  ),

                  // ✅ SINGLE p TAG
                  p: ({ children }) => (
                    <p className="leading-relaxed mb-2 whitespace-pre-wrap">
                      {children}
                    </p>
                  ),

                  ul: ({ children }) => (
                    <ul className="pl-4 list-disc space-y-1">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
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

      {/* Loading state */}
      {loading && (
        <div className="flex justify-start">
          <div
            className={`
              max-w-[90%] sm:max-w-[80%]
              rounded-2xl
              px-3 sm:px-4
              py-2
              text-xs sm:text-sm
              ${
                theme === "dark"
                  ? "bg-slate-800 text-gray-100"
                  : "bg-white text-gray-800" // Loading state in light theme: white background
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span className="animate-pulse">Thinking</span>
              <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-current animate-bounce delay-150" />
                <span className="w-1 h-1 rounded-full bg-current animate-bounce delay-300" />
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