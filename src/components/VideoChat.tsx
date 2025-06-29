import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Maximize2, Minimize2, RefreshCw, ExternalLink, Play, Shield, Zap, Lock, Monitor } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

const VideoChat: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showAttemptIframe, setShowAttemptIframe] = useState(false);
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'success' | 'failed' | 'idle'>('idle');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoAppUrl = 'https://effortless-cucurucho-5a3e21.netlify.app/';

  const openInNewTab = () => {
    window.open(videoAppUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const attemptIframeLoad = () => {
    setShowAttemptIframe(true);
    setIframeStatus('loading');
    
    // Set a timeout to check if iframe loaded successfully
    const timeout = setTimeout(() => {
      if (iframeStatus === 'loading') {
        setIframeStatus('failed');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  };

  const handleIframeLoad = () => {
    setIframeStatus('success');
  };

  const handleIframeError = () => {
    setIframeStatus('failed');
  };

  const resetIframe = () => {
    setShowAttemptIframe(false);
    setIframeStatus('idle');
  };

  // Try different iframe approaches
  const tryProxyApproach = () => {
    // This would require a backend proxy service
    alert('Proxy approach would require backend implementation. This is a demonstration of the concept.');
  };

  const tryPostMessageApproach = () => {
    // Open in popup and try to communicate
    const popup = window.open(
      videoAppUrl, 
      'video-advisor', 
      'width=1000,height=700,scrollbars=yes,resizable=yes'
    );
    
    if (popup) {
      // Try to communicate with the popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
        }
      }, 1000);
    }
  };

  const MainContent = () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 h-28 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="text-center max-w-2xl mx-auto p-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12"
        >
          <div className="relative mb-8">
            <motion.div 
              className="w-32 h-32 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
              animate={{ 
                boxShadow: [
                  "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                  "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
                  "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Video size={48} className="text-white" />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                style={{
                  top: `${20 + (i % 3) * 30}%`,
                  left: `${15 + (i % 4) * 25}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
          
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">AI Video</span>
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Financial Advisor
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience personalized financial guidance through secure, AI-powered video consultations. 
            Get expert advice tailored to your unique financial situation.
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="space-y-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            <InteractiveHoverButton
              variant="blue"
              text="Launch Video Advisor"
              icon={<Play size={20} />}
              onClick={openInNewTab}
              className="px-10 py-4 text-lg font-semibold shadow-xl"
            />
            
            <InteractiveHoverButton
              variant="white"
              text="Try Embedded Mode"
              icon={<Monitor size={18} />}
              onClick={attemptIframeLoad}
              className="px-8 py-4 text-lg border-2 border-gray-200 hover:border-gray-300"
            />
          </div>
          
          {/* Advanced Options Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex flex-col lg:flex-row gap-3 justify-center">
                  <InteractiveHoverButton
                    variant="white"
                    text="Popup Window"
                    icon={<ExternalLink size={16} />}
                    onClick={tryPostMessageApproach}
                    className="px-6 py-3 text-sm border border-gray-300"
                  />
                  
                  <InteractiveHoverButton
                    variant="white"
                    text="Proxy Method"
                    icon={<Shield size={16} />}
                    onClick={tryProxyApproach}
                    className="px-6 py-3 text-sm border border-gray-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
            <Shield size={16} />
            <span>Secure</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <Lock size={16} />
            <span>Private</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <Zap size={16} />
            <span>AI-Powered</span>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {[
            { 
              icon: Video, 
              title: "HD Video Quality", 
              desc: "Crystal clear 1080p video with real-time interaction",
              gradient: "from-blue-500 to-blue-600"
            },
            { 
              icon: Shield, 
              title: "Bank-Level Security", 
              desc: "End-to-end encryption protects your financial data",
              gradient: "from-green-500 to-green-600"
            },
            { 
              icon: Zap, 
              title: "Instant Access", 
              desc: "No downloads or installations required",
              gradient: "from-purple-500 to-purple-600"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index} 
                className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl"
        >
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <ExternalLink size={16} className="text-white" />
            </div>
            <div className="text-left">
              <h5 className="font-semibold text-amber-900 mb-2">Why External Launch Works Best</h5>
              <p className="text-sm text-amber-800 leading-relaxed">
                The target app has CORS restrictions (X-Frame-Options) that prevent iframe embedding. 
                External launch provides full functionality, better security, and optimal performance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const IframeContent = () => (
    <div className="relative w-full h-full">
      {/* Loading State */}
      {iframeStatus === 'loading' && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video advisor...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {iframeStatus === 'failed' && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center z-10">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-4">Embedding Blocked</h3>
            <p className="text-red-800 mb-6 leading-relaxed">
              The video advisor app has CORS restrictions that prevent iframe embedding. 
              This is a security feature of the target application.
            </p>
            <div className="space-y-3">
              <InteractiveHoverButton
                variant="blue"
                text="Launch in New Window"
                icon={<ExternalLink size={16} />}
                onClick={openInNewTab}
                className="w-full py-3"
              />
              <InteractiveHoverButton
                variant="white"
                text="Back to Main View"
                onClick={resetIframe}
                className="w-full py-3"
              />
            </div>
          </div>
        </div>
      )}

      {/* The actual iframe */}
      <iframe
        ref={iframeRef}
        src={videoAppUrl}
        className="w-full h-full border-0"
        allow="camera; microphone; fullscreen; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"
        title="AI Video Advisor"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
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
                onClick={() => window.location.reload()}
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

            <InteractiveHoverButton
              variant="white"
              text={isMaximized ? "Minimize" : "Maximize"}
              icon={isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              onClick={toggleMaximize}
              className="px-6 py-3 text-sm"
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
                  variant="blue"
                  text="Launch External"
                  icon={<ExternalLink size={14} />}
                  onClick={openInNewTab}
                  className="px-4 py-2 text-sm"
                />
                <InteractiveHoverButton
                  variant="white"
                  text="Minimize"
                  icon={<Minimize2 size={14} />}
                  onClick={toggleMaximize}
                  className="px-4 py-2 text-sm"
                />
              </div>
            </div>

            {/* Full-Height Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 relative overflow-hidden"
            >
              {showAttemptIframe ? <IframeContent /> : <MainContent />}
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
                  
                  <InteractiveHoverButton
                    variant="white"
                    text="Maximize"
                    icon={<Maximize2 size={14} />}
                    onClick={toggleMaximize}
                    className="px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 relative bg-gray-50">
                {showAttemptIframe ? <IframeContent /> : <MainContent />}
              </div>

              {/* Card Footer */}
              <div className="p-4 lg:p-6 border-t border-gray-200/50 bg-gray-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        iframeStatus === 'success' ? 'bg-green-500' : 
                        iframeStatus === 'failed' ? 'bg-red-500' : 
                        iframeStatus === 'loading' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span>
                        {iframeStatus === 'success' ? 'AI Advisor Connected' :
                         iframeStatus === 'failed' ? 'Connection Failed' :
                         iframeStatus === 'loading' ? 'Connecting...' : 'AI Advisor Ready'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {showAttemptIframe && iframeStatus === 'failed' && (
                      <InteractiveHoverButton
                        variant="white"
                        text="Reset"
                        icon={<RefreshCw size={14} />}
                        onClick={resetIframe}
                        className="px-3 py-2 text-sm"
                      />
                    )}
                    <InteractiveHoverButton
                      variant="white"
                      text="Try Embed"
                      icon={<Monitor size={14} />}
                      onClick={attemptIframeLoad}
                      className="px-3 py-2 text-sm"
                    />
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