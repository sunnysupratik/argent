import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { useAuth } from '../hooks/useAuth';

const MainNavBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const mobileMenuVariants = {
    closed: {
      x: '100%',
      transition: { type: 'tween', duration: 0.3 },
    },
    open: {
      x: 0,
      transition: { type: 'tween', duration: 0.3 },
    },
  };

  return (
    <motion.header 
      className="px-4 lg:px-8 py-6 lg:py-8 border-b border-white/10 bg-[#030303]/95 backdrop-blur-xl transition-colors duration-500 relative z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto min-h-[60px]">
        <motion.div 
          className="relative flex-shrink-0 mr-8"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl lg:text-3xl font-black tracking-tight text-white transition-colors duration-500 pb-2">
            AR
            <span className="relative">
              G
              <motion.div 
                className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue transform rotate-45 z-10"
                animate={{ rotate: [45, 90, 45] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            ENT
          </div>
          <motion.div 
            className="absolute bottom-0 left-0 w-8 lg:w-12 h-0.5 bg-accent-blue"
            initial={{ width: 0 }}
            animate={{ width: window.innerWidth >= 1024 ? 48 : 32 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2 flex-wrap">
          <motion.div 
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InteractiveHoverButton variant="white" text="Features" onClick={() => navigate('/features')} className="text-sm px-4 py-2 min-w-[100px]" />
            <InteractiveHoverButton variant="white" text="Pricing" onClick={() => navigate('/pricing')} className="text-sm px-4 py-2 min-w-[100px]" />
            <InteractiveHoverButton variant="white" text="Testimonials" onClick={() => navigate('/testimonials')} className="text-sm px-4 py-2 min-w-[100px]" />
            <InteractiveHoverButton variant="white" text="Blog" onClick={() => navigate('/blog')} className="text-sm px-4 py-2 min-w-[100px]" />
            <InteractiveHoverButton variant="white" text="About" onClick={() => navigate('/about')} className="text-sm px-4 py-2 min-w-[100px]" />
            <InteractiveHoverButton variant="white" text="Contact" onClick={() => navigate('/contact')} className="text-sm px-4 py-2 min-w-[100px]" />
            {user && (
              <InteractiveHoverButton variant="blue" text="My Dashboard" icon={<BarChart3 size={16} />} onClick={() => navigate('/app/dashboard')} className="text-sm px-4 py-2 min-w-[120px]" />
            )}
          </motion.div>
          {user ? (
            <div className="flex items-center space-x-2 ml-4">
              <InteractiveHoverButton variant="white" text="Sign Out" onClick={handleSignOut} className="text-sm px-4 py-2 min-w-[100px]" />
            </div>
          ) : (
            <InteractiveHoverButton variant="blue" text="Sign In" onClick={() => navigate('/login')} className="text-sm px-6 py-2 min-w-[100px] ml-4" />
          )}
        </div>
        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
        </motion.button>
      </nav>
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 z-50 lg:hidden bg-[#030303]/95 backdrop-blur-xl border-l border-white/10"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-black text-white">Menu</div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
                <nav className="space-y-4">
                  <InteractiveHoverButton variant="white" text="Features" onClick={() => { navigate('/features'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  <InteractiveHoverButton variant="white" text="Pricing" onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  <InteractiveHoverButton variant="white" text="Testimonials" onClick={() => { navigate('/testimonials'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  <InteractiveHoverButton variant="white" text="Blog" onClick={() => { navigate('/blog'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  <InteractiveHoverButton variant="white" text="About" onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  <InteractiveHoverButton variant="white" text="Contact" onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  {user && (
                    <InteractiveHoverButton variant="blue" text="My Dashboard" icon={<BarChart3 size={16} />} onClick={() => { navigate('/app/dashboard'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  )}
                  {user ? (
                    <div className="space-y-4">
                      <InteractiveHoverButton variant="white" text="Sign Out" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                    </div>
                  ) : (
                    <InteractiveHoverButton variant="blue" text="Sign In" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full text-center" />
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default MainNavBar;
