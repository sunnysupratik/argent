import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Horizontal Navigation - Always visible when logged in */}
      <div className="desktop-only">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile Header - Always visible when logged in */}
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

      {/* Main Content - Dashboard by default */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0 relative">
        <PageTransition>
          <Routes>
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all route also redirects to dashboard */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </PageTransition>
      </main>
    </div>
  );
};

export default AppLayout;