import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Maximize2, Minimize2, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const VideoChat: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const videoAppUrl = 'https://effortless-cucurucho-5a3e21.netlify.app/';

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const refreshIframe = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    window.open(videoAppUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Enhanced Page Header */}
      <AnimatedSection className="mobile-spacing lg:p-8 pb-4 lg:pb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-xl lg:text-2xl mb-2 font-bold uppercase tracking-wide">VIDEO ADVISOR</h1>
            <motion.div 
              className="w-12 lg:w-16 h-px bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-gray-600 mt-3">Connect with AI-powered video financial advisor</p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex gap-3">
              <InteractiveHoverButton
                variant="white"
                text="Refresh"
                icon={<RefreshCw size={16} />}
                onClick={refreshIframe}
                className="px-4 py-3 text-sm"
              />

              <InteractiveHoverButton
                variant="white"
                text="Open External"
                icon={<ExternalLink size={16} />}
                onClick={openInNewTab}
                className="px-4 py-3 text-sm"
              />
            </div>

            <InteractiveHoverButton
              variant="blue"
              text={isMaximized ? "Minimize" : "Maximize"}
              icon={isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              onClick={toggleMaximize}
              className="px-6 py-3 text-sm font-medium"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Video Chat Container */}
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
            {/* Maximized Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200/50 bg-white/95 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                  <Video size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">AI Video Advisor</h2>
                  <p className="text-sm text-gray-600">Full-screen video consultation</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <InteractiveHoverButton
                  variant="white"
                  text="Refresh"
                  icon={<RefreshCw size={14} />}
                  onClick={refreshIframe}
                  className="px-3 py-2 text-sm"
                />
                <InteractiveHoverButton
                  variant="blue"
                  text="Minimize"
                  icon={<Minimize2 size={14} />}
                  onClick={toggleMaximize}
                  className="px-4 py-2 text-sm"
                />
              </div>
            </div>

            {/* Full-Height Iframe Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading video advisor...</p>
                  </div>
                </div>
              )}

              {hasError && (
                <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                  <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-6">Unable to load the video advisor. Please check your connection and try again.</p>
                    <div className="flex space-x-3 justify-center">
                      <InteractiveHoverButton
                        variant="white"
                        text="Try Again"
                        icon={<RefreshCw size={14} />}
                        onClick={refreshIframe}
                        className="px-4 py-2 text-sm"
                      />
                      <InteractiveHoverButton
                        variant="blue"
                        text="Open External"
                        icon={<ExternalLink size={14} />}
                        onClick={openInNewTab}
                        className="px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <iframe
                key={`maximized-${iframeKey}`}
                src={videoAppUrl}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="camera; microphone; fullscreen; display-capture"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                title="AI Video Advisor - Full Screen"
              />
            </motion.div>
          </motion.div>
        ) : (
          // Regular embedded mode
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 mobile-spacing lg:px-8 pb-8"
          >
            {/* Video Chat Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden h-full flex flex-col">
              {/* Card Header */}
              <div className="p-4 lg:p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Video size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">AI Video Advisor</h3>
                      <p className="text-sm text-gray-600">Powered by advanced AI technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700">Live</span>
                    </div>
                    <InteractiveHoverButton
                      variant="white"
                      text="Maximize"
                      icon={<Maximize2 size={14} />}
                      onClick={toggleMaximize}
                      className="px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 relative bg-gray-50">
                {isLoading && (
                  <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Connecting to video advisor...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  </div>
                )}

                {hasError && (
                  <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                    <div className="text-center max-w-md mx-auto p-6">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={24} className="text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Connect</h3>
                      <p className="text-gray-600 mb-6">The video advisor service is temporarily unavailable. Please try refreshing or open in a new tab.</p>
                      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3 justify-center">
                        <InteractiveHoverButton
                          variant="white"
                          text="Refresh"
                          icon={<RefreshCw size={14} />}
                          onClick={refreshIframe}
                          className="px-4 py-2 text-sm"
                        />
                        <InteractiveHoverButton
                          variant="blue"
                          text="Open in New Tab"
                          icon={<ExternalLink size={14} />}
                          onClick={openInNewTab}
                          className="px-4 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <iframe
                  key={`embedded-${iframeKey}`}
                  src={videoAppUrl}
                  className="w-full h-full border-0 rounded-b-2xl lg:rounded-b-3xl"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="camera; microphone; fullscreen; display-capture"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                  title="AI Video Advisor"
                />
              </div>

              {/* Card Footer */}
              <div className="p-4 lg:p-6 border-t border-gray-200/50 bg-gray-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Connected to AI Advisor</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <InteractiveHoverButton
                      variant="white"
                      text="Refresh"
                      icon={<RefreshCw size={14} />}
                      onClick={refreshIframe}
                      className="px-3 py-2 text-sm"
                    />
                    <InteractiveHoverButton
                      variant="white"
                      text="External"
                      icon={<ExternalLink size={14} />}
                      onClick={openInNewTab}
                      className="px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoChat;