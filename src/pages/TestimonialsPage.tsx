import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Quote, TrendingUp, DollarSign, Target } from 'lucide-react';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import MainNavBar from '../components/MainNavBar';
import AnimatedSection from '../components/AnimatedSection';

const TestimonialsPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Startup",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "The AI Analyst found $400 in monthly savings I completely missed. But what really impressed me was the video consultation with the AI Strategist - it felt like talking to a real financial advisor who knew my entire financial history.",
      results: {
        savings: "$4,800",
        period: "annually",
        improvement: "Plus AI Strategist video guidance"
      }
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "Fortune 500",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "During my morning jog, I asked the AI Voice Advisor about my portfolio performance. It instantly told me about a rebalancing opportunity that saved me $12,000 in potential losses. The voice interface is incredibly natural.",
      results: {
        savings: "$12,000",
        period: "in avoided losses",
        improvement: "Voice-guided portfolio optimization"
      }
    },
    {
      name: "Emily Johnson",
      role: "Small Business Owner",
      company: "Local Bakery",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "The AI Strategist's video consultations helped me separate my business and personal finances properly. Having face-to-face conversations with an AI that understands my specific situation is revolutionary.",
      results: {
        savings: "$8,500",
        period: "in tax optimization",
        improvement: "AI Strategist business guidance"
      }
    },
    {
      name: "David Park",
      role: "Recent Graduate",
      company: "Entry Level",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "As someone new to personal finance, Argent's educational insights and gentle guidance helped me build healthy money habits from day one. I'm already saving 25% of my income!",
      results: {
        savings: "$3,600",
        period: "in first year",
        improvement: "Built emergency fund in 8 months"
      }
    },
    {
      name: "Lisa Thompson",
      role: "Retired Teacher",
      company: "Retiree",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "Retirement planning felt impossible until Argent showed me exactly where my money was going and how to optimize my fixed income. The peace of mind is invaluable.",
      results: {
        savings: "$2,400",
        period: "monthly optimization",
        improvement: "Extended retirement funds by 5 years"
      }
    },
    {
      name: "James Wilson",
      role: "Investment Banker",
      company: "Wall Street Firm",
      image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 5,
      quote: "Even as a finance professional, Argent's AI caught patterns in my spending I missed. The advanced analytics rival tools we use at work, but for personal finance.",
      results: {
        savings: "$15,000",
        period: "through optimization",
        improvement: "Automated 90% of financial tasks"
      }
    }
  ];

  const caseStudies = [
    {
      title: "Young Professional Saves $50K in 2 Years",
      subtitle: "How AI-powered insights transformed a recent graduate's financial future",
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
      results: [
        "Increased savings rate from 5% to 35%",
        "Built 6-month emergency fund",
        "Started investing with $25K portfolio",
        "Improved credit score by 120 points"
      ],
      timeframe: "24 months"
    },
    {
      title: "Family Eliminates $80K Debt",
      subtitle: "Strategic debt consolidation and budgeting leads to financial freedom",
      image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
      results: [
        "Consolidated high-interest debt",
        "Reduced monthly payments by 40%",
        "Saved $18K in interest payments",
        "Achieved debt-free status in 3 years"
      ],
      timeframe: "36 months"
    },
    {
      title: "Entrepreneur Optimizes Business Finances",
      subtitle: "Small business owner streamlines personal and business financial management",
      image: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800",
      results: [
        "Separated personal and business finances",
        "Identified $30K in tax deductions",
        "Improved cash flow management",
        "Scaled business revenue by 150%"
      ],
      timeframe: "18 months"
    }
  ];

  const stats = [
    {
      number: "50,000+",
      label: "Active Users",
      icon: TrendingUp
    },
    {
      number: "$2.3B",
      label: "Assets Under Management",
      icon: DollarSign
    },
    {
      number: "98%",
      label: "Customer Satisfaction",
      icon: Star
    },
    {
      number: "4.9/5",
      label: "App Store Rating",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      <MainNavBar />

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
              Customer Success Stories
            </span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Real Results from
            <span className="block bg-gradient-to-r from-accent-blue to-blue-600 bg-clip-text text-transparent">
              Real People
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            Discover how thousands of users have transformed their financial lives with Argent's 
            AI-powered insights and precision-engineered tools.
          </p>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="mb-16" delay={0.2}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-accent-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <AnimatedSection className="mb-16" delay={0.4}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-white/70 text-lg">
              Hear directly from people who've transformed their financial lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                    <p className="text-white/60">{testimonial.role}</p>
                    <p className="text-white/40 text-sm">{testimonial.company}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative mb-6">
                  <Quote size={24} className="text-accent-blue/30 absolute -top-2 -left-2" />
                  <p className="text-white/80 italic leading-relaxed pl-6">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {testimonial.results.savings}
                    </div>
                    <div className="text-green-300 text-sm mb-2">
                      {testimonial.results.period}
                    </div>
                    <div className="text-white/60 text-xs">
                      {testimonial.results.improvement}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Case Studies */}
        <AnimatedSection className="mb-16" delay={0.6}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Success Case Studies
            </h2>
            <p className="text-white/70 text-lg">
              Deep dives into transformational financial journeys
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2">{study.title}</h4>
                  <p className="text-white/60 text-sm mb-4">{study.subtitle}</p>
                  
                  <div className="space-y-2 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                        <span className="text-white/80 text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-accent-blue font-bold">{study.timeframe}</div>
                    <div className="text-white/40 text-xs">Timeline</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="text-center" delay={0.8}>
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 lg:p-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their financial lives. 
              Start your journey today with a free trial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InteractiveHoverButton
                variant="blue"
                text="Start Free Trial"
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-lg"
              />
              <InteractiveHoverButton
                variant="white"
                text="View Pricing"
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 text-lg"
              />
            </div>
          </div>
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

export default TestimonialsPage;