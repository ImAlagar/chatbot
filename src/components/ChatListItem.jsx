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
  collapsed,
  isEditing = false, // Add this prop for inline editing
  onEditComplete = () => {} // Add this prop
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(isEditing);
  const [editValue, setEditValue] = useState(chat.title);
  const inputRef = useRef(null);
  
  const isActive = chat.id === activeChatId;

  // Handle inline editing
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    if (!collapsed) {
      setEditing(true);
    }
  };

  const handleEditComplete = () => {
    if (editValue.trim() && editValue !== chat.title) {
      onRename(chat.id, editValue.trim());
    }
    setEditing(false);
    onEditComplete();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setEditValue(chat.title);
      setEditing(false);
      onEditComplete();
    }
  };

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
        {!collapsed ? (
          editing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditComplete}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none outline-none text-sm
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            />
          ) : (
            <button
              onClick={() => onSelectChat(chat.id)}
              onDoubleClick={handleDoubleClick}
              className={`w-full text-left text-sm truncate
                ${isActive
                  ? theme === 'dark' ? 'text-white' : 'text-blue-800'
                  : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              {chat.title}
            </button>
          )
        ) : (
          <button
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left"
          >
            <div className="text-sm font-medium truncate">
              {chat.title.charAt(0).toUpperCase()}
            </div>
          </button>
        )}
      </div>

      {/* Show time in non-collapsed mode */}
      {!collapsed && !editing && (chat.lastUpdated || chat.createdAt) && (
        <div className={`text-xs px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {new Date(chat.lastUpdated || chat.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}

      {/* More options button - only show when not editing */}
      {(hovered || showDropdown) && !collapsed && !editing && (
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
          onShare={() => onShare(chat.id)}
          onRename={() => {
            setShowDropdown(false);
            setEditing(true);
          }}
          onArchive={() => onArchive(chat.id)}
          onDelete={() => onDelete(chat.id)}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ChatListItem;