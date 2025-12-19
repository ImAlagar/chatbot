import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";
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

const Home = ({ onClose, onShare, chatId }) => {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chat-conversations');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameModal, setRenameModal] = useState({ open: false, chatId: null, currentTitle: "" });
  const [conversationFlow, setConversationFlow] = useState(null);
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
    
    // Update collected data
    const newCollected = { ...collected };
    const questionKey = `question_${step}`;
    newCollected[questionKey] = userInput;

    if (step < totalSteps) {
      // Ask next question
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
      
      return "continue"; // Continue flow
    } else {
      // All questions answered, generate final prompt
      newCollected[questionKey] = userInput;
      
      // Create final prompt based on flow type
      let finalPrompt = "";
      
      switch (type) {
        case "platform_strategy":
          finalPrompt = `Act as an expert digital marketing strategist with 10+ years of experience in paid media across Google, Meta, LinkedIn, TikTok, and programmatic platforms. Your thinking should be analytical, data-driven, and consultative.

        Core Task: Conduct a preliminary marketing platform prioritization and high-level competitor analysis for a newly onboarded client. The goal is to identify the top 3 most suitable paid advertising platforms for their business and justify the investment priority.

        IMPORTANT: The client is located in ${newCollected.question_4}. Please provide location-specific recommendations considering the market in ${newCollected.question_4}.

        Client Information:
        1. Client Business Name: ${newCollected.question_1}
        2. Core Product/Service: ${newCollected.question_2}
        3. Primary Target Audience: ${newCollected.question_3}
        4. Location: ${newCollected.question_4}
        5. Key Campaign Goal: ${newCollected.question_5}

        Please provide your analysis and recommendations SPECIFICALLY for businesses in ${newCollected.question_4}.`;
          break;

        case "meta_ads_creative":
          finalPrompt = `Act as a Senior Meta Ads Creative Strategist and Video Producer. You specialize in crafting scroll-stopping ad concepts for the Facebook and Instagram ecosystem that drive real business results. Your thinking is rooted in human psychology, platform trends, and direct response principles.

        Core Task: Develop a comprehensive creative strategy and production plan for a Meta Ads campaign.

        IMPORTANT: The client is located in ${newCollected.question_2}. Please provide creative ideas that would resonate with people in ${newCollected.question_2}, considering local culture, trends, and preferences.

        Client Information:
        1. Client Business: ${newCollected.question_1}
        2. Location: ${newCollected.question_2}
        3. Campaign Primary Goal: ${newCollected.question_3}
        4. Target Audience: ${newCollected.question_4}

        Please provide location-specific creative strategy for ${newCollected.question_2}.`;
          break;

        case "google_ads_keywords":
          finalPrompt = `Act as a Senior Google Ads Consultant and Search Strategist with a decade of experience in building profitable, scalable PPC accounts. Your expertise lies in selecting the right campaign mix, structuring accounts for optimal performance, and uncovering high-intent keyword opportunities. Your thinking is analytical, user-intent focused, and rooted in commercial outcomes.

        Core Task: Develop a foundational Google Ads campaign strategy and keyword discovery plan.

        IMPORTANT: The client is located in ${newCollected.question_2}. Please provide location-specific keywords and strategies for ${newCollected.question_2}. Include:
        1. Location-based keywords for ${newCollected.question_2}
        2. Competitor analysis for ${newCollected.question_2}
        3. Local search trends in ${newCollected.question_2}
        4. Geo-targeting recommendations for ${newCollected.question_2}

        Client Information:
        1. Client Business: ${newCollected.question_1}
        2. Location: ${newCollected.question_2}
        3. Campaign Primary Goal: ${newCollected.question_3}
        4. Target Audience & Their Search Mindset: ${newCollected.question_4}

        Please provide Google Ads strategy SPECIFICALLY for ${newCollected.question_2}.`;
          break;

        case "ad_copy":
          finalPrompt = `Act as a world-class direct response copywriter specializing in paid advertising. You master the AIDA (Attention, Interest, Desire, Action) and PAS (Problem, Agitate, Solution) frameworks. Your copy is concise, benefit-driven, and engineered to get clicks from a cold audience.

        Core Task: Generate 5 distinct, high-converting ad copy variants for a paid social or search campaign.

        IMPORTANT: The business is located in ${newCollected.question_4}. Please create ad copies that:
        1. Mention the location ${newCollected.question_4} specifically
        2. Appeal to local customers in ${newCollected.question_4}
        3. Use local language/dialect if appropriate for ${newCollected.question_4}
        4. Reference local landmarks or culture of ${newCollected.question_4} if relevant

        Client Information:
        1. Business/Product: ${newCollected.question_1}
        2. Target Customer's Deepest Pain Point: ${newCollected.question_2}
        3. Core Offer & Key Benefit: ${newCollected.question_3}
        4. Location: ${newCollected.question_4}
        5. Unique Selling Proposition (USP): ${newCollected.question_5}
        6. Desired Action & CTA: ${newCollected.question_6}
        7. Tone of Voice: ${newCollected.question_7}

        Please provide 5 ad copy variants SPECIFICALLY targeting customers in ${newCollected.question_4}.`;
          break;

      }

      // Clear conversation flow
      setConversationFlow(null);
      return finalPrompt;
    }
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
            onButtonClick={handleButtonClick}
          />
        )}
      </main>
    </div>
  );
}

export default Home;