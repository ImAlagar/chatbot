import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import ChatDropdown from './ChatDropdown';

const ChatListItem = ({
  chat,
  activeChatId,
  theme,
  onSelectChat,
  onShare,
  onRename,
  onArchive,
  onDelete,
  collapsed
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isActive = chat.id === activeChatId;

  return (
    <div
      className={`group relative overflow-visible flex items-center rounded-lg
        ${isActive
          ? theme === 'dark' ? 'bg-slate-800' : 'bg-blue-100'
          : theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-gray-100'}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1 px-3 py-2">
        {!collapsed && (
          <button
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left text-sm truncate
              ${isActive
                ? theme === 'dark' ? 'text-white' : 'text-blue-800'
                : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            {chat.title}
          </button>
        )}
      </div>

      {(hovered || showDropdown) && !collapsed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="p-1 mr-1 rounded hover:bg-black/10"
        >
          <MoreHorizontal size={16} />
        </button>
      )}

      {showDropdown && (
        <ChatDropdown
          chatId={chat.id}
          theme={theme}
          onShare={onShare}
          onRename={onRename}
          onArchive={onArchive}
          onDelete={onDelete}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ChatListItem;
