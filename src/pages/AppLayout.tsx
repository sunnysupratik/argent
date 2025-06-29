import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, MessageCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import MobileSidebar from '../components/MobileSidebar';
import Dashboard from '../components/Dashboard';
import Transactions from '../components/Transactions';
import Accounts from '../components/Accounts';
import Investments from '../components/Investments';
import Chat from '../components/Chat';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import VideoChat from '../components/VideoChat';
import PageTransition from '../components/PageTransition';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useAuth } from '../hooks/useAuth';
import AIAssistantHub from '../components/ui/ai-assistant-hub';

const AppLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Initialize smooth scrolling
  useSmoothScroll();

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('AppLayout - Auth state:', { user: user?.username, loading });
    if (!loading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Update active view based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) setActiveView('dashboard');
    else if (path.includes('transactions')) setActiveView('transactions');
    else if (path.includes('accounts')) setActiveView('accounts');
    else if (path.includes('investments')) setActiveView('investments');
    else if (path.includes('chat')) {
      setActiveView('chat');
      setActiveAssistant('chat');
    }
    else if (path.includes('profile')) setActiveView('profile');
    else if (path.includes('settings')) setActiveView('settings');
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || showVideoModal || showChatModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, showVideoModal, showChatModal]);

  const getPageTitle = (view: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      accounts: 'Accounts',
      investments: 'Investments',
      chat: 'AI Advisor',
      profile: 'Profile',
      settings: 'Settings'
    };
    return titles[view] || 'Dashboard';
  };

  const handleVideoClick = () => {
    setShowVideoModal(true);
    setActiveAssistant('video');
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    if (activeAssistant === 'video') {
      setActiveAssistant(null);
    }
  };

  const handleChatClick = () => {
    setShowChatModal(true);
    setActiveAssistant('chat');
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    if (activeAssistant === 'chat') {
      setActiveAssistant(null);
    }
  };

  const toggleVoiceAssistant = () => {
    setShowNeedHelp(!showNeedHelp);
    setActiveAssistant(showNeedHelp ? null : 'voice');
  };

  const handleSendMessage = () => {
    // This would open a direct message or feedback form
    console.log('Send message clicked');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-medium text-text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Common modal styles for both assistants
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Desktop Horizontal Navigation */}
      <div className="desktop-only">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile Header */}
      <div className="mobile-only fixed top-0 left-0 right-0 z-30">
        <MobileHeader 
          isMenuOpen={isMobileMenuOpen}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          currentPage={getPageTitle(activeView)}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0 relative">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </PageTransition>
      </main>

      {/* AI Assistant Hub */}
      <AIAssistantHub 
        onVideoClick={handleVideoClick}
        onVoiceToggle={toggleVoiceAssistant}
        onChatClick={handleChatClick}
        onSendMessage={handleSendMessage}
        showVoiceAssistant={showNeedHelp}
        activeAssistant={activeAssistant}
      />

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              variants={contentVariants}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                    <Video size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">AI Video Advisor</h2>
                    <p className="text-sm text-gray-600">Video consultation</p>
                  </div>
                </div>
                
                <button
                  onClick={closeVideoModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 relative">
                <VideoChat />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeChatModal}
          >
            <motion.div
              variants={contentVariants}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Same style as Video Modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">AI Chat Advisor</h2>
                    <p className="text-sm text-gray-600">Text consultation</p>
                  </div>
                </div>
                
                <button
                  onClick={closeChatModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 relative">
                <Chat />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ElevenLabs Widget - Positioned above the buttons when active */}
      <AnimatePresence>
        {showNeedHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-32 right-6 z-40"
          >
            <elevenlabs-convai agent-id="agent_01jyj0t1jderb9e505xd2vcjp9"></elevenlabs-convai>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;