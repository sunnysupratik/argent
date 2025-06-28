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
      title: "Smart Analytics",
      description:
        "Advanced AI-powered insights to track your spending patterns and optimize your budget with precision.",
      icon: <BarChart3 />,
    },
    {
      title: "Investment Tracking",
      description:
        "Real-time portfolio monitoring with comprehensive performance analytics and market insights.",
      icon: <TrendingUp />,
    },
    {
      title: "Secure Banking",
      description:
        "Bank-level security with end-to-end encryption protecting all your sensitive financial data.",
      icon: <Shield />,
    },
    {
      title: "Budget Management",
      description: "Intelligent budgeting tools that help you save more and spend wisely with automated insights.",
      icon: <Target />,
    },
    {
      title: "Multi-Account Support",
      description: "Connect and manage all your bank accounts and credit cards seamlessly in one unified platform.",
      icon: <Wallet />,
    },
    {
      title: "Credit Monitoring",
      description:
        "Track your credit score and receive personalized recommendations for continuous improvement.",
      icon: <CreditCard />,
    },
    {
      title: "Financial Goals",
      description:
        "Set and track financial goals with AI-powered recommendations and detailed progress insights.",
      icon: <PieChart />,
    },
    {
      title: "Premium Support",
      description: "24/7 customer support with dedicated financial advisors available whenever you need assistance.",
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