import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Headphones } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // FIX: Add proper loading and error handling for ElevenLabs widget
  useEffect(() => {
    if (isOpen) {
      // Check if ElevenLabs widget is loaded
      if (window.customElements && window.customElements.get('elevenlabs-convai')) {
        console.log('ElevenLabs widget is already defined');
        setIsLoading(false);
      } else {
        console.log('ElevenLabs widget is not defined, waiting for script to load');
        
        // Set up a listener for when the custom element is defined
        const checkInterval = setInterval(() => {
          if (window.customElements && window.customElements.get('elevenlabs-convai')) {
            console.log('ElevenLabs widget is now defined');
            setIsLoading(false);
            clearInterval(checkInterval);
          }
        }, 500);
        
        // Clean up interval
        return () => clearInterval(checkInterval);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Blurred Background */}
      <motion.div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Content */}
      <motion.div 
        ref={containerRef}
        className="relative z-10 w-full max-w-2xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700">Loading voice assistant...</p>
          </div>
        ) : (
          <div className="relative">
            <elevenlabs-convai agent-id="agent_01jyj0t1jderb9e505xd2vcjp9"></elevenlabs-convai>
            
            {/* Close button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VoiceAssistantModal;