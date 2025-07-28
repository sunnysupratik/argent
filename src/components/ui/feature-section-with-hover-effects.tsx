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
      title: "AI Analyst - Your Financial Detective",
      description:
        "Your dedicated AI Analyst works 24/7 through intelligent chat conversations to analyze your financial data. It identifies spending patterns, discovers hidden savings opportunities, and provides personalized recommendations that can save you hundreds monthly. Chat naturally about your finances and get instant, actionable insights.",
      icon: <BarChart3 />,
    },
    {
      title: "AI Strategist - Video Financial Advisor",
      description:
        "Experience revolutionary video consultations with your AI Strategist powered by Tavus technology. Have face-to-face conversations about investment strategies, portfolio optimization, and financial planning. Your AI Strategist provides visual analysis, strategic guidance, and personalized investment recommendations through natural video interactions.",
      icon: <DollarSign />,
    },
    {
      title: "AI Voice Advisor - Hands-Free Assistant",
      description:
        "Talk naturally with your AI Voice Advisor powered by ElevenLabs technology. Get instant answers about account balances, spending insights, and financial guidance through voice commands. Perfect for busy lifestyles - manage your finances while driving, exercising, or multitasking with completely hands-free interactions.",
      icon: <PieChart />,
    },
    {
      title: "Collaborative AI Team Intelligence",
      description: "Your three AI agents work together seamlessly. The AI Analyst discovers insights, the AI Strategist develops strategies through video consultations, and the AI Voice Advisor provides daily guidance. They share context and learn from each interaction to provide increasingly personalized financial guidance.",
      icon: <Target />,
    },
    {
      title: "Bank-Level Security for AI Interactions",
      description: "All AI conversations are protected with bank-level 256-bit AES encryption. Your chat history with the AI Analyst, video sessions with the AI Strategist, and voice conversations with the AI Advisor are secured with zero-knowledge architecture. SOC 2 Type II compliant with multi-factor authentication.",
      icon: <Shield />,
    },
    {
      title: "Unified Financial Intelligence Hub",
      description: "Your AI team accesses data from 10,000+ connected financial institutions to provide comprehensive insights. Real-time synchronization ensures your AI agents always have current information for accurate analysis, strategic planning, and voice-guided assistance across all your accounts.",
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