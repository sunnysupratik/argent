import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Video, Phone, X, ChevronUp, ChevronDown, Headphones, PlusCircle, Sparkles } from 'lucide-react';
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

const AppLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
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
    else if (path.includes('chat')) setActiveView('chat');
    else if (path.includes('profile')) setActiveView('profile');
    else if (path.includes('settings')) setActiveView('settings');
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || showVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, showVideoModal]);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (fabExpanded && !target.closest('.fab-container')) {
        setFabExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fabExpanded]);

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
    setFabExpanded(false);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const toggleFab = () => {
    setFabExpanded(!fabExpanded);
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

      {/* Redesigned Floating Action Button System */}
      <div className="fixed bottom-8 right-8 z-50 fab-container">
        {/* Main FAB Button with Floating Label */}
        <div className="relative">
          {/* Floating Label */}
          <AnimatePresence>
            {!fabExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-black/80"></div>
                AI Assistants
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Button */}
          <motion.button
            onClick={toggleFab}
            className="relative z-50 w-16 h-16 bg-gradient-to-r from-accent-blue to-blue-600 hover:from-accent-blue-hover hover:to-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 122, 255, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: fabExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {fabExpanded ? <X size={24} /> : <Sparkles size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* FAB Menu Items - Radial Layout */}
        <AnimatePresence>
          {fabExpanded && (
            <>
              {/* Semi-transparent overlay */}
              <motion.div
                className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFabExpanded(false)}
              />
              
              {/* Video Button - Top Position */}
              <motion.div
                className="absolute z-40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, x: -70, y: -70 }}
                exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.button
                  onClick={handleVideoClick}
                  className="group relative w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 15px 30px rgba(239, 68, 68, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video size={22} />
                  
                  {/* Tooltip */}
                  <motion.div
                    className="absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Video Advisor
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-black/80"></div>
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Voice Assistant Button - Left Position */}
              <motion.div
                className="absolute z-40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, x: -100, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.button
                  onClick={() => setShowNeedHelp(!showNeedHelp)}
                  className="group relative w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 15px 30px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Headphones size={22} />
                  
                  {/* Tooltip */}
                  <motion.div
                    className="absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Voice Assistant
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-black/80"></div>
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Chat Button - Top Left Position */}
              <motion.div
                className="absolute z-40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, x: -70, y: 70 }}
                exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.button
                  onClick={() => navigate('/app/chat')}
                  className="group relative w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 15px 30px rgba(16, 185, 129, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle size={22} />
                  
                  {/* Tooltip */}
                  <motion.div
                    className="absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    AI Chat
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-l-black/80"></div>
                  </motion.div>
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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
                    <p className="text-sm text-gray-600">Embedded video consultation</p>
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