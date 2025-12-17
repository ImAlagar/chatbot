import React from 'react';

const ChatGroupHeader = ({ title, theme, count, collapsed }) => {
  if (collapsed) return null;
  
  return (
    <div className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider
      ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
    >
      <div className="flex items-center justify-between">
        <span>{title}</span>
        {count > 0 && (
          <span className={`px-1.5 py-0.5 rounded text-xs
            ${theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatGroupHeader;