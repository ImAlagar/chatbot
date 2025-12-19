import React, { useState } from 'react';
import {
  X,
  Search,
  SquarePen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const SidebarHeader = ({
  theme,
  onCreateChat,
  setSidebarOpen,
  collapsed,
  setCollapsed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="p-5 space-y-3">

      {/* First Row */}
      <div className="flex items-center justify-between">
        {!collapsed && (
          <span className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            ChatBot
          </span>
        )}

        <div className="flex items-center gap-1">
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-black/10"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-black/10"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* New Chat */}
      <div
        onClick={onCreateChat}
        className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-all
          ${theme === 'dark'
            ? 'hover:bg-slate-800/50 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'}
        `}
      >
        <SquarePen size={16} />
        {!collapsed && (
          <p className={`text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            New Chat
          </p>
        )}
      </div>



      <div className={`h-px ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'
      }`} />
    </div>
  );
};

export default SidebarHeader;
