export const groupChatsByTime = (chats) => {
  if (!chats || chats.length === 0) return {};
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);
  
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const groups = {
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    older: []
  };

  chats.forEach(chat => {
    const chatDate = new Date(chat.lastUpdated || chat.createdAt || chat.date || Date.now());
    const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

    if (chatDay.getTime() === today.getTime()) {
      groups.today.push(chat);
    } else if (chatDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(chat);
    } else if (chatDate >= last7Days) {
      groups.last7Days.push(chat);
    } else if (chatDate >= last30Days) {
      groups.last30Days.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  return groups;
};

export const flattenGroupedChats = (groups) => {
  const flattened = [];
  
  // Add Today group
  if (groups.today && groups.today.length > 0) {
    flattened.push({ type: 'header', title: 'Today', count: groups.today.length });
    groups.today.forEach(chat => {
      // Don't modify the original chat object, just add a marker
      const chatWithGroup = { ...chat };
      chatWithGroup._group = 'Today'; // Add group marker
      flattened.push(chatWithGroup);
    });
  }

  // Add Yesterday group
  if (groups.yesterday && groups.yesterday.length > 0) {
    flattened.push({ type: 'header', title: 'Yesterday', count: groups.yesterday.length });
    groups.yesterday.forEach(chat => {
      const chatWithGroup = { ...chat };
      chatWithGroup._group = 'Yesterday';
      flattened.push(chatWithGroup);
    });
  }

  // Add Last 7 Days group
  if (groups.last7Days && groups.last7Days.length > 0) {
    flattened.push({ type: 'header', title: 'Last 7 days', count: groups.last7Days.length });
    groups.last7Days.forEach(chat => {
      const chatWithGroup = { ...chat };
      chatWithGroup._group = 'Last 7 days';
      flattened.push(chatWithGroup);
    });
  }

  // Add Last Month group
  if (groups.last30Days && groups.last30Days.length > 0) {
    flattened.push({ type: 'header', title: 'Last month', count: groups.last30Days.length });
    groups.last30Days.forEach(chat => {
      const chatWithGroup = { ...chat };
      chatWithGroup._group = 'Last month';
      flattened.push(chatWithGroup);
    });
  }

  // Add Older group
  if (groups.older && groups.older.length > 0) {
    flattened.push({ type: 'header', title: 'Older', count: groups.older.length });
    groups.older.forEach(chat => {
      const chatWithGroup = { ...chat };
      chatWithGroup._group = 'Older';
      flattened.push(chatWithGroup);
    });
  }

  return flattened;
};