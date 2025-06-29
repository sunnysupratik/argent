import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const VideoChat: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoAppUrl = 'https://effortless-cucurucho-5a3e21.netlify.app/';

  const openInNewTab = () => {
    window.open(videoAppUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Action buttons - Positioned absolutely */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <InteractiveHoverButton
          variant="white"
          text={isMaximized ? "Minimize" : "Maximize"}
          icon={isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          onClick={toggleMaximize}
          className="px-3 py-2 text-sm shadow-lg bg-white/90 backdrop-blur-sm"
        />
        <InteractiveHoverButton
          variant="blue"
          text="External"
          icon={<ExternalLink size={14} />}
          onClick={openInNewTab}
          className="px-3 py-2 text-sm shadow-lg"
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-5">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading video advisor...</p>
          </div>
        </div>
      )}

      {/* Direct iframe container */}
      <div className={`flex-1 ${isMaximized ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
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