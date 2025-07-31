import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import AnimatedSection from '../components/AnimatedSection';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import MainNavBar from '../components/MainNavBar';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Initialize smooth scrolling
  useSmoothScroll();

  const handleGetStarted = () => {
    navigate('/login');
  };  const features = [
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
  ];  return (
    <div className="min-h-screen bg-[#030303] transition-colors duration-500">
      <MainNavBar />

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
              <a href="/privacy" className="text-white/70 hover:text-accent-blue transition-colors">Privacy</a>
              <a href="/terms" className="text-white/70 hover:text-accent-blue transition-colors">Terms</a>
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