import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Star, 
  ArrowRight, 
  Shield, 
  Zap, 
  Crown,
  BarChart3,
  Users,
  Building
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for getting started with personal finance management",
      icon: Shield,
      color: "from-gray-500 to-gray-600",
      features: [
        "Connect up to 2 bank accounts",
        "Basic transaction tracking",
        "Monthly spending reports",
        "Mobile app access",
        "Email support",
        "Basic budgeting tools"
      ],
      limitations: [
        "Limited AI insights",
        "No investment tracking",
        "Basic security features"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$9.99",
      period: "per month",
      description: "Advanced tools for serious financial management",
      icon: Zap,
      color: "from-accent-blue to-blue-600",
      features: [
        "Unlimited account connections",
        "Advanced AI financial insights",
        "Investment portfolio tracking",
        "Real-time market alerts",
        "Custom budget categories",
        "Credit score monitoring",
        "Goal tracking & planning",
        "Priority email support",
        "Data export capabilities",
        "Advanced security features"
      ],
      limitations: [],
      cta: "Start 14-Day Free Trial",
      popular: true,
      savings: "Save $24 annually"
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Complete financial ecosystem for power users",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      features: [
        "Everything in Professional",
        "AI Financial Advisor chat",
        "Video consultations with AI Strategist",
        "Voice assistant integration",
        "Advanced portfolio analytics",
        "Tax optimization insights",
        "Estate planning tools",
        "White-glove onboarding",
        "24/7 phone support",
        "API access for developers",
        "Custom reporting",
        "Multi-user family accounts"
      ],
      limitations: [],
      cta: "Start Premium Trial",
      popular: false,
      savings: "Save $48 annually"
    }
  ];

  const enterpriseFeatures = [
    "Custom integrations and APIs",
    "Dedicated account manager",
    "Advanced compliance tools",
    "Custom security configurations",
    "Bulk user management",
    "Advanced analytics and reporting",
    "SLA guarantees",
    "On-premise deployment options"
  ];

  const faqs = [
    {
      question: "Can I change plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use bank-level 256-bit encryption, multi-factor authentication, and are SOC 2 Type II compliant. Your data is never shared without your explicit consent."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
    },
    {
      question: "How does the free trial work?",
      answer: "All paid plans include a 14-day free trial with full access to features. No credit card required to start. You can cancel anytime during the trial period."
    },
    {
      question: "Can I connect international bank accounts?",
      answer: "Currently, we support banks in the US, Canada, and UK. We're actively expanding to support more countries and financial institutions."
    }
  ];

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
              text="Features" 
              onClick={() => navigate('/features')}
              className="text-sm px-4 py-2"
            />
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
              Transparent Pricing
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Choose Your
            <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Financial Journey
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core security features 
            and customer support. No hidden fees, cancel anytime.
          </p>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <AnimatedSection key={plan.name} delay={index * 0.2}>
                <motion.div
                  className={`relative bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 h-full ${
                    plan.popular ? 'ring-2 ring-accent-blue' : ''
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-accent-blue text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                        <Star size={14} />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period !== "Forever" && (
                        <span className="text-white/60 text-lg">/{plan.period}</span>
                      )}
                    </div>
                    
                    {plan.savings && (
                      <div className="text-green-400 text-sm font-medium">{plan.savings}</div>
                    )}
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check size={16} className="text-accent-blue flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/40 text-xs mb-2">Limitations:</p>
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-white/40 rounded-full mx-auto mt-1"></div>
                            </div>
                            <span className="text-white/40 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <InteractiveHoverButton
                    variant={plan.popular ? "blue" : "white"}
                    text={plan.cta}
                    icon={<ArrowRight size={16} />}
                    onClick={() => navigate('/login')}
                    className="w-full py-4"
                  />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <AnimatedSection className="mb-16" delay={0.6}>
          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building size={24} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Enterprise</h3>
                </div>
                
                <p className="text-white/70 text-lg mb-6">
                  Custom solutions for organizations with advanced financial management needs. 
                  Tailored features, dedicated support, and enterprise-grade security.
                </p>
                
                <div className="flex space-x-4">
                  <InteractiveHoverButton
                    variant="blue"
                    text="Contact Sales"
                    icon={<Users size={16} />}
                    onClick={() => navigate('/contact')}
                    className="px-6 py-3"
                  />
                  <InteractiveHoverButton
                    variant="white"
                    text="Schedule Demo"
                    onClick={() => navigate('/contact')}
                    className="px-6 py-3"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {enterpriseFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                  >
                    <Check size={16} className="text-purple-400 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection className="mb-16" delay={0.8}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70 text-lg">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="text-lg font-bold text-white mb-3">{faq.question}</h4>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Money Back Guarantee */}
        <AnimatedSection className="text-center" delay={1.0}>
          <div className="bg-green-900/20 backdrop-blur-xl rounded-3xl border border-green-500/20 p-8 lg:p-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-white" />
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              30-Day Money-Back Guarantee
            </h3>
            
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Try Argent risk-free. If you're not completely satisfied with our service 
              within the first 30 days, we'll refund your money, no questions asked.
            </p>
            
            <InteractiveHoverButton
              variant="blue"
              text="Start Your Free Trial"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-lg"
            />
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

export default PricingPage;