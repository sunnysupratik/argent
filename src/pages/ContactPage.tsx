import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, BarChart3, ArrowRight, User, Building, Send, HelpCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ContactForm from '../components/ContactForm';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const contactCategories = [
    {
      id: 'general',
      icon: MessageCircle,
      title: 'General & Support',
      description: 'For help with your account, billing, or general inquiries',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'project',
      icon: Building,
      title: 'Start a New Project',
      description: 'Tell us about your next big idea or partnership',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security & Urgent Issues',
      description: 'To report a security concern or an urgent platform issue',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const renderContactMethod = () => {
    if (!activeCategory) return null;

    if (activeCategory === 'general') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        >
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Live Chat Support</h3>
            <p className="text-white/70 mb-6">
              Chat with our support team in real-time for immediate assistance with your account or general questions.
            </p>
            <InteractiveHoverButton
              variant="blue"
              text="Start Live Chat"
              icon={<MessageCircle size={16} />}
              className="mx-auto"
            />
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
            <p className="text-white/70 mb-6">
              Send us an email and we'll get back to you within 24 hours. Our support team is ready to help.
            </p>
            <InteractiveHoverButton
              variant="white"
              text="support@argent.com"
              icon={<Mail size={16} />}
              onClick={() => window.location.href = 'mailto:support@argent.com'}
              className="mx-auto"
            />
          </div>
        </motion.div>
      );
    }

    if (activeCategory === 'project') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <ContactForm onSuccess={() => setFormSubmitted(true)} />
        </motion.div>
      );
    }

    if (activeCategory === 'security') {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-500/20 rounded-2xl p-8 mt-8"
        >
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Security & Urgent Issues</h3>
              <p className="text-white/80 mb-4 leading-relaxed">
                For all security-related matters, please email our dedicated security desk directly. These inquiries are monitored 24/7 and receive priority response.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <InteractiveHoverButton
                  variant="white"
                  text="security@argent.com"
                  icon={<Mail size={16} />}
                  onClick={() => window.location.href = 'mailto:security@argent.com?subject=Security%20Issue'}
                />
                <InteractiveHoverButton
                  variant="blue"
                  text="Emergency Hotline"
                  icon={<Phone size={16} />}
                  onClick={() => window.location.href = 'tel:+18005551234'}
                />
              </div>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm">
                  <strong>Important:</strong> If you believe your account has been compromised, please call our emergency hotline immediately at +1 (800) 555-1234.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-indigo-950/10 to-violet-950/20 animate-aurora opacity-30" />
      </div>

      {/* Geometric shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="px-4 lg:px-8 py-4 lg:py-6 border-b border-white/10 bg-black/95 backdrop-blur-xl transition-colors duration-500 relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          {/* ARGENT logo clickable to go home */}
          <motion.button
            onClick={() => navigate('/')}
            className="relative cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl lg:text-3xl font-black tracking-tight text-white transition-colors duration-500">
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
          </motion.button>
          
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
                text="Contact" 
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

      <div className="relative mobile-spacing lg:p-8 space-y-8 lg:space-y-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <AnimatedSection className="text-center max-w-4xl mx-auto pt-12 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.15] backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
              <span className="text-sm text-white/70 tracking-wide font-medium">
                Let's Connect
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular mx-auto"
              style={{ 
                lineHeight: '1.15', 
                paddingTop: '1rem', 
                paddingBottom: '1rem',
                letterSpacing: '-0.02em'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="text-white">How can we</div>
              <div className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
                help you today?
              </div>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              className="text-lg md:text-xl leading-relaxed tracking-tight text-white/60 max-w-2xl text-center mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Whether you have a question, a project idea, or need support, we're here to help.
              Select a topic below to get started.
            </motion.p>

            {/* Decorative Line */}
            <motion.div 
              className="w-24 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent mx-auto"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 96, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.7 }}
            />
          </motion.div>
        </AnimatedSection>

        {/* Contact Categories */}
        <AnimatedSection className="mb-8 lg:mb-16" delay={0.4}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {contactCategories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <motion.div
                  key={category.id}
                  className={`bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 text-center cursor-pointer transition-all duration-300 ${
                    isActive ? 'ring-2 ring-accent-blue' : 'hover:bg-white/[0.04]'
                  } ${activeCategory && !isActive ? 'opacity-50' : 'opacity-100'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeCategory && !isActive ? 0.5 : 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-white/60 text-sm">{category.description}</p>
                  
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 inline-flex items-center text-accent-blue text-sm font-medium"
                    >
                      <span>Selected</span>
                      <ArrowRight size={14} className="ml-1" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatedSection>

        {/* Dynamic Contact Method */}
        {renderContactMethod()}

        {/* FAQ Section */}
        <AnimatedSection className="text-center max-w-4xl mx-auto pb-16" delay={1.4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.15] backdrop-blur-sm">
              <HelpCircle size={16} className="text-accent-blue" />
              <span className="text-sm text-white/70 tracking-wide font-medium">
                Frequently Asked Questions
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Looking for answers?
            </h2>
            
            <p className="text-white/60 leading-relaxed">
              Check out our comprehensive help center for FAQs and documentation.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
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
        </AnimatedSection>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white/40 text-sm">© 2025 Argent. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;