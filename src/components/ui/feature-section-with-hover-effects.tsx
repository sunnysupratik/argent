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
      title: "Free Financial Guidance",
      description:
        "Get personalized advice on budgeting, saving, and building financial stability. Our AI understands the challenges of limited income and provides practical, actionable guidance at no cost.",
      icon: <BarChart3 />,
    },
    {
      title: "Assistance Program Finder",
      description:
        "Discover government assistance programs, food banks, utility assistance, and other resources in your area. We help connect you with support programs you may qualify for.",
      icon: <TrendingUp />,
    },
    {
      title: "Privacy & Security",
      description:
        "Your financial information is completely private and secure. We never share your data, and our platform is designed to protect vulnerable users from financial exploitation.",
      icon: <Shield />,
    },
    {
      title: "Accessible Budgeting",
      description: "Simple, easy-to-use budgeting tools designed for people with varying abilities and income levels. Set realistic goals and track progress with clear, visual feedback.",
      icon: <Target />,
    },
    {
      title: "Emergency Fund Builder",
      description: "Start building financial security with any amount. Our tools help you save even $1 at a time and celebrate every milestone on your journey to financial independence.",
      icon: <Wallet />,
    },
    {
      title: "Credit Building Support",
      description:
        "Learn how to build or repair your credit with free, step-by-step guidance. Understand your rights, dispute errors, and access credit-building tools designed for people with limited credit history.",
      icon: <CreditCard />,
    },
    {
      title: "Achievable Goal Setting",
      description:
        "Set realistic financial goals based on your income and circumstances. Whether it's saving $100 for emergencies or planning for education, we help you create achievable milestones.",
      icon: <PieChart />,
    },
    {
      title: "Community & Support",
      description: "Access to financial counselors, peer support groups, and educational resources. Connect with others on similar journeys and get help from trained professionals who understand your challenges.",
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