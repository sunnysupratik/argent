import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Target, 
  Wallet, 
  CreditCard, 
  PieChart, 
  DollarSign,
  Play,
  ArrowRight,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const features = [
    {
      id: 'ai-insights',
      title: "AI Analyst - Your Financial Detective",
      description: "Meet your dedicated AI Analyst who works 24/7 to uncover hidden patterns in your financial data. Through advanced machine learning, it identifies spending leaks, predicts cash flow issues, and discovers optimization opportunities you'd never find manually.",
      icon: Brain,
      benefits: [
        "Discovers $200-500 monthly savings opportunities",
        "Predicts cash flow shortfalls 30 days in advance",
        "Identifies subscription waste and duplicate charges",
        "Provides personalized investment timing recommendations"
      ],
      demoImage: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "ai-insights-demo"
    },
    {
      id: 'ai-strategist',
      title: "AI Strategist - Your Investment Advisor",
      description: "Your AI Strategist provides sophisticated portfolio analysis and strategic investment guidance through interactive video consultations. Get personalized investment strategies, risk assessments, and market timing advice from your dedicated AI advisor.",
      icon: Users,
      benefits: [
        "Interactive video consultations with AI avatar",
        "Personalized investment strategy development",
        "Real-time market analysis and recommendations",
        "Portfolio rebalancing with visual explanations"
      ],
      demoImage: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "strategist-demo"
    },
    {
      id: 'ai-advisor',
      title: "AI Advisor - Your Voice Assistant",
      description: "Experience natural voice conversations with your AI Advisor powered by ElevenLabs technology. Get instant answers to financial questions, voice-activated account management, and hands-free financial guidance while you're on the go.",
      icon: Mic,
      benefits: [
        "Natural voice conversations about your finances",
        "Hands-free account balance and transaction queries",
        "Voice-activated budget adjustments and goal setting",
        "Real-time financial coaching during daily activities"
      ],
      demoImage: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "voice-advisor-demo"
    },
    {
      id: 'security',
      title: "Bank-Level Security",
      description: "Bank-level, end-to-end encryption protecting all your sensitive financial data. This is the bedrock of our platform. Your trust and privacy are our foundation.",
      icon: Shield,
      benefits: [
        "256-bit AES encryption",
        "Multi-factor authentication",
        "SOC 2 Type II compliance",
        "Zero-knowledge architecture"
      ],
      demoImage: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "security-demo"
    },
    {
      id: 'ai-powered-budgeting',
      title: "AI-Powered Smart Budgeting",
      description: "Your AI team collaborates to create budgets that actually work. The AI Analyst identifies spending patterns, the Strategist sets realistic goals, and the Advisor provides daily guidance to keep you on track.",
      icon: Target,
      benefits: [
        "AI-generated budgets based on your actual spending patterns",
        "Collaborative goal-setting with your AI Strategist",
        "Voice reminders and guidance from your AI Advisor",
        "Predictive alerts before you exceed budget limits"
      ],
      demoImage: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "budgeting-demo"
    },
    {
      id: 'unified-accounts',
      title: "Unified Financial Hub",
      description: "Securely connect all your banks, credit cards, and investment accounts into one seamless platform. This is your Financial Headquarters—the single source of truth.",
      icon: Wallet,
      benefits: [
        "Connect 10,000+ financial institutions",
        "Real-time account synchronization",
        "Unified transaction history",
        "Cross-account transfer management"
      ],
      demoImage: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "accounts-demo"
    },
    {
      id: 'credit-improvement',
      title: "Guided Credit Improvement",
      description: "Don't just watch your credit score, improve it. Your AI Analyst provides clear, personalized recommendations to help you understand and build your credit with confidence.",
      icon: CreditCard,
      benefits: [
        "Credit score monitoring and alerts",
        "Personalized improvement strategies",
        "Debt optimization recommendations",
        "Credit utilization tracking"
      ],
      demoImage: "https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=800",
      videoDemo: "credit-demo"
    }
  ];

  const playDemo = (demoId: string) => {
    setActiveDemo(demoId);
    // In a real implementation, this would trigger a video modal or demo
    setTimeout(() => setActiveDemo(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
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
          
          <div className="hidden lg:flex items-center space-x-4">
            <InteractiveHoverButton 
              variant="white" 
              text="About" 
              onClick={() => navigate('/about')}
              className="text-sm px-4 py-2"
            />
            <InteractiveHoverButton 
              variant="white" 
              text="Pricing" 
              onClick={() => navigate('/pricing')}
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
              text="Home" 
              onClick={() => navigate('/')}
              className="text-sm px-4 py-2"
            />
            
            {user && (
              <InteractiveHoverButton 
                variant="blue" 
                text="My Dashboard" 
                icon={<BarChart3 size={16} />}
                onClick={() => navigate('/app/dashboard')}
                className="text-sm px-4 py-2"
              />
            )}

            {user ? (
              <InteractiveHoverButton 
                variant="white" 
                text="Sign Out" 
                onClick={handleSignOut}
                className="text-sm px-4 py-2"
              />
            ) : (
              <InteractiveHoverButton 
                variant="blue" 
                text="Sign In" 
                onClick={() => navigate('/login')}
                className="text-sm px-6 py-2"
              />
            )}
          </div>
        </nav>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm shadow-md mb-6"
          >
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm text-white/70 tracking-wide font-medium">
              Precision-Engineered Financial Tools
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Features That Transform
            <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Your Financial Life
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            Discover how our AI-powered platform revolutionizes personal finance management 
            with intelligent insights, automated optimization, and bank-level security.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="space-y-16 lg:space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <AnimatedSection key={feature.id} delay={index * 0.2}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {feature.title}
                      </h2>
                    </div>
                    
                    <p className="text-white/70 text-lg mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
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
                        onClick={() => playDemo(feature.videoDemo)}
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
                        <img
                          src={feature.demoImage}
                          alt={`${feature.title} demonstration`}
                          className="w-full aspect-video object-cover"
                        />
                      )}
                      
                      {/* Play button overlay */}
                      <motion.button
                        onClick={() => playDemo(feature.videoDemo)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play size={24} className="text-white ml-1" />
                        </div>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* CTA Section */}
        <AnimatedSection className="text-center mt-24" delay={0.8}>
          <div className="bg-gradient-to-r from-accent-blue/10 to-blue-600/10 backdrop-blur-xl rounded-3xl border border-accent-blue/20 p-8 lg:p-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-blue-600 rounded-xl flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Mic size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Meet Your AI Financial Team?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience the future of personal finance with your dedicated AI Analyst, Strategist, and Advisor. 
              Get personalized guidance through text, video, and voice interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InteractiveHoverButton
                variant="blue"
                text="Meet Your AI Team"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-lg"
              />
              <InteractiveHoverButton
                variant="white"
                text="Watch AI Demo"
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 text-lg"
              />
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-white/70 text-sm">
          © 2024 Argent. All rights reserved. | 
          <a href="/privacy" className="text-accent-blue hover:underline ml-1">Privacy Policy</a> | 
          <a href="/terms" className="text-accent-blue hover:underline ml-1">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;