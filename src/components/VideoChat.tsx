import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import TavusVideoEmbed from './TavusVideoEmbed';

const VideoChat: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Always visible maximize/minimize button - positioned consistently */}
      <motion.button
        onClick={toggleMaximize}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </motion.button>

      <AnimatePresence mode="wait">
        {isMaximized ? (
          // Full-screen mode
          <motion.div
            key="maximized"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col"
          >
            {/* Full-Height Video Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 overflow-hidden relative"
            >
              <TavusVideoEmbed height="100%" />
            </motion.div>
          </motion.div>
        ) : (
          // Regular page mode
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 overflow-hidden"
          >
            <TavusVideoEmbed height="100%" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoChat;