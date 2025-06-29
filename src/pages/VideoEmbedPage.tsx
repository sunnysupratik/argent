import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, ExternalLink, Shield, Zap } from 'lucide-react';
import TavusVideoEmbed from '../components/TavusVideoEmbed';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const VideoEmbedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Tavus Video Chat</h1>
            </div>
            <InteractiveHoverButton
              variant="blue"
              text="Back to Dashboard"
              onClick={() => navigate('/app/dashboard')}
              className="px-4 py-2 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Embed (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TavusVideoEmbed height="600px" className="shadow-xl" />
            </motion.div>
          </div>

          {/* Sidebar Information (1/3 width on desktop) */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">About This Service</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our AI-powered video chat provides personalized financial guidance through an interactive experience. 
                Speak directly with our virtual advisor to get answers to your financial questions.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Secure and private conversation with bank-level encryption</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Powered by advanced AI for personalized financial advice</p>
                </div>
                <div className="flex items-start space-x-3">
                  <ExternalLink size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Open in a new tab for a full-screen experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
              <ol className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Allow camera and microphone access when prompted</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>Ask questions about your financial situation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Receive personalized advice and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Follow up with specific questions for deeper insights</span>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <InteractiveHoverButton
                variant="blue"
                text="Open in Full Screen"
                icon={<ExternalLink size={16} />}
                onClick={() => window.open("https://effortless-cucurucho-5a3e21.netlify.app/", "_blank")}
                className="w-full py-3"
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoEmbedPage;