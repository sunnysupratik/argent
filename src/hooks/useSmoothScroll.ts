import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Simple smooth scroll behavior using CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
};