import React from 'react';
import { BarChart3, Activity, Wallet, TrendingUp, Settings, User, X, LogOut, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, activeView, onViewChange }) => {
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
      gradientTo: '#ea51ff',
      description: 'Overview & Analytics'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: Activity, 
      path: '/app/transactions',
      gradientFrom: '#56CCF2',
      gradientTo: '#2F80ED',
      description: 'Payment History'
    },
    { 
      id: 'accounts', 
      label: 'Accounts', 
      icon: Wallet, 
      path: '/app/accounts',
      gradientFrom: '#FF9966',
      gradientTo: '#FF5E62',
      description: 'Bank Accounts'
    },
    { 
      id: 'investments', 
      label: 'Investments', 
      icon: TrendingUp, 
      path: '/app/investments',
      gradientFrom: '#80FF72',
      gradientTo: '#7EE8FA',
      description: 'Portfolio & Stocks'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/app/profile',
      gradientFrom: '#a955ff',
      gradientTo: '#ea51ff',
      description: 'Personal Settings'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/app/settings',
      gradientFrom: '#56CCF2',
      gradientTo: '#2F80ED',
      description: 'App Preferences'
    },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    onViewChange(item.id);
    navigate(item.path);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const handleGoHome = () => {
    navigate('/');
    onClose();
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

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Overlay with Blur */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Enhanced Sidebar */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-50 shadow-2xl relative overflow-hidden"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="relative flex flex-col h-full">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="relative">
                  <motion.div 
                    className="text-2xl font-black text-text-primary tracking-tight"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
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
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-10 h-0.5 bg-accent-blue"
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <X size={20} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Enhanced Welcome Message */}
              <motion.div 
                className="mx-6 mt-6 mb-4 p-5 bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 rounded-2xl border border-accent-blue/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 tracking-wide font-medium mb-1">{getGreeting()}</div>
                    <div className="text-xl font-black text-accent-blue tracking-tight">Welcome back, {getUserName()}</div>
                    <motion.div 
                      className="w-8 h-0.5 bg-gradient-to-r from-accent-blue to-blue-600 mt-1"
                      initial={{ width: 0 }}
                      animate={{ width: 32 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Home Button */}
              <motion.div 
                className="mx-6 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  onClick={handleGoHome}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors backdrop-blur-sm border border-gray-200/50"
                  whileHover={{ 
                    x: 4,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Home size={16} className="text-white" />
                  </motion.div>
                  <span className="font-medium text-gray-700">Back to Home</span>
                </motion.button>
              </motion.div>

              {/* Enhanced Navigation with Horizontal Gradient Menu Style */}
              <nav className="flex-1 px-6 pb-6">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Navigation</div>
                  <div className="text-sm font-medium text-gray-600 tracking-wide">Navigation</div>
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <motion.div 
                          key={item.id}
                          custom={index}
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                        >
                          <motion.button
                            onClick={() => handleNavigation(item)}
                            style={{ 
                              '--gradient-from': item.gradientFrom, 
                              '--gradient-to': item.gradientTo 
                            } as React.CSSProperties}
                            className={`relative w-full h-[80px] bg-white shadow-lg rounded-2xl flex flex-col items-center justify-center transition-all duration-500 hover:shadow-none group cursor-pointer ${
                              active ? 'shadow-none' : ''
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Gradient background on hover/active */}
                            <span className={`absolute inset-0 rounded-2xl bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-500 ${
                              active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}></span>
                            
                            {/* Blur glow */}
                            <span className={`absolute top-[10px] inset-x-0 h-full rounded-2xl bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] -z-10 transition-all duration-500 ${
                              active ? 'opacity-50' : 'opacity-0 group-hover:opacity-50'
                            }`}></span>

                            {/* Icon */}
                            <span className={`relative z-10 transition-all duration-300 ${
                              active ? 'text-white' : 'text-gray-500 group-hover:text-white'
                            }`}>
                              <Icon size={20} />
                            </span>

                            {/* Title */}
                            <span className={`relative z-10 text-xs font-medium mt-1 transition-all duration-300 ${
                              active ? 'text-white' : 'text-gray-600 group-hover:text-white'
                            }`}>
                              {item.label}
                            </span>
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </nav>

              {/* Enhanced Footer */}
              <div className="p-6 border-t border-gray-200/50 space-y-4">
                {/* Enhanced User Info - Name only */}
                <motion.div 
                  className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {getUserName()}
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Sign Out Button */}
                <motion.button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-red-50/80 hover:bg-red-100/80 active:bg-red-200/80 transition-colors group backdrop-blur-sm border border-red-200/50"
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <LogOut size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-red-700 group-hover:text-red-800">Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;