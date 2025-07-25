import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Simple CSS-based smooth scrolling fallback
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
};