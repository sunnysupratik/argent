import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
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
import PageTransition from '../components/PageTransition';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useAuth } from '../hooks/useAuth';

const AppLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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

      {/* Persistent ElevenLabs Widget - Available throughout entire dashboard */}
      <AnimatePresence>
        {showNeedHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 z-50"
          >
            <elevenlabs-convai agent-id="agent_01jyj0t1jderb9e505xd2vcjp9"></elevenlabs-convai>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Toggle Button - Always visible in dashboard */}
      <motion.button
        onClick={() => setShowNeedHelp(!showNeedHelp)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
};

export default AppLayout;