import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { FeaturesSectionWithHoverEffects } from '../components/ui/feature-section-with-hover-effects';
import MainNavBar from '../components/MainNavBar';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] transition-colors duration-500 relative overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-indigo-50/3 to-violet-50/5 animate-aurora opacity-30" />
      </div>

      <MainNavBar />

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm shadow-md"
            >
              <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
              <span className="text-sm text-white/70 tracking-wide font-medium">
                Financial Tools & Features
              </span>
            </motion.div>

            {/* Main Title - Same Typography as Homepage */}
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
              <div className="text-white">Powerful Financial</div>
              <div className="bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
                Management Suite
              </div>
            </motion.h1>

            {/* Enhanced Description - Same Typography as Homepage */}
            <motion.p 
              className="text-lg md:text-xl leading-relaxed tracking-tight text-white/70 max-w-2xl text-center mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Explore our comprehensive suite of financial tools designed to give you complete control 
              over your money. From advanced analytics to secure banking, every feature is crafted 
              for the modern investor.
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

        {/* Enhanced Features Section */}
        <AnimatedSection className="mb-8 lg:mb-16" delay={0.4}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-indigo-500/5 to-violet-500/5 rounded-3xl blur-3xl" />
            
            {/* Main Content Container */}
            <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/[0.08] overflow-hidden">
              {/* Subtle Top Border Accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
              
              <div className="p-6 lg:p-12">
                <FeaturesSectionWithHoverEffects />
              </div>
              
              {/* Subtle Bottom Border Accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Additional Info Section - More Aligned */}
        <AnimatedSection className="text-center max-w-3xl mx-auto pb-16" delay={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Built for the Future of Finance
            </h2>
            <p className="text-white/60 leading-relaxed">
              Our platform combines cutting-edge technology with intuitive design to deliver 
              an unparalleled financial management experience. Every feature is thoughtfully 
              designed to help you make smarter financial decisions.
            </p>
            
            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { number: "99.9%", label: "Uptime" },
                { number: "256-bit", label: "Encryption" },
                { number: "24/7", label: "Support" },
                { number: "50+", label: "Features" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-accent-blue mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>

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

export default AboutPage;