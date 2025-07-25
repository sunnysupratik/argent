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
      title: "Simple Money Insights",
      description:
        "Easy-to-understand analysis of your spending that helps you find ways to save money and avoid overspending. No complex financial jargon - just clear, helpful advice.",
      icon: <BarChart3 />,
    },
    {
      title: "Debt Prevention & Management",
      description:
        "Tools to help you avoid debt traps, manage existing debt responsibly, and create realistic payment plans. Get alerts before you overspend and tips for staying within budget.",
      icon: <TrendingUp />,
    },
    {
      title: "100% Free & Secure",
      description:
        "Completely free to use with no hidden fees, premium tiers, or subscription costs. Your financial data is protected with bank-level security and never sold to third parties.",
      icon: <Shield />,
    },
    {
      title: "Simple Budgeting Tools",
      description: "Create budgets that actually work with your income. Set realistic goals, track essential expenses, and get helpful reminders to stay on track without overwhelming complexity.",
      icon: <Target />,
    },
    {
      title: "All Your Accounts in One Place",
      description: "Safely connect your bank accounts, credit cards, and other financial accounts to see everything in one simple dashboard. No more logging into multiple apps or websites.",
      icon: <Wallet />,
    },
    {
      title: "Build Better Credit",
      description:
        "Learn how to improve your credit score with simple, actionable steps. Understand what affects your credit and get personalized tips to build a stronger financial foundation.",
      icon: <CreditCard />,
    },
    {
      title: "Achieve Your Financial Goals",
      description:
        "Set realistic savings goals for things that matter to you - emergency funds, education, home ownership, or retirement. Track progress and get encouragement along the way.",
      icon: <PieChart />,
    },
    {
      title: "Free Support & Education",
      description: "Access free financial education resources, helpful guides, and support when you need it. Learn about money management, debt reduction, and building wealth at your own pace.",
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