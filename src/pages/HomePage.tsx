import React from 'react';
import { ShapeLandingHero } from '../components/ui/shape-landing-hero';
import { FeatureSectionWithHoverEffects } from '../components/ui/feature-section-with-hover-effects';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ShapeLandingHero />
      <FeatureSectionWithHoverEffects />
    </div>
  );
};

export default HomePage;