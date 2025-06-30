import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, BarChart3, X, Send, User, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    subject: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setFormSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        subject: ''
      });
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      id: 'general',
      title: 'General & Support',
      icon: MessageCircle,
      description: 'For help with your account, billing, or general inquiries.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'project',
      title: 'Start a New Project',
      icon: ArrowRight,
      description: 'Tell us about your next big idea or partnership.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'security',
      title: 'Security & Urgent Issues',
      icon: Shield,
      description: 'To report a security concern or an urgent platform issue.',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@argent.com',
      description: 'Get help with your account',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      content: '+1 (555) 123-4567',
      description: '24/7 customer service',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      content: 'San Francisco, CA',
      description: '123 Financial District',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: '24/7 Available',
      description: 'Always here to help',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10 pointer-events-none"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="px-4 lg:px-8 py-4 lg:py-6 border-b border-white/10 bg-black/95 backdrop-blur-xl relative z-50"
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
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </motion.button>
        </nav>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">Let's connect.</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Whether you have a question, a project idea, or need support, we're here to help.
            Select a topic below to get started.
          </p>
        </motion.div>

        {/* Interactive Router Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold col-span-full mb-4">What's on your mind?</h2>
          
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            const isActive = activeSection === card.id;
            
            return (
              <motion.div
                key={card.id}
                className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  activeSection && !isActive ? 'opacity-50' : 'opacity-100'
                } ${isActive ? 'ring-2 ring-accent-blue' : ''}`}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(card.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-400">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic Contact Methods */}
        <AnimatePresence>
          {activeSection === 'general' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden mb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Live Chat</h3>
                      <p className="text-gray-400">Chat with our support team in real-time</p>
                    </div>
                  </div>
                  <InteractiveHoverButton
                    variant="blue"
                    text="Start Live Chat"
                    className="w-full py-3"
                  />
                </motion.div>

                <motion.div 
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Email Support</h3>
                      <p className="text-gray-400">Send us an email and we'll get back to you</p>
                    </div>
                  </div>
                  
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-900/30 border border-green-800/50 rounded-xl p-4 text-center"
                    >
                      <h4 className="text-lg font-semibold text-green-400 mb-2">Message Sent!</h4>
                      <p className="text-green-300 text-sm">
                        Thank you for reaching out. We'll respond to your inquiry within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          required
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                        />
                      </div>
                      <div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Your Message"
                          required
                          rows={3}
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors resize-none"
                        />
                      </div>
                      <InteractiveHoverButton
                        type="submit"
                        variant="blue"
                        text={loading ? "Sending..." : "Send Message"}
                        icon={<Send size={16} />}
                        className="w-full py-3"
                        disabled={loading}
                      />
                      
                      {error && (
                        <div className="text-red-500 text-sm mt-2">{error}</div>
                      )}
                    </form>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === 'project' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden mb-16"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Tell us about your project</h3>
                    <p className="text-gray-400">
                      Share the details of your project and we'll get back to you with a personalized proposal.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveSection(null)}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-900/30 border border-green-800/50 rounded-xl p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check size={32} className="text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Proposal Received!</h3>
                    <p className="text-green-300 mb-4">
                      Thank you for sharing your project details. Our team will review your proposal and get back to you within 24-48 hours.
                    </p>
                    <div className="text-sm text-green-400">
                      Reference ID: #{Date.now().toString().slice(-6)}
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Building size={16} className="inline mr-2" />
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                        placeholder="Your Company"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MessageCircle size={16} className="inline mr-2" />
                        Project Details *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue transition-colors resize-none"
                        placeholder="Tell us about your project, goals, and how we can help..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <InteractiveHoverButton
                        type="submit"
                        disabled={loading}
                        variant="blue"
                        text={loading ? "Sending..." : "Submit Proposal"}
                        icon={<Send size={16} />}
                        className="w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      
                      {error && (
                        <div className="text-red-500 text-sm mt-2">{error}</div>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden mb-16"
            >
              <div className="bg-gray-900 border border-red-900/30 rounded-2xl p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <Shield size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Security & Urgent Issues</h3>
                    <p className="text-gray-300 mb-6 max-w-3xl">
                      For all security-related matters, please email our dedicated security desk directly at <span className="text-red-400 font-semibold">security@argent.com</span>. These inquiries are monitored 24/7 and receive priority response.
                    </p>
                    <div className="bg-black/30 border border-red-900/30 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">When to contact security:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <span>Suspected unauthorized access to your account</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <span>Suspicious transactions or activities</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <span>Potential vulnerabilities or security concerns</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <span>Phishing attempts or suspicious communications</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <InteractiveHoverButton
                        variant="white"
                        text="Contact Security Team"
                        onClick={() => window.location.href = 'mailto:security@argent.com'}
                        className="px-6 py-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Information Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                <p className="text-accent-blue font-medium mb-1">{info.content}</p>
                <p className="text-gray-400 text-sm">{info.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
            Looking for answers?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Check our comprehensive help center for FAQs and documentation.
            Our knowledge base contains answers to most common questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InteractiveHoverButton
              variant="blue"
              text="Visit Help Center"
              onClick={() => window.open('#', '_blank')}
              className="px-8 py-3"
            />
            <InteractiveHoverButton
              variant="white"
              text="Schedule a Call"
              onClick={() => window.open('#', '_blank')}
              className="px-8 py-3"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-gray-500 text-sm">
          © 2024 Argent. All rights reserved. | 
          <a href="#" className="text-accent-blue hover:underline ml-1">Privacy Policy</a> | 
          <a href="#" className="text-accent-blue hover:underline ml-1">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

// Helper component for AnimatePresence
const AnimatePresence: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

// Helper component for Check icon
const Check: React.FC<{
  size: number;
  className?: string;
}> = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default ContactPage;