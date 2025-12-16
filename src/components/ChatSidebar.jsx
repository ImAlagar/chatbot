import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import SidebarHeader from './SidebarHeader';
import ChatListItem from './ChatListItem';
import ProfileSection from './ProfileSection';

const ChatSidebar = ({
  chats,
  activeChatId,
  onCreateChat,
  onSelectChat,
  sidebarOpen,
  setSidebarOpen,
  onDeleteChat,
  onArchiveChat,
  onShareChat,
  onRenameChat
}) => {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false); // 👈 ONLY NEW STATE

  return (
    <>
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:relative z-50 h-full border-r transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${theme === 'dark'
            ? 'border-slate-800 bg-slate-950'
            : 'border-gray-200 bg-gray-50'}
        `}
      >
        <div className="flex flex-col h-full">

          <SidebarHeader
            theme={theme}
            onCreateChat={onCreateChat}
            setSidebarOpen={setSidebarOpen}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <div className="flex-1 overflow-x-visible p-2 space-y-1">
            {chats.map(chat => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                activeChatId={activeChatId}
                theme={theme}
                onSelectChat={onSelectChat}
                onShare={onShareChat}
                onRename={onRenameChat}
                onArchive={onArchiveChat}
                onDelete={onDeleteChat}
                collapsed={collapsed}
              />
            ))}
          </div>

          <ProfileSection
            theme={theme}
            toggleTheme={toggleTheme}
            collapsed={collapsed}
          />
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
