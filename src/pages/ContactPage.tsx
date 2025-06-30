import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, User, MessageCircle, Send, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { useLeads } from '../hooks/useLeads';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { createLead, loading, error: submitError } = useLeads();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'I need technical support with the app.',
    message: ''
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await createLead({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        source: 'Support Form'
      });
      
      if (success) {
        setFormSubmitted(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: 'I need technical support with the app.',
          message: ''
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const subjectOptions = [
    "I need technical support with the app.",
    "I have a question about my account or billing.",
    "I have feedback or a feature suggestion.",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      {/* Subtle gradient background with reduced opacity for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10 pointer-events-none"></div>
      
      {/* Header */}
      <motion.header 
        className="px-4 lg:px-8 py-4 lg:py-6 border-b border-white/10 bg-[#030303]/95 backdrop-blur-xl relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              AR
              <span className="relative">
                G
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue transform rotate-45"
                  animate={{ rotate: [45, 90, 45] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              ENT
            </div>
            <motion.div 
              className="absolute -bottom-1 left-0 w-8 lg:w-12 h-0.5 bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1024 ? 48 : 32 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InteractiveHoverButton 
                variant="white" 
                text="About" 
                onClick={() => navigate('/about')}
                className="text-sm px-4 py-2"
              />
              <InteractiveHoverButton 
                variant="white" 
                text="Home" 
                onClick={() => navigate('/')}
                className="text-sm px-4 py-2"
              />
              
              {/* My Dashboard - Only show when logged in */}
              {user && (
                <InteractiveHoverButton 
                  variant="blue" 
                  text="My Dashboard" 
                  icon={<BarChart3 size={16} />}
                  onClick={() => navigate('/app/dashboard')}
                  className="text-sm px-4 py-2"
                />
              )}
            </motion.div>

            {user ? (
              <div className="flex items-center space-x-4">
                <InteractiveHoverButton 
                  variant="white" 
                  text="Sign Out" 
                  onClick={handleSignOut}
                  className="text-sm px-4 py-2"
                />
              </div>
            ) : (
              <InteractiveHoverButton 
                variant="blue" 
                text="Sign In" 
                onClick={() => navigate('/login')}
                className="text-sm px-6 py-2"
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </motion.button>
        </nav>
      </motion.header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm shadow-md mb-6"
          >
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm text-white/70 tracking-wide font-medium">
              Get In Touch
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">How can we help?</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Whether you need help with a feature or have a suggestion, we're here to listen.
          </p>
        </motion.div>

        {/* Contact Form Section - Improved contrast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 lg:p-8"
        >
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/70 border border-green-600 rounded-xl p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-green-100 mb-4">
                Thank you for reaching out. We'll respond to your inquiry within 24 hours.
              </p>
              <div className="text-sm text-green-200">
                Reference ID: #{Date.now().toString().slice(-6)}
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <User size={16} className="inline mr-2" />
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Your Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <MessageCircle size={16} className="inline mr-2" />
                  What is this about? *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-blue transition-colors"
                >
                  {subjectOptions.map((option, index) => (
                    <option key={index} value={option} className="bg-gray-800 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <div>
                <InteractiveHoverButton
                  type="submit"
                  disabled={loading}
                  variant="blue"
                  text={loading ? "Sending..." : "Send Message"}
                  icon={<Send size={16} />}
                  className="w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
                
                {submitError && (
                  <div className="text-red-300 text-sm mt-2 bg-red-900/30 p-2 rounded-lg border border-red-700">
                    {submitError}
                  </div>
                )}
              </div>
            </form>
          )}
        </motion.div>

        {/* Help Center Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-3">
            Looking for answers?
          </h2>
          <p className="text-white/90 mb-6">
            Check our comprehensive help center for FAQs and documentation.
          </p>
          
          <InteractiveHoverButton
            variant="white"
            text="Visit Help Center"
            onClick={() => window.open('#', '_blank')}
            className="px-8 py-3"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-white/70 text-sm">
          © 2024 Argent. All rights reserved. | 
          <a href="#" className="text-accent-blue hover:underline ml-1">Privacy Policy</a> | 
          <a href="#" className="text-accent-blue hover:underline ml-1">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;