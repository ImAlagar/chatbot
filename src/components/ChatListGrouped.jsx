import React, { useEffect, useState } from 'react';
import ChatListItem from './ChatListItem';
import ChatGroupHeader from './ChatGroupHeader';
import { groupChatsByTime, flattenGroupedChats } from '../helpers/chatGrouper';

const ChatListGrouped = ({
  chats,
  activeChatId,
  theme,
  onSelectChat,
  onShare,
  onRename,
  onArchive,
  onDelete,
  collapsed
}) => {
  const [groupedChats, setGroupedChats] = useState([]);

  useEffect(() => {
    if (!chats || chats.length === 0) {
      setGroupedChats([]);
      return;
    }

    const groups = groupChatsByTime(chats);
    const flattened = flattenGroupedChats(groups);
    setGroupedChats(flattened);
  }, [chats]);

  if (groupedChats.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No chats yet
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-x-visible">
      {groupedChats.map((item, index) => {
        if (item.type === 'header') {
          return (
            <ChatGroupHeader
              key={`header-${item.title}-${index}`}
              title={item.title}
              theme={theme}
              count={item.count}
              collapsed={collapsed}
            />
          );
        }

        return (
          <ChatListItem
            key={item.id}
            chat={item}
            activeChatId={activeChatId}
            theme={theme}
            onSelectChat={onSelectChat}
            onShare={onShare}
            onRename={onRename}
            onArchive={onArchive}
            onDelete={onDelete}
            collapsed={collapsed}
          />
        );
      })}
    </div>
  );
};

export default ChatListGrouped;