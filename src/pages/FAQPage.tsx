import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Search, 
  HelpCircle, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Settings,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'ai-agents', name: 'AI Agents', icon: Brain },
    { id: 'getting-started', name: 'Getting Started', icon: Smartphone },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
    { id: 'features', name: 'Features & Tools', icon: Settings },
    { id: 'technical', name: 'Technical Support', icon: BarChart3 }
  ];

  const faqs = [
    {
      category: 'ai-agents',
      question: "How do the three AI agents work together?",
      answer: "Your AI team consists of three specialized agents: the AI Analyst (text chat) analyzes your data and provides insights, the AI Strategist (video consultations) offers strategic guidance and investment advice, and the AI Voice Advisor (voice conversations) provides hands-free assistance and daily financial coaching. They share your financial context to provide consistent, personalized advice."
    },
    {
      category: 'ai-agents',
      question: "What makes the AI Strategist video consultations special?",
      answer: "Our AI Strategist uses advanced avatar technology powered by Tavus to provide face-to-face video consultations. Unlike chatbots, you can have natural conversations about complex financial strategies, see visual portfolio analysis, and receive personalized investment recommendations through an engaging video interface that feels like talking to a real advisor."
    },
    {
      category: 'ai-agents',
      question: "How natural are the voice conversations with the AI Advisor?",
      answer: "The AI Voice Advisor, powered by ElevenLabs' advanced voice technology, provides remarkably natural conversations. You can ask about account balances, get spending insights, set budget goals, and receive financial coaching through voice commands - all while driving, exercising, or multitasking. The AI understands context and maintains conversation flow like a human advisor."
    },
    {
      category: 'ai-agents',
      question: "Can I switch between different AI agents during a session?",
      answer: "Yes! You can seamlessly move between your AI agents based on your needs. Start with a quick voice query to the AI Advisor, dive deeper with the AI Analyst through text chat, and schedule a video consultation with the AI Strategist for complex planning. All agents share your context and previous conversations."
    },
    {
      category: 'getting-started',
      question: "How do I get started with Argent?",
      answer: "Getting started is simple! Sign up for a free account, connect your bank accounts using our secure integration, and our AI will immediately begin analyzing your financial data to provide personalized insights. The entire setup process takes less than 5 minutes."
    },
    {
      category: 'getting-started',
      question: "Which banks and financial institutions do you support?",
      answer: "We support over 10,000 financial institutions across the US, Canada, and UK, including all major banks like Chase, Bank of America, Wells Fargo, Citibank, and thousands of credit unions and regional banks. If you don't see your bank listed, contact our support team."
    },
    {
      category: 'getting-started',
      question: "Do I need to download an app?",
      answer: "Argent works seamlessly in your web browser on any device. While we don't currently have a dedicated mobile app, our responsive web platform provides a native app-like experience on smartphones and tablets."
    },
    {
      category: 'security',
      question: "How secure is my financial data?",
      answer: "Your security is our top priority. We use bank-level 256-bit AES encryption, multi-factor authentication, and are SOC 2 Type II compliant. We never store your banking credentials - we use read-only access through secure APIs. Your data is encrypted both in transit and at rest."
    },
    {
      category: 'security',
      question: "Can Argent access my money or make transactions?",
      answer: "No, absolutely not. Argent only has read-only access to your account information. We cannot move money, make purchases, or perform any transactions on your behalf. We can only view your account balances and transaction history to provide insights."
    },
    {
      category: 'security',
      question: "What happens if there's a data breach?",
      answer: "While we employ industry-leading security measures to prevent breaches, we have comprehensive incident response procedures. In the unlikely event of a security incident, we would immediately notify affected users and relevant authorities, and provide detailed information about steps being taken."
    },
    {
      category: 'billing',
      question: "How much does Argent cost?",
      answer: "Argent offers three plans: Starter (Free forever), Professional ($9.99/month), and Premium ($19.99/month). All paid plans include a 14-day free trial with no credit card required. You can upgrade, downgrade, or cancel at any time."
    },
    {
      category: 'billing',
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. Your account will remain active until the end of your current billing period, and you'll retain access to all features during that time."
    },
    {
      category: 'billing',
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with Argent for any reason within your first 30 days, contact our support team for a full refund."
    },
    {
      category: 'billing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. For Enterprise customers, we also offer invoice billing and ACH payments."
    },
    {
      category: 'features',
      question: "What makes Argent's AI different from other financial apps?",
      answer: "Argent's AI goes beyond simple categorization. Our three-tier AI system (Analyst, Strategist, Advisor) provides personalized insights, proactive recommendations, and strategic guidance. The AI learns your spending patterns and financial goals to provide increasingly accurate and helpful advice over time."
    },
    {
      category: 'features',
      question: "Can I set up custom budget categories?",
      answer: "Yes! While our AI automatically categorizes transactions, you can create custom categories, merge existing ones, and set specific budget limits for each category. The system learns from your customizations to improve future categorization."
    },
    {
      category: 'features',
      question: "How accurate is the investment tracking?",
      answer: "Our investment tracking uses real-time market data from leading financial data providers. Portfolio values are updated throughout market hours, and we provide detailed performance analytics including sector allocation, risk metrics, and benchmark comparisons."
    },
    {
      category: 'features',
      question: "Can I export my financial data?",
      answer: "Yes, you can export your data in multiple formats including CSV, PDF, and JSON. This includes transaction history, budget reports, investment summaries, and custom date ranges. Premium users get additional export options and automated report scheduling."
    },
    {
      category: 'technical',
      question: "Why isn't my bank account connecting?",
      answer: "Connection issues are usually temporary and related to bank maintenance or security updates. Try reconnecting after a few hours. If the problem persists, check that you're using the correct credentials and that your bank account is in good standing. Contact support if you need assistance."
    },
    {
      category: 'technical',
      question: "How often is my data updated?",
      answer: "Account balances and transactions are typically updated every 24 hours, though some banks provide real-time updates. Investment data is updated throughout market hours. You can manually refresh your accounts at any time from the dashboard."
    },
    {
      category: 'technical',
      question: "What browsers do you support?",
      answer: "Argent works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
    },
    {
      category: 'technical',
      question: "I'm having trouble with the AI chat feature. What should I do?",
      answer: "The AI chat requires a stable internet connection and modern browser. Try refreshing the page or clearing your browser cache. If you continue experiencing issues, our human support team is available 24/7 to assist you."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      {/* Header */}
      <motion.header 
        className="px-4 lg:px-8 py-6 lg:py-8 border-b border-white/10 bg-[#030303]/95 backdrop-blur-xl relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto min-h-[60px]">
          <motion.div 
            className="relative flex-shrink-0 mr-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-2xl lg:text-3xl font-black tracking-tight text-white pb-2">
              AR
              <span className="relative">
                G
                <motion.div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue transform rotate-45 z-10"
                  animate={{ rotate: [45, 90, 45] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              ENT
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 w-8 lg:w-12 h-0.5 bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: window.innerWidth >= 1024 ? 48 : 32 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
          
          <div className="hidden lg:flex items-center space-x-2 flex-wrap">
            <InteractiveHoverButton 
              variant="white" 
              text="Features" 
              onClick={() => navigate('/features')}
              className="text-sm px-4 py-2 min-w-[100px]"
            />
            <InteractiveHoverButton 
              variant="white" 
              text="Pricing" 
              onClick={() => navigate('/pricing')}
              className="text-sm px-4 py-2 min-w-[100px]"
            />
            <InteractiveHoverButton 
              variant="white" 
              text="Blog" 
              onClick={() => navigate('/blog')}
              className="text-sm px-4 py-2 min-w-[100px]"
            />
            <InteractiveHoverButton 
              variant="white" 
              text="Contact" 
              onClick={() => navigate('/contact')}
              className="text-sm px-4 py-2 min-w-[100px]"
            />
            <InteractiveHoverButton 
              variant="white" 
              text="Home" 
              onClick={() => navigate('/')}
              className="text-sm px-4 py-2 min-w-[100px]"
            />
            
            {user && (
              <InteractiveHoverButton 
                variant="blue" 
                text="My Dashboard" 
                icon={<BarChart3 size={16} />}
                onClick={() => navigate('/app/dashboard')}
                className="text-sm px-4 py-2 min-w-[120px]"
              />
            )}

            {user ? (
              <InteractiveHoverButton 
                variant="white" 
                text="Sign Out" 
                onClick={handleSignOut}
                className="text-sm px-4 py-2 min-w-[100px] ml-4"
              />
            ) : (
              <InteractiveHoverButton 
                variant="blue" 
                text="Sign In" 
                onClick={() => navigate('/login')}
                className="text-sm px-6 py-2 min-w-[100px] ml-4"
              />
            )}
          </div>
        </nav>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm shadow-md mb-6"
          >
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm text-white/70 tracking-wide font-medium">
              Help Center
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Frequently Asked
            <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Find answers to common questions about Argent's features, security, pricing, and more. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </AnimatedSection>

        {/* Search */}
        <AnimatedSection className="mb-8" delay={0.2}>
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
            />
          </div>
        </AnimatedSection>

        {/* Categories */}
        <AnimatedSection className="mb-12" delay={0.3}>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? 'bg-accent-blue text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* FAQ List */}
        <AnimatedSection className="space-y-4 mb-16" delay={0.4}>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No questions found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-white/60 flex-shrink-0" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/10">
                        <p className="text-white/70 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatedSection>

        {/* Contact Support */}
        <AnimatedSection className="text-center" delay={0.6}>
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 lg:p-12">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InteractiveHoverButton
                variant="blue"
                text="Contact Support"
                icon={<MessageCircle size={16} />}
                onClick={() => navigate('/contact')}
                className="px-8 py-4"
              />
              <InteractiveHoverButton
                variant="white"
                text="Live Chat"
                onClick={() => navigate('/app/chat')}
                className="px-8 py-4"
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

export default FAQPage;