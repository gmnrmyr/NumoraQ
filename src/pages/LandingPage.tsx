
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/index/HeroSection';
import { FeaturesGrid } from '@/components/index/FeaturesGrid';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Top Ad Banner */}
      <AdBanner position="top" className="max-w-7xl mx-auto pt-4 px-2 sm:px-4" />
      
      <HeroSection />
      
      {/* Inline Ad Banner */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <AdBanner position="inline" className="my-8" />
      </div>
      
      <FeaturesGrid />
      
      {/* Bottom Ad Banner */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <AdBanner position="bottom" className="my-8" />
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
