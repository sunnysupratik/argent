import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      lerp: 0.1, // Dampened feel - low enough for smoothness, high enough for responsiveness
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);
};