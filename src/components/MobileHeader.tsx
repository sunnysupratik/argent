import React from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  currentPage: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMenuOpen, onMenuToggle, currentPage }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getUserName = () => {
    if (user?.full_name) {
      return user.full_name.split(' ')[0]; // First name only
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-xl border-b border-gray-200/30 shadow-sm relative"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/20 to-violet-50/30 animate-aurora opacity-60" />
      </div>
      
      <div className="relative px-4 py-3">
        {/* Top Row - Menu Button and User Info */}
        <div className="flex items-center justify-between mb-3">
          {/* Left Side - Menu Button */}
          <motion.button
            onClick={onMenuToggle}
            className="sleek-icon p-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ 
              backgroundColor: '#666666',
              scale: 1.05,
              rotateY: 180,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </motion.div>
          </motion.button>
          
          {/* Right Side - User Info */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <motion.button
              className="relative p-2 sleek-icon"
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                backgroundColor: '#666666',
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <Bell size={18} className="text-white" />
              {/* Notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
            </motion.button>

            {/* Enhanced User Avatar */}
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-sm">
                {getUserName().charAt(0).toUpperCase()}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Welcome Section */}
        <motion.div 
          className="text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="text-lg font-black text-gray-900 mb-1">
            {getGreeting()}
          </div>
          <div className="text-xl font-black text-gray-900">
            Welcome back, <span className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">{getUserName()}</span>
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div 
          className="mt-4 pt-3 border-t border-gray-200/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{currentPage}</h1>
              <div className="text-xs text-gray-600 mt-0.5">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            {/* Quick Action Button */}
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-accent-blue to-blue-600 text-white rounded-xl font-medium text-sm shadow-lg"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              Quick Add
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MobileHeader;