import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, AlertTriangle } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInitialized = useRef(false);
  
  // Check if ElevenLabs widget is loaded
  useEffect(() => {
    if (!isOpen) return;
    
    const checkWidgetLoaded = () => {
      if (window.customElements && window.customElements.get('elevenlabs-convai')) {
        console.log('ElevenLabs widget is defined');
        setIsLoading(false);
        return true;
      }
      return false;
    };
    
    // Check immediately
    if (checkWidgetLoaded()) return;
    
    // Set up a polling mechanism to check for the widget
    const checkInterval = setInterval(() => {
      if (checkWidgetLoaded()) {
        clearInterval(checkInterval);
      }
    }, 500);
    
    // Set a timeout to show an error if the widget doesn't load
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError('Voice assistant failed to load. Please try again later.');
        setIsLoading(false);
        clearInterval(checkInterval);
      }
    }, 10000);
    
    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
    };
  }, [isOpen, isLoading]);
  
  // Handle widget initialization
  useEffect(() => {
    if (isOpen && !isLoading && !error && containerRef.current && !widgetInitialized.current) {
      try {
        console.log('Initializing ElevenLabs widget');
        // The widget should automatically initialize when the custom element is added to the DOM
        widgetInitialized.current = true;
      } catch (err) {
        console.error('Error initializing ElevenLabs widget:', err);
        setError('Failed to initialize voice assistant. Please try again.');
      }
    }
    
    return () => {
      if (!isOpen && widgetInitialized.current) {
        console.log('Cleaning up ElevenLabs widget');
        widgetInitialized.current = false;
      }
    };
  }, [isOpen, isLoading, error]);

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
        ) : error ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
                setIsLoading(true);
                widgetInitialized.current = false;
              }}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative" ref={containerRef}>
            <elevenlabs-convai 
              agent-id="agent_01jyj0t1jderb9e505xd2vcjp9"
              className="elevenlabs-widget"
            ></elevenlabs-convai>
            
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