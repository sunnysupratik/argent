import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Video, Headphones, MessageCircle, X } from 'lucide-react';
import { AnimatedDock } from './animated-dock';

interface AIAssistantHubProps {
  onVideoClick: () => void;
  onVoiceToggle: () => void;
  onChatClick: () => void;
  showVoiceAssistant: boolean;
  activeAssistant: string | null;
}

const AIAssistantHub: React.FC<AIAssistantHubProps> = ({
  onVideoClick,
  onVoiceToggle,
  onChatClick,
  showVoiceAssistant,
  activeAssistant
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // For mobile: FAB with expanding options
  if (isMobile) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 items-center mb-4"
            >
              {[
                { 
                  icon: <Video size={20} />, 
                  label: "Video Advisor",
                  onClick: () => { onVideoClick(); setIsExpanded(false); },
                  active: activeAssistant === 'video'
                },
                { 
                  icon: <Headphones size={20} />, 
                  label: "Voice Assistant",
                  onClick: () => { onVoiceToggle(); setIsExpanded(false); },
                  active: activeAssistant === 'voice'
                },
                { 
                  icon: <MessageCircle size={20} />, 
                  label: "AI Chat",
                  onClick: () => { onChatClick(); setIsExpanded(false); },
                  active: activeAssistant === 'chat'
                }
              ].map((item, index) => (
                <motion.button
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    item.active 
                      ? 'bg-accent-blue text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 80, opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
            isExpanded ? 'bg-gray-700 rotate-45' : 'bg-accent-blue'
          } text-white`}
          onClick={toggleExpanded}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? <X size={24} /> : <Sparkles size={24} />}
        </motion.button>
      </div>
    );
  }

  // For desktop: Vertical dock that expands on click
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-3 flex flex-col gap-4">
              {/* Close Button */}
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700/90 hover:bg-gray-600/90 text-white"
                onClick={toggleExpanded}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={22} />
                <span className="absolute left-0 transform -translate-x-full -ml-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                  Close Menu
                </span>
              </motion.button>
              
              {/* Assistant Buttons with Left-Aligned Labels */}
              {[
                {
                  icon: <Video size={22} />,
                  label: "Video Advisor",
                  onClick: onVideoClick,
                  active: activeAssistant === 'video'
                },
                {
                  icon: <Headphones size={22} />,
                  label: "Voice Assistant",
                  onClick: onVoiceToggle,
                  active: activeAssistant === 'voice'
                },
                {
                  icon: <MessageCircle size={22} />,
                  label: "AI Chat",
                  onClick: onChatClick,
                  active: activeAssistant === 'chat'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-white text-sm whitespace-nowrap">{item.label}</div>
                  <motion.button
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.active 
                        ? 'bg-accent-blue ring-2 ring-white/30' 
                        : 'bg-gray-700/90 hover:bg-gray-600/90'
                    } text-white`}
                    onClick={item.onClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-accent-blue text-white"
              onClick={toggleExpanded}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={24} />
              <span className="sr-only">Open AI Assistants</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantHub;