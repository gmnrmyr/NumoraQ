
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { HeroSection } from "@/components/index/HeroSection";
import { FeaturesGrid } from "@/components/index/FeaturesGrid";
import { useViewport } from "@/hooks/useViewport";
import { useAnimationToggle } from "@/hooks/useAnimationToggle";

// Unicorn Studio global interface
declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

const LandingPage = () => {
  const { isMobile, isTablet } = useViewport();
  const { animationEnabled, toggleAnimation } = useAnimationToggle();
  const [animationPage, setAnimationPage] = useState(false);

  useEffect(() => {
    // Initialize UnicornStudio for mobile/tablet users
    if ((isMobile || isTablet) && !window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js';
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }
  }, [isMobile, isTablet]);

  const handleAnimationToggle = () => {
    if (isMobile || isTablet) {
      if (!animationEnabled) {
        setAnimationPage(true);
      } else {
        setAnimationPage(false);
      }
    }
    toggleAnimation();
  };

  if (animationPage && (isMobile || isTablet)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Button
          onClick={() => setAnimationPage(false)}
          className="mb-4 brutalist-button"
        >
          ← Back to Main
        </Button>
        <div 
          data-us-project="Jmp7i20rUQsDyxKJ0OWM" 
          style={{ width: "100%", height: "80vh", maxWidth: "768px" }}
        />
        <script 
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();`
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animation Toggle for Mobile/Tablet */}
      {(isMobile || isTablet) && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleAnimationToggle}
            variant="outline"
            size="sm"
            className="brutalist-button bg-background/80 backdrop-blur-sm"
          >
            {animationEnabled ? <Pause size={16} /> : <Play size={16} />}
          </Button>
        </div>
      )}

      {/* Desktop Animation */}
      {!isMobile && !isTablet && (
        <div className="fixed inset-0 z-0">
          <div 
            data-us-project="uJaYo5fVeUB6kK8U7YGd" 
            style={{ width: "100vw", height: "100vh" }}
          />
          <script 
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();`
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesGrid />
      </div>
    </div>
  );
};

export default LandingPage;
