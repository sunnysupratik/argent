import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface TavusVideoChatProps {
  isActive: boolean;
  onToggle: () => void;
  onMessage?: (message: string) => void;
  apiKey: string;
  conversationId: string;
  replicaId: string;
}

const TavusVideoChat: React.FC<TavusVideoChatProps> = ({
  isActive,
  onToggle,
  onMessage,
  apiKey,
  conversationId,
  replicaId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      initializeTavus();
    } else if (!isActive) {
      cleanup();
    }

    return cleanup;
  }, [isActive]);

  const initializeTavus = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.Tavus) {
        throw new Error('Tavus SDK not loaded');
      }

      // Initialize Tavus
      await window.Tavus.init({
        apiKey,
        onReady: () => {
          console.log('Tavus initialized successfully');
          startConversation();
        },
        onError: (err) => {
          console.error('Tavus error:', err);
          setError('Failed to connect to video chat');
          setIsConnecting(false);
        },
        onMessage: (message) => {
          if (onMessage) {
            onMessage(message.text || message.content || '');
          }
        },
        onConnectionStatusChange: (status) => {
          console.log('Connection status:', status);
          if (status === 'connected') {
            setIsConnecting(false);
          }
        }
      });
    } catch (err) {
      console.error('Failed to initialize Tavus:', err);
      setError('Failed to initialize video chat');
      setIsConnecting(false);
    }
  };

  const startConversation = async () => {
    try {
      if (!window.Tavus || !containerRef.current) {
        throw new Error('Tavus not ready or container not available');
      }

      await window.Tavus.startConversation({
        conversationId,
        replicaId,
        container: containerRef.current,
        enableAudio: isAudioEnabled,
        enableVideo: isVideoEnabled
      });

      setIsConnecting(false);
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError('Failed to start video conversation');
      setIsConnecting(false);
    }
  };

  const cleanup = async () => {
    try {
      if (window.Tavus) {
        await window.Tavus.endConversation();
      }
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  };

  const toggleVideo = () => {
    if (window.Tavus) {
      window.Tavus.toggleVideo();
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    if (window.Tavus) {
      window.Tavus.toggleAudio();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  if (!isActive) {
    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Video size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">AI Financial Advisor</h3>
          <p className="text-sm opacity-80 mb-4">Connect for video consultation</p>
          <button
            onClick={onToggle}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-blue-hover rounded-lg transition-colors"
          >
            Start Video Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {/* Tavus Video Container */}
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Connecting to video chat...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                initializeTavus();
              }}
              className="px-4 py-2 bg-white text-red-900 rounded hover:bg-gray-100 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
            isVideoEnabled 
              ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isVideoEnabled ? (
            <Video size={20} className="text-white" />
          ) : (
            <VideoOff size={20} className="text-white" />
          )}
        </button>
        
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
            isAudioEnabled 
              ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isAudioEnabled ? (
            <Mic size={20} className="text-white" />
          ) : (
            <MicOff size={20} className="text-white" />
          )}
        </button>
        
        <button
          onClick={onToggle}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 backdrop-blur-sm transition-colors"
        >
          <PhoneOff size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default TavusVideoChat;