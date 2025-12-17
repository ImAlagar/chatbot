import React, { useState, useEffect } from "react";
import { Menu, Share } from "lucide-react";
import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { useTheme } from "../context/ThemeContext";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL_ID = import.meta.env.VITE_MODEL_ID;

if (!OPENROUTER_API_KEY) {
  console.warn("VITE_OPENROUTER_API_KEY environment variable is not set");
}

const Home = ({onClose,onShare,chatId}) => {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chat-conversations');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, chatId: null, currentTitle: "" });
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem('chat-conversations', JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = () => {
    const id = Date.now().toString();
    const newChat = { 
      id, 
      title: "New chat", 
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setSidebarOpen(false);
    return id;
  };

  const renameActiveChatIfNeeded = (firstMsg, chatId) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId && chat.title === "New chat"
          ? { ...chat, title: firstMsg.slice(0, 30) + "..." }
          : chat
      )
    );
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    let chatId = activeChatId;
    if (!chatId) chatId = createNewChat();

    setInput("");

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "user", text, timestamp: new Date().toISOString() }],
            }
          : chat
      )
    );

    renameActiveChatIfNeeded(text, chatId);
    setLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Chat App',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: `${MODEL_ID}:free`,
          messages: [{ role: 'user', content: text }],
        }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "No response received.";

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: "bot", text: reply, timestamp: new Date().toISOString() },
                ],
              }
            : chat
        )
      );
    } catch (err) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: "bot", text: `Error: ${err.message}`, timestamp: new Date().toISOString() },
                ],
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      return newChats;
    });
  };

  const handleArchiveChat = (chatId) => {
    setChats(prev => {
      const chatIndex = prev.findIndex(chat => chat.id === chatId);
      if (chatIndex === -1) return prev;
      
      const updatedChats = [...prev];
      const [archivedChat] = updatedChats.splice(chatIndex, 1);
      archivedChat.archived = true;
      archivedChat.archivedAt = new Date().toISOString();
      
      return [...updatedChats, archivedChat];
    });
    
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
    
    alert('Chat archived successfully!');
  };

  // NEW: Share chat function
  const handleShareChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Create a shareable link (you can implement actual sharing logic here)
    const shareData = {
      title: chat.title,
      text: `Check out my chat: ${chat.title}`,
      url: `${window.location.origin}/share/${chatId}`,
    };

    // Try using Web Share API if available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy to clipboard
      const shareText = `Chat Title: ${chat.title}\n\nMessages:\n${chat.messages.map(m => `${m.sender}: ${m.text}`).join('\n')}`;
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert('Chat copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Failed to copy chat to clipboard');
        });
    }
  };

  // NEW: Open rename modal
const handleRenameChat = (chatId, newTitle) => {
  if (typeof newTitle === 'string') {
    // From inline edit
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  } else {
    // From dropdown (event object) - handled by ChatListItem itself
    console.log(`Triggering rename for chat ${chatId}`);
  }
};

  // NEW: Save renamed chat
  const handleSaveRename = () => {
    const { chatId, currentTitle } = renameModal;
    if (currentTitle.trim() === '') {
      alert('Chat title cannot be empty');
      return;
    }

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: currentTitle.trim() }
          : chat
      )
    );

    setRenameModal({ open: false, chatId: null, currentTitle: "" });
  };


  const handleAction = (action, e) => {
    e.stopPropagation();
    action(chatId, e);
    onClose();
  };


  return (
    <div className={`h-screen flex overflow-hidden transition-colors ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Sidebar */}
      <ChatSidebar
         chats={chats}
        activeChatId={activeChatId}
        onCreateChat={createNewChat}
        onSelectChat={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onArchiveChat={handleArchiveChat}
        onShareChat={handleShareChat}
        onRenameChat={handleRenameChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`flex items-center justify-between p-3 border-b ${
            theme === "dark" ? "border-slate-800" : "border-gray-200"
          }`}
        >
          {/* Left: Menu button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 mr-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <HiMenuAlt2 size={20} />
          </button>

          {/* Center: Title */}
          <h1 className="text-lg font-semibold truncate">
            Alien Chatbot
          </h1>

          {/* Right: Share button */}
          <button
            onClick={(e) => handleAction(onShare, e)}
            className={`hidden sm:flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
              theme === "dark"
                ? "text-gray-300 hover:bg-slate-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Share size={16} />
            <span className="hidden md:inline">Share</span>
          </button>
        </header>


        {/* Messages */}
        {activeChat ? (
          <ChatMessages 
            messages={activeChat.messages} 
            loading={loading} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No chat selected</h2>
              <p className="opacity-75 mb-4">Select a chat or create a new one</p>
              <button
                onClick={createNewChat}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}

        {/* Input - Only show if chat is active */}
        {activeChat && (
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        )}

      </main>
    </div>
  );
}

export default Home;