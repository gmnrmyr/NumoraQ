
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/index/HeroSection';
import { FeaturesGrid } from '@/components/index/FeaturesGrid';
import { Footer } from '@/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <HeroSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default LandingPage;
