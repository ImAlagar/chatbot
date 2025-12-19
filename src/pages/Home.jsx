// Home.jsx - Complete Fixed Version
import React, { useState, useEffect, useMemo } from "react";
import { Share } from "lucide-react";
import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { useTheme } from "../context/ThemeContext";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL_ID = import.meta.env.VITE_MODEL_ID;

if (!OPENROUTER_API_KEY) {
  console.warn("VITE_OPENROUTER_API_KEY environment variable is not set");
}

const Home = ({ onClose, onShare, chatId }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, chatId: null, currentTitle: "" });
  const [conversationFlow, setConversationFlow] = useState(null);
  const [messagesContainerRef, setMessagesContainerRef] = useState(null);

  const navigate = useNavigate();
  const { theme } = useTheme();

  // Calculate storage key based on user
  const chatStorageKey = useMemo(() => {
    if (!user) return 'guest_chat-conversations';
    return `user_${user.uid}_chat-conversations`;
  }, [user]);

  // Load chats when user changes
  useEffect(() => {
    const loadChats = () => {
      if (user) {
        try {
          const savedChats = localStorage.getItem(chatStorageKey);
          
          if (savedChats) {
            const parsedChats = JSON.parse(savedChats);
            setChats(parsedChats);
            
            // If there are chats, select the most recent one
            if (parsedChats.length > 0) {
              const mostRecentChat = parsedChats[0];
              setActiveChatId(mostRecentChat.id);
            }
          } else {
            setChats([]);
          }
        } catch (error) {
          console.error("Error loading chats:", error);
          setChats([]);
        }
      } else {
        setChats([]);
        setActiveChatId(null);
      }
    };

    loadChats();
  }, [user, chatStorageKey]);

  // Save chats when they change
  useEffect(() => {
    if (user && chats.length > 0) {
      try {
        localStorage.setItem(chatStorageKey, JSON.stringify(chats));
      } catch (error) {
        console.error("Error saving chats:", error);
      }
    }
  }, [chats, user, chatStorageKey]);

  // Clear guest chats when user logs in
  useEffect(() => {
    if (user) {
      const guestKey = 'guest_chat-conversations';
      const guestChats = localStorage.getItem(guestKey);
      if (guestChats) {
        localStorage.removeItem(guestKey);
      }
    }
  }, [user]);

  const setMessagesRef = (ref) => {
    if (ref) {
      setMessagesContainerRef(ref);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = () => {
    if (!user) {
      alert("Please log in to create a chat");
      return null;
    }

    const id = Date.now().toString();
    const newChat = { 
      id, 
      title: "New chat", 
      messages: [],
      createdAt: new Date().toISOString(),
      userId: user.uid,
      userEmail: user.email
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

  // Start a conversation flow
  const startConversationFlow = (flowType, chatId) => {
    console.log("Starting conversation flow:", flowType);
    
    let initialMessage = "";
    let questions = [];
    let flowData = {};

    switch (flowType) {
      case "platform_strategy":
        initialMessage = "I'll help you with Platform Strategy. Let me ask you a few questions to provide the best recommendation.";
        questions = [
          "What is your Client Business Name?",
          "Please describe your Core Product/Service (be specific):",
          "Who is your Primary Target Audience?",
          "What is your Location? (e.g., Chennai, Bangalore, Mumbai)",
          "What is your Key Campaign Goal? (Brand Awareness, Lead Generation, Direct Sales/Conversions, App Installs, Store Visits)"
        ];
        flowData = {
          type: "platform_strategy",
          step: 0,
          totalSteps: 5,
          questions: questions,
          collected: {}
        };
        break;

      case "meta_ads_creative":
        initialMessage = "I'll help you with Meta Ads Creative Strategy. Let me ask you a few questions.";
        questions = [
          "What is your Client Business?",
          "What is your Campaign Primary Goal?",
          "Describe your Target Audience in detail:"
        ];
        flowData = {
          type: "meta_ads_creative",
          step: 0,
          totalSteps: 3,
          questions: questions,
          collected: {}
        };
        break;

      case "google_ads_keywords":
        initialMessage = "I'll help you with Google Ads Keywords. Let me ask you a few questions, including your location.";
        questions = [
          "What is your Client Business?",
          "What is your Location? (e.g., Chennai, Bangalore, Mumbai)",
          "What is your Campaign Primary Goal?",
          "Describe your Target Audience & Their Search Mindset:"
        ];
        flowData = {
          type: "google_ads_keywords",
          step: 0,
          totalSteps: 4,
          questions: questions,
          collected: {}
        };
        break;

      case "ad_copy":
        initialMessage = "I'll help you create Ad Copy. Let me ask you a few questions.";
        questions = [
          "What is your Business/Product?",
          "What is your Target Customer's Deepest Pain Point?",
          "What is your Core Offer & Key Benefit (Not Feature)?",
          "What is your Location? (e.g., Chennai, Bangalore, Mumbai)",
          "What is your Unique Selling Proposition (USP)?",
          "What is your Desired Action & CTA?",
          "What Tone of Voice would you prefer?"
        ];
        flowData = {
          type: "ad_copy",
          step: 0,
          totalSteps: 7,
          questions: questions,
          collected: {}
        };
        break;

      default:
        return;
    }

    // Add initial message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { 
                  sender: "bot", 
                  text: initialMessage, 
                  timestamp: new Date().toISOString() 
                },
              ],
            }
          : chat
      )
    );

    // Ask first question
    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { 
                    sender: "bot", 
                    text: questions[0], 
                    timestamp: new Date().toISOString() 
                  },
                ],
              }
            : chat
        )
      );
      
      setConversationFlow({
        ...flowData,
        step: 1
      });
    }, 500);
  };

  // Handle conversation flow responses
  const handleConversationResponse = async (userInput, chatId) => {
    if (!conversationFlow) return null;

    const { type, step, totalSteps, questions, collected } = conversationFlow;

    const newCollected = { ...collected };
    const questionKey = `question_${step}`;
    newCollected[questionKey] = userInput;

    // 🔁 CONTINUE ASKING QUESTIONS
    if (step < totalSteps) {
      const botMessage = {
        sender: "bot",
        text: questions[step],
        timestamp: new Date().toISOString()
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );

      setConversationFlow({
        ...conversationFlow,
        step: step + 1,
        collected: newCollected
      });

      return "continue";
    }

    // ✅ FLOW COMPLETE – FINAL PROMPT
    let finalPrompt = "";

    const RESPONSE_RULES = `
Response format rules:
- Use markdown
- Use clear headings and sub-headings
- Use bullet points where helpful
- Keep spacing clean
- Make content easy to copy-paste
- Write like a professional ChatGPT consultant
`;

    switch (type) {
      case "platform_strategy":
        finalPrompt = `
You are a senior digital marketing strategist with 10+ years experience.

Task:
Recommend the TOP 3 paid advertising platforms for this business.

Client Details:
- Business Name: ${newCollected.question_1}
- Product / Service: ${newCollected.question_2}
- Target Audience: ${newCollected.question_3}
- Location: ${newCollected.question_4}
- Campaign Goal: ${newCollected.question_5}

Guidelines:
- Focus ONLY on ${newCollected.question_4} market
- Explain why each platform works
- Suggest budget split in percentage
- Be practical and realistic

${RESPONSE_RULES}
`;
        break;

      case "meta_ads_creative":
        finalPrompt = `
You are a senior Meta Ads creative strategist.

Task:
Create a Meta Ads creative strategy.

Client Details:
- Business: ${newCollected.question_1}
- Location: ${newCollected.question_2}
- Campaign Goal: ${newCollected.question_3}
- Target Audience: ${newCollected.question_4}

Include:
- Ad angles
- Reel / video ideas
- Hook ideas
- CTA suggestions

Focus ONLY on ${newCollected.question_2} audience.

${RESPONSE_RULES}
`;
        break;

      case "google_ads_keywords":
        finalPrompt = `
You are a senior Google Ads search strategist.

Task:
Create Google Ads keyword and campaign structure.

Client Details:
- Business: ${newCollected.question_1}
- Location: ${newCollected.question_2}
- Campaign Goal: ${newCollected.question_3}
- Audience Search Mindset: ${newCollected.question_4}

Include:
- High intent keywords
- Local keywords
- Campaign structure
- Match type suggestions

Focus ONLY on ${newCollected.question_2}.

${RESPONSE_RULES}
`;
        break;

      case "ad_copy":
        finalPrompt = `
You are a direct response ad copy expert.

Task:
Write 5 high-converting ad copy variations.

Client Details:
- Business: ${newCollected.question_1}
- Customer Pain Point: ${newCollected.question_2}
- Core Offer & Benefit: ${newCollected.question_3}
- Location: ${newCollected.question_4}
- USP: ${newCollected.question_5}
- CTA: ${newCollected.question_6}
- Tone: ${newCollected.question_7}

Rules:
- Mention ${newCollected.question_4} naturally
- Keep copy short and scroll-stopping
- Simple words only
- Avoid fluff

${RESPONSE_RULES}
`;
        break;

      default:
        break;
    }

    // 🧹 RESET FLOW
    setConversationFlow(null);

    return finalPrompt;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    let chatId = activeChatId;
    if (!chatId) chatId = createNewChat();

    setInput("");

    // Add user message to chat
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { 
                  sender: "user", 
                  text, 
                  timestamp: new Date().toISOString() 
                },
              ],
            }
          : chat
      )
    );

    renameActiveChatIfNeeded(text, chatId);
    
    // Check if we're in a conversation flow
    if (conversationFlow) {
      setLoading(true);
      const flowResult = await handleConversationResponse(text, chatId);
      
      if (flowResult === "continue") {
        // Flow continues, wait for next user input
        setLoading(false);
        return;
      } else if (flowResult) {
        // Flow complete, send final prompt to AI
        await sendToAI(flowResult, chatId);
        return;
      }
    }

    // Normal message flow
    setLoading(true);
    await sendToAI(text, chatId);
  };

  const sendToAI = async (promptText, chatId) => {
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
          messages: [{ role: 'user', content: promptText }],
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
                  { 
                    sender: "bot", 
                    text: reply, 
                    timestamp: new Date().toISOString() 
                  },
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
                  { 
                    sender: "bot", 
                    text: `Error: ${err.message}`, 
                    timestamp: new Date().toISOString() 
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (flowType) => {
    console.log("Button clicked with flowType:", flowType);
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createNewChat();
      console.log("Created new chat with ID:", chatId);
    }
    
    // Start the conversation flow
    startConversationFlow(flowType, chatId);
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
    // Reset conversation flow when switching chats
    setConversationFlow(null);
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

  const handleShareChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const shareData = {
      title: chat.title,
      text: `Check out my chat: ${chat.title}`,
      url: `${window.location.origin}/share/${chatId}`,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch(err => console.log('Error sharing:', err));
    } else {
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

  const handleRenameChat = (chatId, newTitle) => {
    if (typeof newTitle === 'string') {
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
    }
  };

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

  const handleScrollUp = () => {
    if (messagesContainerRef) {
      messagesContainerRef.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (messagesContainerRef) {
      messagesContainerRef.scrollTo({ 
        top: messagesContainerRef.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
        {/* Header with user info */}
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

          {/* Center: Title and User Info */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold truncate">
                Alien Chatbot
              </h1>
              {user && (
                <p className="text-xs opacity-75">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-slate-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
            
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
          </div>
        </header>

        {/* Messages - Show different states based on user */}
        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please log in</h2>
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                Go to Login
              </button>
            </div>
          </div>
        ) : activeChat ? (
          <ChatMessages 
            messages={activeChat.messages} 
            loading={loading} 
            setMessagesRef={setMessagesRef}
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

        {/* Input - Only show if user is logged in and chat is active */}
        {user && activeChat && (
          <ChatInput 
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
            onButtonClick={handleButtonClick}
            onScrollUp={handleScrollUp}
            onScrollDown={handleScrollDown}
          />
        )}
      </main>
    </div>
  );
}

export default Home;