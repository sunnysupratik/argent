import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Shield,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Target,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Insights",
      description:
        "Go beyond simple charts. Let your dedicated AI Analyst sift through your spending patterns to find hidden savings, identify trends, and help you understand where your money truly goes. Our AI provides actionable recommendations that can save you hundreds of dollars monthly.",
      icon: <BarChart3 />,
    },
    {
      title: "Proactive Portfolio Monitoring",
      description:
        "This isn't just a list of your stocks. Your AI Strategist actively monitors your portfolio 24/7, providing real-time performance analytics, risk assessments, and contextual market insights. Get alerts for rebalancing opportunities and market changes that affect your investments.",
      icon: <TrendingUp />,
    },
    {
      title: "Fortified Security",
      description:
        "Bank-level, end-to-end 256-bit AES encryption protecting all your sensitive financial data. SOC 2 Type II compliant with multi-factor authentication and zero-knowledge architecture. This is the bedrock of our platform. Your trust and privacy are our foundation.",
      icon: <Shield />,
    },
    {
      title: "Intelligent Budgeting",
      description: "Forget spreadsheets. Create budgets that actually work for you. Your AI team analyzes your spending history to set realistic goals, automates expense tracking across all accounts, and provides intelligent alerts before you overspend. Achieve your savings goals 3x faster.",
      icon: <Target />,
    },
    {
      title: "The Unified HQ",
      description: "Securely connect all your banks, credit cards, and investment accounts from 10,000+ institutions into one seamless platform. Real-time synchronization ensures your data is always current. This is your Financial Headquarters—the single source of truth that empowers your AI team.",
      icon: <Wallet />,
    },
    {
      title: "Guided Credit Improvement",
      description:
        "Don't just watch your credit score, improve it. Your AI Analyst provides clear, personalized recommendations based on your specific credit profile. Get step-by-step guidance to optimize credit utilization, payment timing, and account management. Users typically see 50+ point improvements within 6 months.",
      icon: <CreditCard />,
    },
    {
      title: "AI-Driven Goal Planning",
      description:
        "Whether you're saving for a home, planning for retirement, or building an emergency fund, collaborate with your AI Strategist to build a clear, achievable path forward. Get personalized timelines, automatic progress tracking, scenario modeling, and motivational insights that keep you on track.",
      icon: <PieChart />,
    },
    {
      title: "Dedicated Human & AI Support",
      description: "You're never alone. Get 24/7 access to our expert human support team for technical assistance, plus your dedicated AI team for financial analysis and guidance anytime. Video consultations with AI Strategist, voice conversations with AI Advisor, and instant chat with AI Analyst.",
      icon: <DollarSign />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-6 lg:py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-8 lg:py-10 relative group/feature border-white/[0.08] transition-all duration-300",
        (index === 0 || index === 4) && "lg:border-l border-white/[0.08]",
        index < 4 && "lg:border-b border-white/[0.08]"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      )}
      
      {/* Icon Container */}
      <div className="mb-6 relative z-10 px-6 lg:px-10">
        <div className="w-12 h-12 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white/70 group-hover/feature:text-accent-blue group-hover/feature:bg-accent-blue/10 group-hover/feature:border-accent-blue/20 transition-all duration-300">
          {icon}
        </div>
      </div>
      
      {/* Title */}
      <div className="text-lg lg:text-xl font-bold mb-3 relative z-10 px-6 lg:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/[0.15] group-hover/feature:bg-accent-blue transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-300 inline-block text-white group-hover/feature:text-accent-blue font-semibold">
          {title}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-sm lg:text-base text-white/50 group-hover/feature:text-white/70 max-w-xs relative z-10 px-6 lg:px-10 leading-relaxed transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};