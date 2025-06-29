import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageCircle, Shield, BarChart3 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ContactForm from '../components/ContactForm';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Security Center',
      description: 'Report security issues or concerns',
      action: 'Report Issue',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] transition-colors duration-500 relative overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-indigo-50/3 to-violet-50/5 animate-aurora opacity-30" />
      </div>

      {/* Header - Same Black Style as Homepage */}
      <motion.header 
        className="px-4 lg:px-8 py-4 lg:py-6 border-b border-white/10 bg-[#030303]/95 backdrop-blur-xl transition-colors duration-500 relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            className="relative"
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

      <div className="relative mobile-spacing lg:p-8 space-y-8 lg:space-y-12">
        {/* Enhanced Page Header */}
        <AnimatedSection className="text-center max-w-4xl mx-auto pt-8 lg:pt-16">
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
                Get in Touch
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
              <div className="text-white">Contact Our</div>
              <div className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
                Support Team
              </div>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We're here to help you with any questions about Argent. Our dedicated support team 
              is available 24/7 to ensure you get the most out of your financial management experience.
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

        {/* Contact Information Cards */}
        <AnimatedSection className="mb-8 lg:mb-16" delay={0.4}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-accent-blue font-medium mb-1">{info.content}</p>
                  <p className="text-white/60 text-sm">{info.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatedSection>

        {/* Contact Form and Support Channels */}
        <AnimatedSection className="mb-8 lg:mb-16" delay={0.8}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Contact Form with Airtable Integration */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <ContactForm onSuccess={() => setFormSubmitted(true)} />
            </motion.div>

            {/* Support Channels */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h3>
              
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${channel.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">{channel.title}</h4>
                        <p className="text-white/60 mb-4">{channel.description}</p>
                        <InteractiveHoverButton
                          variant="white"
                          text={channel.action}
                          className="px-4 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Airtable Integration Status */}
              <motion.div
                className="bg-gradient-to-r from-green-50/10 to-emerald-50/10 border border-green-500/20 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">Lead Management</h4>
                    <p className="text-white/60 mb-2">
                      All form submissions are automatically saved to our Airtable CRM system for efficient lead tracking and follow-up.
                    </p>
                    <div className="text-sm text-green-400">
                      ✓ Secure data storage ✓ Automated lead scoring ✓ 24h response guarantee
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection className="text-center max-w-4xl mx-auto pb-16" delay={1.4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-white/60 leading-relaxed">
              Can't find what you're looking for? Check out our comprehensive help center 
              or reach out to our support team directly.
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
    </div>
  );
};

export default ContactPage;