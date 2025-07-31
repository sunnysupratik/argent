import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  Shield, 
  Zap, 
  Crown
} from 'lucide-react';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import AnimatedSection from '../components/AnimatedSection';
import MainNavBar from '../components/MainNavBar';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals getting started with personal finance",
      features: [
        "Connect up to 2 bank accounts",
        "Basic spending insights",
        "Transaction categorization",
        "Mobile-friendly interface",
        "Email support"
      ],
      popular: false,
      icon: Shield
    },
    {
      name: "Professional",
      price: "$9.99",
      period: "/month",
      description: "Advanced features for serious financial management",
      features: [
        "Connect unlimited bank accounts",
        "AI-powered insights and recommendations",
        "Advanced analytics and reporting",
        "Investment tracking",
        "Budget planning tools",
        "Priority email support",
        "Export data to CSV/PDF"
      ],
      popular: true,
      icon: Zap
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/month",
      description: "Enterprise-grade features for power users",
      features: [
        "Everything in Professional",
        "Custom AI agent training",
        "Advanced portfolio analysis",
        "Tax optimization insights",
        "Dedicated account manager",
        "Phone and video support",
        "API access",
        "White-label options"
      ],
      popular: false,
      icon: Crown
    }
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
      <MainNavBar />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Choose the plan that fits your financial goals. All plans include our core AI-powered insights and secure bank connections.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? 'border-accent-blue bg-gradient-to-br from-accent-blue/10 to-blue-600/5'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-blue text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-blue/20 flex items-center justify-center">
                      <Icon size={32} className="text-accent-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-white/70">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-white/70">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check size={20} className="text-accent-blue flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <InteractiveHoverButton
                    variant={plan.popular ? "blue" : "white"}
                    text={plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                    icon={<ArrowRight size={16} />}
                    onClick={() => navigate('/login')}
                    className="w-full"
                  />
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-white/20 bg-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="text-center mt-16 lg:mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to take control of your finances?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of users who trust Argent with their financial future.
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

export default PricingPage;