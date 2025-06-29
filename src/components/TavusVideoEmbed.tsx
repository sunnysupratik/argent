import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

interface TavusVideoEmbedProps {
  tavusUrl?: string;
  height?: string;
  className?: string;
}

const TavusVideoEmbed: React.FC<TavusVideoEmbedProps> = ({ 
  tavusUrl = "https://effortless-cucurucho-5a3e21.netlify.app/", 
  height = "500px",
  className = ""
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && retryCount === 0) {
        setError("Loading is taking longer than expected. The video chat may be unavailable.");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [loading, retryCount]);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load Tavus video chat. This could be due to CORS restrictions or the service being unavailable.");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Force iframe reload
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 100);
    }
  };

  const openInNewTab = () => {
    window.open(tavusUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm ${className}`}>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-gray-50/90 flex flex-col items-center justify-center z-10">
          <motion.div 
            className="w-16 h-16 mb-4 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={32} className="text-accent-blue" />
          </motion.div>
          <p className="text-gray-700 font-medium">Loading Tavus Video Chat...</p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-sm mt-2">Retry attempt {retryCount}</p>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center z-10 p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Connection Error</h3>
          <p className="text-red-600 text-center mb-6 max-w-md">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <InteractiveHoverButton
              variant="blue"
              text="Try Again"
              icon={<RefreshCw size={16} />}
              onClick={handleRetry}
              className="px-6 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Open in New Tab"
              icon={<ExternalLink size={16} />}
              onClick={openInNewTab}
              className="px-6 py-3"
            />
          </div>
        </div>
      )}

      {/* Fallback Content (shown before iframe loads) */}
      {!error && (
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center z-0 ${loading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Video size={36} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tavus Video Chat</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Connect with our AI-powered video assistant for personalized financial guidance.
            </p>
          </div>
        </div>
      )}

      {/* The iframe */}
      <iframe
        ref={iframeRef}
        src={tavusUrl}
        style={{ width: '100%', height, border: 'none' }}
        allow="camera; microphone; fullscreen; display-capture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Tavus Video Chat"
        className={`relative z-5 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      />

      {/* External Link Button (always visible) */}
      <div className="absolute top-4 right-4 z-20">
        <InteractiveHoverButton
          variant="white"
          text="Open in New Tab"
          icon={<ExternalLink size={14} />}
          onClick={openInNewTab}
          className="px-3 py-2 text-xs shadow-lg"
        />
      </div>
    </div>
  );
};

export default TavusVideoEmbed;