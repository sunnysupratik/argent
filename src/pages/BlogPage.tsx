import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Shield,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const categories = [
    { id: 'all', name: 'All Articles', count: 24 },
    { id: 'ai-agents', name: 'AI Agents', count: 12 },
    { id: 'investing', name: 'Investing', count: 6 },
    { id: 'budgeting', name: 'Budgeting', count: 6 },
    { id: 'credit', name: 'Credit & Debt', count: 3 },
    { id: 'planning', name: 'Financial Planning', count: 3 }
  ];

  const featuredArticle = {
    title: "The Complete Guide to AI-Powered Personal Finance in 2024",
    excerpt: "Discover how artificial intelligence is revolutionizing personal finance management and learn practical strategies to leverage AI tools for better financial decisions.",
    author: "Sarah Chen",
    date: "December 15, 2024",
    readTime: "12 min read",
    category: "AI & Finance",
    image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true
  };

  const articles = [
    {
      title: "5 Investment Strategies That Actually Work in 2024",
      excerpt: "Cut through the noise with proven investment strategies that have delivered consistent returns. Learn from real data and expert analysis.",
      author: "Marcus Rodriguez",
      date: "December 12, 2024",
      readTime: "8 min read",
      category: "investing",
      image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["stocks", "portfolio", "strategy"]
    },
    {
      title: "How to Build an Emergency Fund That Actually Grows",
      excerpt: "Traditional savings accounts aren't enough. Discover smart strategies to build and grow your emergency fund while maintaining liquidity.",
      author: "Emily Johnson",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "budgeting",
      image: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["savings", "emergency fund", "budgeting"]
    },
    {
      title: "Credit Score Myths Debunked: What Really Matters",
      excerpt: "Separate fact from fiction when it comes to credit scores. Learn what actually impacts your score and how to improve it effectively.",
      author: "David Park",
      date: "December 8, 2024",
      readTime: "7 min read",
      category: "credit",
      image: "https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["credit score", "debt management", "financial health"]
    },
    {
      title: "Retirement Planning for Millennials: It's Not Too Late",
      excerpt: "Despite common misconceptions, millennials can still build substantial retirement wealth. Here's your roadmap to financial independence.",
      author: "Lisa Thompson",
      date: "December 5, 2024",
      readTime: "10 min read",
      category: "planning",
      image: "https://images.pexels.com/photos/6801875/pexels-photo-6801875.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["retirement", "401k", "long-term planning"]
    },
    {
      title: "The Psychology of Money: Why We Make Bad Financial Decisions",
      excerpt: "Understanding the psychological factors behind financial decisions can help you make better choices and avoid common money mistakes.",
      author: "Dr. James Wilson",
      date: "December 3, 2024",
      readTime: "9 min read",
      category: "planning",
      image: "https://images.pexels.com/photos/6801876/pexels-photo-6801876.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["psychology", "behavior", "decision making"]
    },
    {
      title: "Cryptocurrency in Your Portfolio: A Balanced Approach",
      excerpt: "Learn how to thoughtfully incorporate cryptocurrency into your investment portfolio without taking unnecessary risks.",
      author: "Alex Kim",
      date: "November 30, 2024",
      readTime: "11 min read",
      category: "investing",
      image: "https://images.pexels.com/photos/6801877/pexels-photo-6801877.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["cryptocurrency", "portfolio", "risk management"]
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'investing': return TrendingUp;
      case 'budgeting': return DollarSign;
      case 'credit': return Shield;
      case 'planning': return Target;
      default: return BarChart3;
    }
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
              text="About" 
              onClick={() => navigate('/about')}
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
              Financial Education Hub
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Master Your
            <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            Expert insights, practical strategies, and actionable advice to help you make 
            smarter financial decisions and build lasting wealth.
          </p>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection className="mb-12" delay={0.2}>
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? 'bg-accent-blue text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Article */}
        <AnimatedSection className="mb-16" delay={0.3}>
          <motion.div
            className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center space-x-2 text-white/50 text-sm">
                    <Calendar size={14} />
                    <span>{featuredArticle.date}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{featuredArticle.author}</div>
                      <div className="text-white/50 text-sm flex items-center space-x-2">
                        <Clock size={12} />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <InteractiveHoverButton
                    variant="blue"
                    text="Read Article"
                    icon={<ArrowRight size={16} />}
                    className="px-6 py-3"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Articles Grid */}
        <AnimatedSection className="mb-16" delay={0.4}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-white/10 text-white/70 px-2 py-1 rounded-full text-xs">
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                    <div className="flex items-center space-x-1 text-white/50 text-xs">
                      <Calendar size={12} />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-white/5 text-white/60 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                        <User size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{article.author}</div>
                        <div className="text-white/50 text-xs flex items-center space-x-1">
                          <Clock size={10} />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <InteractiveHoverButton
                      variant="white"
                      text="Read"
                      icon={<ArrowRight size={14} />}
                      className="px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Newsletter Signup */}
        <AnimatedSection className="text-center" delay={0.6}>
          <div className="bg-gradient-to-r from-accent-blue/10 to-blue-600/10 backdrop-blur-xl rounded-3xl border border-accent-blue/20 p-8 lg:p-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Get weekly insights, market updates, and exclusive financial tips delivered 
              straight to your inbox. Join 25,000+ subscribers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-accent-blue transition-colors"
              />
              <InteractiveHoverButton
                variant="blue"
                text="Subscribe"
                icon={<ArrowRight size={16} />}
                className="px-6 py-3"
              />
            </div>
            
            <p className="text-white/40 text-sm mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
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

export default BlogPage;