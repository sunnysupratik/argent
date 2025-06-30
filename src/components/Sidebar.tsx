import React from 'react';
import { BarChart3, Activity, Wallet, TrendingUp, Settings, User, LogOut, MessageCircle, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import GradientMenu from './ui/gradient-menu';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/app/dashboard',
      gradientFrom: '#a955ff',
      gradientTo: '#ea51ff'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: Activity, 
      path: '/app/transactions',
      gradientFrom: '#56CCF2',
      gradientTo: '#2F80ED'
    },
    { 
      id: 'accounts', 
      label: 'Accounts', 
      icon: Wallet, 
      path: '/app/accounts',
      gradientFrom: '#FF9966',
      gradientTo: '#FF5E62'
    },
    { 
      id: 'investments', 
      label: 'Investments', 
      icon: TrendingUp, 
      path: '/app/investments',
      gradientFrom: '#80FF72',
      gradientTo: '#7EE8FA'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/app/profile',
      gradientFrom: '#a955ff',
      gradientTo: '#ea51ff'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/app/settings',
      gradientFrom: '#56CCF2',
      gradientTo: '#2F80ED'
    },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    onViewChange(item.id);
    navigate(item.path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const getUserName = () => {
    if (user?.full_name) {
      const firstName = user.full_name.split(' ')[0];
      return firstName.replace(/\s*(test|user|demo).*$/i, '');
    }
    const email = user?.email?.split('@')[0] || 'User';
    return email.replace(/\s*(test|user|demo).*$/i, '');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const gradientMenuItems = menuItems.map(item => ({
    ...item,
    onClick: () => handleNavigation(item),
    isActive: isActive(item.path)
  }));

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 relative overflow-hidden">
      {/* Top Section - ARGENT Logo and User Actions */}
      <motion.div 
        className="px-4 lg:px-8 py-4 lg:py-6 border-b border-gray-200/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left Side - ARGENT Logo */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl lg:text-3xl font-black tracking-tight text-text-primary">
                AR
                <span className="relative">
                  G
                  <motion.div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue transform rotate-45"
                    animate={{ rotate: [45, 90, 45] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
                ENT
              </div>
              <motion.div 
                className="absolute -bottom-1 left-0 w-8 lg:w-12 h-0.5 bg-accent-blue"
                initial={{ width: 0 }}
                animate={{ width: window.innerWidth >= 1024 ? 48 : 32 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.div>

            {/* Right Side - User Actions */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Home Button */}
              <motion.button
                onClick={handleGoHome}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors backdrop-blur-sm border border-gray-200/50"
                whileHover={{ 
                  x: 2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-7 h-7 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Home size={14} className="text-white" />
                </motion.div>
                <span className="hidden lg:block text-sm font-medium text-gray-700">Home</span>
              </motion.button>

              {/* Sign Out Button */}
              <motion.button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50/80 transition-colors backdrop-blur-sm border border-red-200/30"
                whileHover={{ 
                  x: 2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <LogOut size={14} className="text-white" />
                </motion.div>
                <span className="hidden lg:block text-sm font-medium">Sign Out</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Greeting Section - Below Logo */}
      <motion.div 
        className="px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-r from-accent-blue/5 via-indigo-50/30 to-violet-50/20 border-b border-gray-200/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="greeting-text-large text-gray-900 mb-1">
              {getGreeting()}
            </div>
            <div className="greeting-text-medium text-gray-900">
              Welcome back, <span className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">{getUserName()}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Menu Section - At Bottom */}
      <div className="relative px-4 lg:px-8">
        <div className="flex justify-center py-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <GradientMenu menuItems={gradientMenuItems} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;