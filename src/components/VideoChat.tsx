import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const VideoChat: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoAppUrl = 'https://effortless-cucurucho-5a3e21.netlify.app/';

  const openInNewTab = () => {
    window.open(videoAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">Loading video advisor...</p>
          </div>
        </div>
      )}

      {/* External link button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          onClick={openInNewTab}
          className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExternalLink size={14} />
          <span>Open External</span>
        </motion.button>
      </div>

      {/* Direct iframe container */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={videoAppUrl}
          className="w-full h-full border-0"
          allow="camera; microphone; fullscreen; display-capture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"
          title="AI Video Advisor"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default VideoChat;