import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Mic,
  TrendingUp, 
  Play,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import MainNavBar from '../components/MainNavBar';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const features = [
    {
      id: 'ai-insights',
      title: "AI Analyst - Your Financial Detective",
      description: "Meet your dedicated AI Analyst who works 24/7 to uncover hidden patterns in your financial data. Through advanced machine learning, it identifies spending leaks, predicts cash flow issues, and discovers optimization opportunities you'd never find manually.",
      benefits: [
        "Real-time spending pattern analysis",
        "Predictive cash flow forecasting",
        "Automated expense categorization",
        "Anomaly detection and alerts",
        "Personalized financial insights"
      ],
      icon: Brain,
      demoImage: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "ai-analyst-demo"
    },
    {
      id: 'ai-strategist',
      title: "AI Strategist - Your Investment Advisor",
      description: "Get personalized investment strategies and portfolio recommendations from our AI Strategist. Using advanced algorithms and market analysis, it helps you make informed investment decisions and optimize your portfolio for better returns.",
      benefits: [
        "Personalized investment recommendations",
        "Portfolio optimization strategies",
        "Risk assessment and management",
        "Market trend analysis",
        "Tax-efficient investment planning"
      ],
      icon: TrendingUp,
      demoImage: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "ai-strategist-demo"
    },
    {
      id: 'ai-voice',
      title: "AI Voice Advisor - Your Financial Coach",
      description: "Have natural conversations with your AI Voice Advisor about your finances. Ask questions, get advice, and receive coaching through voice commands - perfect for hands-free financial management while on the go.",
      benefits: [
        "Natural voice conversations",
        "Hands-free financial management",
        "Real-time account updates",
        "Personalized financial coaching",
        "Multi-language support"
      ],
      icon: Mic,
      demoImage: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "ai-voice-demo"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] transition-colors duration-500 relative overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-indigo-50/3 to-violet-50/5 animate-aurora opacity-30" />
      </div>
      <MainNavBar />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-24">
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
        {/* Features Grid */}
        <div className="space-y-16 lg:space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <AnimatedSection key={feature.id} delay={index * 0.2}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">{feature.title}</h2>
                    </div>
                    <p className="text-white/70 text-lg mb-6 leading-relaxed">{feature.description}</p>
                    <div className="space-y-3 mb-8">
                      {feature.benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                        >
                          <CheckCircle size={16} className="text-accent-blue flex-shrink-0" />
                          <span className="text-white/80">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <InteractiveHoverButton
                        variant="blue"
                        text="Try Feature"
                        icon={<ArrowRight size={16} />}
                        onClick={() => navigate('/login')}
                        className="px-6 py-3"
                      />
                      <InteractiveHoverButton
                        variant="white"
                        text="Watch Demo"
                        icon={<Play size={16} />}
                        onClick={() => setActiveDemo(feature.videoDemo)}
                        className="px-6 py-3"
                      />
                    </div>
                  </div>
                  {/* Demo/Image */}
                  <div className={`relative ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`}>
                    <motion.div
                      className="relative rounded-2xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeDemo === feature.videoDemo ? (
                        <div className="aspect-video bg-gradient-to-r from-accent-blue to-blue-600 flex items-center justify-center">
                          <div className="text-center text-white">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                            />
                            <p className="text-lg font-medium">Loading Demo...</p>
                          </div>
                        </div>
                      ) : (
                        <img src={feature.demoImage} alt={feature.title} className="w-full h-auto rounded-2xl shadow-lg" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
        {/* CTA Section */}
        <AnimatedSection className="text-center mt-16 lg:mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to experience the future of finance?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of users who are already using AI to take control of their financial future.
            </p>
            <InteractiveHoverButton
              variant="blue"
              text="Start Your Free Trial"
              icon={<ArrowRight size={18} />}
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-4"
            />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default FeaturesPage;