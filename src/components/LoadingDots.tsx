import React from 'react';
import { motion } from 'framer-motion';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 font-medium">AI Analyst is thinking</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingDots;