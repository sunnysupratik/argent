import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import LoadingDots from './LoadingDots';
import { Bot, Send, Sparkles, TrendingUp, DollarSign, Target, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  // Auto-scroll to bottom when new messages arrive (only if user isn't manually scrolling)
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Handle scroll events to detect user scrolling and show/hide buttons
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      const isNearTop = scrollTop < 100; // 100px threshold
      
      setIsUserScrolling(!isNearBottom);
      setShowScrollToBottom(!isNearBottom && messages.length > 0);
      setShowScrollToTop(!isNearTop && messages.length > 0);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsUserScrolling(false);
      setShowScrollToBottom(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScrollToTop(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
    // Reset scroll state when user sends a message
    setIsUserScrolling(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
  };

  const quickPrompts = [
    {
      icon: TrendingUp,
      text: "Analyze spending patterns",
      prompt: "Can you analyze my spending patterns and suggest areas where I can optimize my budget?",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: DollarSign,
      text: "Investment strategies",
      prompt: "I'm looking for investment advice based on my current financial situation. What would you recommend?",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Target,
      text: "Budget optimization",
      prompt: "Help me create a budget plan that maximizes my savings while maintaining my lifestyle.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      text: "Financial health check",
      prompt: "Can you give me an overall assessment of my financial health and suggest improvements?",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    const syntheticEvent = {
      preventDefault: () => {},
      target: { value: prompt }
    } as any;
    
    handleInputChange({ target: { value: prompt } } as any);
    setTimeout(() => {
      handleSubmit(syntheticEvent);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl relative overflow-hidden">
      {/* Fixed position background that doesn't scroll with content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-indigo-50/10 to-violet-50/20 animate-aurora opacity-50" />
      </div>

      {/* Messages Area with Custom Scrollbar */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto chat-scrollbar relative"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(160, 160, 160, 0.7) rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="p-4 lg:p-6 space-y-6 relative min-h-full">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center justify-center h-full px-4 lg:px-8 py-8 lg:py-16"
              >
                {/* Hero Section */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center mb-8 lg:mb-12"
                >
                  <div className="relative mb-6 lg:mb-8">
                    <motion.div 
                      className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-accent-blue to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
                      animate={{ 
                        boxShadow: [
                          "0 25px 50px -12px rgba(0, 122, 255, 0.25)",
                          "0 25px 50px -12px rgba(0, 122, 255, 0.4)",
                          "0 25px 50px -12px rgba(0, 122, 255, 0.25)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles size={32} className="text-white lg:hidden" />
                      <Sparkles size={40} className="text-white hidden lg:block" />
                    </motion.div>
                  </div>
                  
                  <motion.h2 
                    className="text-2xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="block">Your AI Financial</span>
                    <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
                      Advisor
                    </span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Get personalized financial insights powered by AI and enhanced with financial intelligence. 
                    Ask me anything about budgeting, investments, or financial planning.
                  </motion.p>
                </motion.div>
                
                {/* Quick Action Cards */}
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {quickPrompts.map((prompt, index) => {
                    const Icon = prompt.icon;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                        className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 rounded-2xl p-4 lg:p-6 text-left transition-all duration-300 hover:shadow-xl"
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        {/* Gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${prompt.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        
                        <div className="relative flex items-center space-x-4">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${prompt.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon size={20} className="text-white lg:hidden" />
                            <Icon size={24} className="text-white hidden lg:block" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors text-sm lg:text-base">
                              {prompt.text}
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                              Get AI-powered insights and recommendations
                            </p>
                          </div>
                          <motion.div
                            className="w-6 h-6 text-gray-400 group-hover:text-gray-600"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id || `${message.role}-${index}`} 
                    message={{
                      ...message,
                      createdAt: new Date()
                    }} 
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Bot size={20} className="text-gray-600" />
                </div>
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl rounded-tl-lg px-6 py-4 border border-gray-100/50">
                  <LoadingDots />
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Connection Error</p>
                    <p className="text-red-600 text-sm">{error.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Scroll Navigation Buttons - Positioned within the scrollable area */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              onClick={scrollToTop}
              className="fixed top-20 right-4 lg:right-8 w-10 h-10 lg:w-12 lg:h-12 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 border border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ChevronUp size={18} className="lg:hidden" />
              <ChevronUp size={20} className="hidden lg:block" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollToBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={scrollToBottom}
              className="fixed bottom-32 right-4 lg:right-8 w-10 h-10 lg:w-12 lg:h-12 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 border border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to latest messages"
              title="Scroll to latest messages"
            >
              <ChevronDown size={18} className="lg:hidden" />
              <ChevronDown size={20} className="hidden lg:block" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Input Area */}
      <motion.div 
        className="p-4 lg:p-6 border-t border-gray-100/50 bg-white/80 backdrop-blur-xl relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={onInputChange}
              placeholder="Ask me about your finances..."
              disabled={isLoading}
              className="w-full py-3 lg:py-4 px-4 lg:px-6 pr-14 lg:pr-16 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-900 placeholder-gray-500 text-sm lg:text-base"
              autoComplete="off"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 lg:p-3 bg-accent-blue text-white rounded-xl hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send message"
            >
              <Send size={16} className="lg:hidden" />
              <Send size={18} className="hidden lg:block" />
            </motion.button>
          </div>
        </form>
        
        <motion.p 
          className="text-xs text-gray-400 mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          AI can make mistakes. Please verify important financial decisions.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChatContainer;