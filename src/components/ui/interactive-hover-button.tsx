import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: 'black' | 'white' | 'blue';
  icon?: React.ReactNode;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", variant = 'black', icon, className, ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return {
          base: "border-gray-300 bg-white text-gray-900",
          hover: "group-hover:bg-gray-100",
          dot: "bg-gray-200 group-hover:bg-gray-300"
        };
      case 'blue':
        return {
          base: "border-accent-blue bg-accent-blue text-white",
          hover: "group-hover:bg-accent-blue-hover",
          dot: "bg-blue-600 group-hover:bg-blue-700"
        };
      case 'black':
      default:
        return {
          base: "border-gray-800 bg-black text-white",
          hover: "group-hover:bg-gray-900",
          dot: "bg-gray-800 group-hover:bg-gray-900"
        };
    }
  };

  const styles = getVariantStyles();
  const displayIcon = icon || <ArrowRight size={16} />;

  return (
    <button
      ref={ref}
      className={cn(
        "group relative min-w-32 cursor-pointer overflow-hidden rounded-full border p-3 text-center font-semibold transition-all duration-300 hover:shadow-lg",
        styles.base,
        className,
      )}
      {...props}
    >
      {/* Animated background dot - positioned behind everything */}
      <div className={cn(
        "absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] z-0",
        styles.dot
      )}></div>
      
      {/* Text content - positioned above the dot */}
      <span className="relative z-10 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      
      {/* Hover state content - positioned above the dot */}
      <div className="absolute top-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        {displayIcon}
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };