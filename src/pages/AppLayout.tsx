import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Video, Phone, X } from 'lucide-react';
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
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
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

      {/* Enhanced Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        {/* Video Button */}
        <motion.button
          onClick={handleVideoClick}
          className="group relative w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Ripple effect on hover */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20"
            initial={{ scale: 0 }}
            whileHover={{ 
              scale: 1,
              transition: { duration: 0.3 }
            }}
          />
          
          {/* Icon */}
          <motion.div
            className="relative z-10"
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <Video size={24} />
          </motion.div>
          
          {/* Tooltip */}
          <motion.div
            className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            initial={{ x: 10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
          >
            Video Advisor
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </motion.div>
        </motion.button>

        {/* Call Button (ElevenLabs) */}
        <motion.button
          onClick={() => setShowNeedHelp(!showNeedHelp)}
          className="group relative w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          {/* Ripple effect on hover */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20"
            initial={{ scale: 0 }}
            whileHover={{ 
              scale: 1,
              transition: { duration: 0.3 }
            }}
          />
          
          {/* Icon with enhanced animation */}
          <motion.div
            className="relative z-10"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 0,
              transition: { duration: 0.2 }
            }}
          >
            <Phone size={24} />
          </motion.div>
          
          {/* Tooltip */}
          <motion.div
            className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            initial={{ x: 10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
          >
            Voice Assistant
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </motion.div>
        </motion.button>
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