import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, PieChart, Menu, X, BarChart3, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import AnimatedSection from '../components/AnimatedSection';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize smooth scrolling
  useSmoothScroll();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserName = () => {
    if (user?.full_name) {
      const firstName = user.full_name.split(' ')[0];
      return firstName.replace(/\s*(test|user|demo).*$/i, '');
    }
    const email = user?.email?.split('@')[0] || 'User';
    return email.replace(/\s*(test|user|demo).*$/i, '');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const features = [
    {
      icon: Shield,
      title: 'Secure Banking',
      description: 'Bank-level security with end-to-end encryption for all your financial data.'
    },
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Monitor your portfolio performance with real-time market data and analytics.'
    },
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'Gain insights into your spending patterns with intelligent categorization.'
    }
  ];

  const mobileMenuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#030303] transition-colors duration-500">
      {/* Header with Mobile Navigation */}
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
                onClick={() => navigate('/contact')}
                className="text-sm px-4 py-2"
              />
              <InteractiveHoverButton 
                variant="white" 
                text="Video Chat" 
                icon={<Video size={16} />}
                onClick={() => navigate('/video')}
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
                {/* NO WELCOME MESSAGE HERE - HIDDEN ON HOME PAGE */}
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? 
              <X size={20} className="text-white" /> : 
              <Menu size={20} className="text-white" />
            }
          </motion.button>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                className="fixed top-0 right-0 bottom-0 w-80 z-50 lg:hidden bg-[#030303]/95 backdrop-blur-xl border-l border-white/10"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="p-6 space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-black text-white">Menu</div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                  
                  <nav className="space-y-4">
                    <InteractiveHoverButton 
                      variant="white" 
                      text="About" 
                      onClick={() => {
                        navigate('/about');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center"
                    />
                    <InteractiveHoverButton 
                      variant="white" 
                      text="Contact" 
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center"
                    />
                    <InteractiveHoverButton 
                      variant="white" 
                      text="Video Chat" 
                      icon={<Video size={16} />}
                      onClick={() => {
                        navigate('/video');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center"
                    />
                    
                    {/* My Dashboard - Only show when logged in */}
                    {user && (
                      <InteractiveHoverButton 
                        variant="blue" 
                        text="My Dashboard" 
                        icon={<BarChart3 size={16} />}
                        onClick={() => {
                          navigate('/app/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-center"
                      />
                    )}
                    
                    {user ? (
                      <div className="space-y-4">
                        {/* NO WELCOME MESSAGE HERE - HIDDEN ON HOME PAGE */}
                        <InteractiveHoverButton 
                          variant="white" 
                          text="Sign Out" 
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-center"
                        />
                      </div>
                    ) : (
                      <InteractiveHoverButton 
                        variant="blue" 
                        text="Sign In" 
                        onClick={() => {
                          navigate('/login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-center"
                      />
                    )}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section - Only Dark Mode */}
      <main>
        <HeroGeometric 
          badge="Argent Financial"
          title1="Financial"
          title2="Clarity."
          title3="Simplified."
          description="Take control of your financial future with precision-engineered tools designed for the modern investor."
        />
      </main>

      {/* Features Section with Responsive Grid */}
      <section id="features" className="px-4 lg:px-8 py-12 lg:py-24 border-t border-white/10 bg-[#030303] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl mb-4 text-white font-bold uppercase tracking-wide">Features</h2>
            <motion.div 
              className="w-12 lg:w-16 h-px bg-accent-blue mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </AnimatedSection>
          
          <AnimatedSection 
            className="responsive-grid"
            stagger={true}
            staggerDelay={0.2}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center space-y-4 lg:space-y-6"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 transition-colors duration-500"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={window.innerWidth >= 1024 ? 24 : 20} className="text-white" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg lg:text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-white/70">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      {/* Video Chat Section */}
      <section className="px-4 lg:px-8 py-12 lg:py-24 border-t border-white/10 bg-[#030303] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl mb-4 text-white font-bold uppercase tracking-wide">AI Video Advisor</h2>
            <motion.div 
              className="w-12 lg:w-16 h-px bg-accent-blue mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: window.innerWidth >= 1024 ? 64 : 48 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
            <p className="text-white/70 mt-6 max-w-2xl mx-auto">
              Connect with our AI-powered video financial advisor for personalized guidance and insights.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <InteractiveHoverButton
                  variant="blue"
                  text="Try Video Advisor"
                  icon={<Video size={18} />}
                  onClick={() => navigate('/video')}
                  className="px-8 py-4 text-lg"
                />
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="px-4 lg:px-8 py-12 lg:py-24 border-t border-white/10 bg-[#030303] transition-colors duration-500">
        <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          <h2 className="text-2xl lg:text-4xl font-bold text-white">
            Ready to take control?
          </h2>
          
          <p className="text-white/70">
            Join thousands of users who trust Argent with their financial future.
          </p>
          
          <InteractiveHoverButton 
            variant="blue" 
            text="Start Your Journey" 
            icon={<ArrowRight size={18} />}
            onClick={handleGetStarted}
            className="text-base lg:text-lg px-8 lg:px-12 py-4"
          />
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="px-4 lg:px-8 py-8 lg:py-12 border-t border-white/10 bg-[#030303] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="text-xl lg:text-2xl font-black tracking-tight text-white">
                AR
                <span className="relative">
                  G
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent-blue transform rotate-45"></div>
                </span>
                ENT
              </div>
              <div className="absolute -bottom-0.5 left-0 w-6 lg:w-8 h-0.5 bg-accent-blue"></div>
            </div>
            
            <div className="flex space-x-6 lg:space-x-8">
              <a href="#" className="text-white/70 hover:text-accent-blue transition-colors">Privacy</a>
              <a href="#" className="text-white/70 hover:text-accent-blue transition-colors">Terms</a>
              <a href="/contact" className="text-white/70 hover:text-accent-blue transition-colors">Support</a>
            </div>
            
            <div className="text-sm lg:text-base text-white/70">
              © 2024 Argent. All rights reserved.
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;