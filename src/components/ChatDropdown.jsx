import React, { useRef, useEffect } from 'react';
import { Share, Edit, Archive, Trash2 } from 'lucide-react';

const ChatDropdown = ({ 
  chatId, 
  theme, 
  onShare, 
  onRename, 
  onArchive, 
  onDelete, 
  position = 'top-10 -right-36',
  onClose
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  // Close dropdown on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleAction = (action, e) => {
    e.stopPropagation();
    action(chatId, e);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className={`absolute ${position} z-[9999] opacity-1 w-44 rounded-xl shadow-2xl py-3 px-2 ${
        theme === 'dark' 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-gray-200'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => handleAction(onShare, e)}
        className={`flex items-center rounded-lg gap-2 w-full px-2 py-2 text-sm text-left hover:bg-opacity-50 ${
          theme === 'dark' 
            ? 'text-gray-300 hover:bg-slate-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Share size={16} />
        Share
      </button>
      <button
        onClick={(e) => handleAction(onRename, e)}
        className={`flex items-center  rounded-lg gap-2 w-full px-2 py-2 text-sm text-left hover:bg-opacity-50 ${
          theme === 'dark' 
            ? 'text-gray-300 hover:bg-slate-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Edit size={16} />
        Rename
      </button>
      
      <button
        onClick={(e) => handleAction(onArchive, e)}
        className={`flex items-center  rounded-lg gap-2 w-full px-2 py-2 text-sm text-left hover:bg-opacity-50 ${
          theme === 'dark' 
            ? 'text-gray-300 hover:bg-slate-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Archive size={16} />
        Archive Chat
      </button>
      <button
        onClick={(e) => handleAction(onDelete, e)}
        className={`flex items-center  rounded-lg gap-2 w-full px-2 py-2 text-sm text-left hover:bg-opacity-50 ${
          theme === 'dark' 
            ? 'text-red-400 hover:bg-slate-700' 
            : 'text-red-600 hover:bg-gray-100'
        }`}
      >
        <Trash2 size={16} />
        Delete Chat
      </button>
    </div>
  );
};

export default ChatDropdown;