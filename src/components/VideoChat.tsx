import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Maximize2, Minimize2, RefreshCw, ExternalLink, AlertCircle, Play, Shield } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const VideoChat: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const videoAppUrl = 'https://effortless-cucurucho-5a3e21.netlify.app/';

  useEffect(() => {
    // Set a timeout to show fallback if iframe doesn't load
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setShowFallback(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [isLoading, iframeKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setShowFallback(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setShowFallback(true);
  };

  const refreshIframe = () => {
    setIsLoading(true);
    setHasError(false);
    setShowFallback(false);
    setIframeKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    window.open(videoAppUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const FallbackContent = () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500 rounded-full blur-2xl"></div>
      </div>

      <div className="text-center max-w-lg mx-auto p-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Video size={40} className="text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Video Advisor</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Due to security restrictions, the video advisor needs to open in a new window for the best experience. 
            Click below to start your AI-powered financial consultation.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <InteractiveHoverButton
            variant="blue"
            text="Launch Video Advisor"
            icon={<Play size={18} />}
            onClick={openInNewTab}
            className="w-full lg:w-auto px-8 py-4 text-lg font-medium"
          />
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield size={14} />
            <span>Secure • Private • AI-Powered</span>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: Video, title: "HD Video", desc: "Crystal clear video quality" },
            { icon: Shield, title: "Secure", desc: "End-to-end encryption" },
            { icon: Play, title: "Instant", desc: "No downloads required" }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                <Icon size={20} className="text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                <div className="text-xs text-gray-600">{feature.desc}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );

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
                variant="blue"
                text="Launch External"
                icon={<ExternalLink size={16} />}
                onClick={openInNewTab}
                className="px-4 py-3 text-sm font-medium"
              />
            </div>

            {!showFallback && (
              <InteractiveHoverButton
                variant="white"
                text={isMaximized ? "Minimize" : "Maximize"}
                icon={isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                onClick={toggleMaximize}
                className="px-6 py-3 text-sm"
              />
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Video Chat Container */}
      <AnimatePresence mode="wait">
        {isMaximized && !showFallback ? (
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

              {showFallback ? (
                <FallbackContent />
              ) : (
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
              )}
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
                    {!showFallback && (
                      <>
                        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-green-700">Ready</span>
                        </div>
                        <InteractiveHoverButton
                          variant="white"
                          text="Maximize"
                          icon={<Maximize2 size={14} />}
                          onClick={toggleMaximize}
                          className="px-3 py-2 text-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 relative bg-gray-50">
                {isLoading && !showFallback && (
                  <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Connecting to video advisor...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  </div>
                )}

                {showFallback ? (
                  <FallbackContent />
                ) : (
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
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 lg:p-6 border-t border-gray-200/50 bg-gray-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>{showFallback ? 'Ready to Connect' : 'AI Advisor Available'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!showFallback && (
                      <InteractiveHoverButton
                        variant="white"
                        text="Refresh"
                        icon={<RefreshCw size={14} />}
                        onClick={refreshIframe}
                        className="px-3 py-2 text-sm"
                      />
                    )}
                    <InteractiveHoverButton
                      variant="blue"
                      text="Launch"
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