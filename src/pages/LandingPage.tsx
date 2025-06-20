
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { HeroSection } from '@/components/index/HeroSection';
import { FeaturesGrid } from '@/components/index/FeaturesGrid';
import { Footer } from '@/components/Footer';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { BarChart3, UserPlus, Eye, Rocket } from "lucide-react";

const LandingPage = () => {
  const { settings } = useProjectSettings();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-md border-b-2 border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-accent" size={28} />
              <span className="text-2xl font-display font-bold uppercase tracking-wide">
                {settings.project_name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button className="brutalist-button">
                  <UserPlus className="text-accent" size={20} />
                  <span className="hidden sm:inline ml-2">SIGN IN</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="brutalist-button">
                  <Eye className="text-blue-400" size={20} />
                  <span className="hidden sm:inline ml-2">BROWSE</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="brutalist-button">
                  <Rocket className="text-purple-400" size={20} />
                  <span className="hidden sm:inline ml-2">GET STARTED</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <HeroSection />
        <FeaturesGrid />
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
