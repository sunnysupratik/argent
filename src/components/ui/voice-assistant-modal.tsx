import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(30).fill(5));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isOpen) return;

    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isOpen && isListening) {
        // If modal is still open and we were listening, restart recognition
        recognition.start();
      } else {
        setIsListening(false);
        if (transcript) {
          setIsProcessing(true);
          // Simulate AI processing time
          setTimeout(() => {
            setIsProcessing(false);
            // After processing, close the modal
            setTimeout(() => {
              onClose();
            }, 1000);
          }, 2000);
        }
      }
    };

    // Start recognition when modal opens
    if (isOpen) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }

    return () => {
      recognition.stop();
      setIsListening(false);
    };
  }, [isOpen, onClose]);

  // Audio visualizer setup
  useEffect(() => {
    if (!isOpen) return;

    const setupAudioContext = async () => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Create analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        // Connect microphone to analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // Start visualizer animation
        animateVisualizer();
      } catch (error) {
        console.error('Error setting up audio context:', error);
      }
    };

    const animateVisualizer = () => {
      if (!analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Process the data for visualization
        const normalizedData = Array.from(dataArray).map(value => {
          // Map the 0-255 value to a reasonable height (5-50)
          return isListening ? 5 + (value / 255) * 45 : 5 + Math.random() * 10;
        });
        
        setVisualizerData(normalizedData.slice(0, 30));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    setupAudioContext();

    return () => {
      // Clean up
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isOpen]);

  // Generate idle animation data when not listening
  useEffect(() => {
    if (!isOpen || isListening) return;

    const idleInterval = setInterval(() => {
      setVisualizerData(prev => 
        prev.map(() => 5 + Math.random() * 10)
      );
    }, 1000);

    return () => clearInterval(idleInterval);
  }, [isOpen, isListening]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
        >
          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          {/* Main content */}
          <motion.div
            className="w-full max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Status indicator */}
            <motion.div
              className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isListening ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Listening...
                </>
              ) : isProcessing ? (
                <>
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Ready
                </>
              )}
            </motion.div>

            {/* Audio visualizer */}
            <motion.div
              className="relative w-40 h-40 mx-auto mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 0.5, delay: 0.2 }
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-accent-blue/20 blur-xl transform scale-125"></div>
              
              {/* Main orb */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-accent-blue to-blue-600 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: isListening ? [1, 1.05, 1] : [1, 1.02, 1],
                }}
                transition={{ 
                  duration: isListening ? 1.5 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {isListening ? (
                  <Mic size={32} className="text-white" />
                ) : (
                  <MicOff size={32} className="text-white" />
                )}
              </motion.div>

              {/* Visualizer bars */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  {visualizerData.map((height, index) => (
                    <motion.div
                      key={index}
                      className="w-1 mx-0.5 bg-white/80 rounded-full"
                      style={{ 
                        height: `${height}px`,
                        transformOrigin: 'center center',
                        rotate: `${(index * 12) - 180}deg`,
                        position: 'absolute'
                      }}
                      initial={{ height: 5 }}
                      animate={{ height }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Transcript */}
            <motion.div
              className="min-h-20 mb-8 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {transcript ? (
                <p className="text-white text-2xl font-medium">{transcript}</p>
              ) : (
                <p className="text-white/60 text-xl">
                  {isListening ? "Speak now..." : "Click the microphone to start speaking"}
                </p>
              )}
            </motion.div>

            {/* Action button */}
            <motion.button
              className={`px-8 py-3 rounded-full text-white font-medium ${
                isListening 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-accent-blue hover:bg-accent-blue-hover"
              }`}
              onClick={() => {
                if (isListening) {
                  // Stop listening
                  setIsListening(false);
                  if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                  }
                } else {
                  // Start listening again
                  if (isOpen) {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.continuous = true;
                      recognition.interimResults = true;
                      recognition.lang = 'en-US';
                      recognition.start();
                    }
                  }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </motion.button>

            {/* Suggestions */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                "Show me my spending this month",
                "What's my savings rate?",
                "How much did I spend on groceries?",
                "Transfer $500 to savings"
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm text-left transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTranscript(suggestion)}
                >
                  "{suggestion}"
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAssistantModal;