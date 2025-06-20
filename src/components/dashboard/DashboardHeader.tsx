
import React from 'react';
import { Skull, Bot, Zap, Play, Pause } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { UserTitleBadge } from './UserTitleBadge';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { Button } from '@/components/ui/button';

// Properly type the UnicornStudio global
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const [animationPaused, setAnimationPaused] = React.useState(false);
  
  // Check if user has CHAMPION role (2000+ donation points or level 80+)
  const isChampionUser = userTitle.level >= 80 || userTitle.title === 'CHAMPION';
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Load UnicornStudio animation for CHAMPION users with Black Hole theme
  React.useEffect(() => {
    if (isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused) {
      // Load UnicornStudio script if not already loaded
      if (!window.UnicornStudio) {
        window.UnicornStudio = { 
          isInitialized: false,
          init: () => {}
        };
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
        script.onload = function() {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
          }
        };
        (document.head || document.body).appendChild(script);
      } else if (!window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    }
  }, [isChampionUser, isBlackHoleTheme, isAnimationEnabled, animationPaused]);
  
  return (
    <div className="relative">
      {/* UnicornStudio Animation Background for CHAMPION users with Black Hole theme */}
      {isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            data-us-project="db3DaP9gWVnnnr7ZevK7" 
            style={{ 
              width: '150%', 
              height: '150%', 
              position: 'absolute', 
              top: '-25%', 
              left: '-25%',
              transform: 'scale(1.5)'
            }}
          />
        </div>
      )}
      
      <div className="text-center space-y-6 py-8 relative z-10">
        {/* Animation Controls for CHAMPION users with Black Hole theme */}
        {isChampionUser && isBlackHoleTheme && (
          <div className="absolute top-2 right-2 z-20">
            <Button
              onClick={() => setAnimationPaused(!animationPaused)}
              variant="outline"
              size="sm"
              className="brutalist-button bg-card/80 backdrop-blur-sm"
            >
              {animationPaused ? <Play size={16} /> : <Pause size={16} />}
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-4 py-[13px]">
          <div className="flex items-center gap-2">
            <div className="p-3 border-2 border-accent bg-background">
              <Skull className="text-accent" size={28} />
            </div>
            <div className="p-3 border-2 border-border bg-card">
              <Bot className="text-foreground" size={28} />
            </div>
            <div className="p-3 border-2 border-accent bg-background">
              <Zap className="text-accent" size={28} />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground brutalist-heading">
            FINANCIAL COMMAND CENTER
          </h1>
          {data.userProfile.name && (
            <div className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap">
              <span className="text-accent">Welcome back, {data.userProfile.name}</span>
              {isChampionUser && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded font-bold">
                  CHAMPION
                </span>
              )}
            </div>
          )}
          <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-wider px-4">
            COMPLETE OVERSIGHT // DATA DRIVEN DECISIONS
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-4">
          <div className="w-8 h-1 bg-accent"></div>
          <div className="w-4 h-4 border-2 border-accent"></div>
          <div className="w-8 h-1 bg-accent"></div>
        </div>
      </div>
    </div>
  );
};
