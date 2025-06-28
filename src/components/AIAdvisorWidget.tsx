import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, X, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import ChatMessage from './ChatMessage';
import LoadingDots from './LoadingDots';

const AIAdvisorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
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

  const quickInsights = [
    {
      icon: TrendingUp,
      title: "Spending Analysis",
      description: "Your dining expenses increased 15% this month",
      action: "Get advice on optimizing your food budget"
    },
    {
      icon: DollarSign,
      title: "Investment Opportunity",
      description: "You have $2,500 available for investing",
      action: "Ask about investment strategies"
    }
  ];

  const handleQuickAction = (action: string) => {
    setIsOpen(true);
    setTimeout(() => {
      handleSubmit(new Event('submit') as any, { data: { message: action } });
    }, 500);
  };

  return (
    <>
      {/* AI Advisor Widget in Dashboard */}
      <motion.div
        className="swiss-card hover-lift-premium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">AI Financial Advisor</h3>
              <p className="text-sm text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setIsOpen(true)}
            className="swiss-button-primary flex items-center space-x-2 px-4 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={16} className="text-white" />
            <span>Chat Now</span>
          </motion.button>
        </div>

        {/* Quick Insights */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">AI Insights</h4>
          {quickInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleQuickAction(insight.action)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Icon size={16} className="text-accent-blue" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-text-primary text-sm">{insight.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-xs text-accent-blue mt-2 font-medium">{insight.action} →</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Full-Screen Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-accent-blue to-blue-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Financial Advisor</h2>
                    <p className="text-blue-100 text-sm">Powered by Gemini AI • Get personalized financial advice</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-accent-blue to-blue-600 rounded-2xl flex items-center justify-center">
                      <Bot size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">How can I help you today?</h3>
                      <p className="text-gray-600 max-w-md">
                        Ask me about budgeting, investments, savings strategies, or any financial questions you have.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <ChatMessage 
                        key={message.id || `${message.role}-${index}`} 
                        message={{
                          ...message,
                          createdAt: new Date()
                        }} 
                      />
                    ))}
                  </div>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <LoadingDots />
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="p-4 my-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-800 text-sm">{error.message}</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me about your finances..."
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent disabled:opacity-50"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-accent-blue text-white rounded-xl hover:bg-accent-blue-hover disabled:opacity-50 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdvisorWidget;