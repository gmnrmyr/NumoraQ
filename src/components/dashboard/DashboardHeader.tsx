
import React from 'react';
import { Skull, Bot, Zap, Pause, Play } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { UserTitleBadge } from './UserTitleBadge';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const [animationPaused, setAnimationPaused] = React.useState(false);
  
  // Check if user has CHAMPION role (2000+ donation points or level 80+) AND black hole theme
  const isChampionUser = userTitle.level >= 80 || userTitle.title === 'CHAMPION';
  const currentTheme = data.userProfile.theme || 'monochrome';
  const showBlackHoleAnimation = isChampionUser && currentTheme === 'black-hole' && isAnimationEnabled && !animationPaused;
  
  console.log('DashboardHeader - isChampionUser:', isChampionUser);
  console.log('DashboardHeader - currentTheme:', currentTheme);
  console.log('DashboardHeader - isAnimationEnabled:', isAnimationEnabled);
  console.log('DashboardHeader - showBlackHoleAnimation:', showBlackHoleAnimation);
  console.log('DashboardHeader - userTitle:', userTitle);
  
  // Load UnicornStudio animation for CHAMPION users with black hole theme
  React.useEffect(() => {
    if (showBlackHoleAnimation) {
      console.log('Loading UnicornStudio animation...');
      // Load UnicornStudio script if not already loaded
      if (!window.UnicornStudio) {
        window.UnicornStudio = { 
          isInitialized: false,
          init: () => {
            console.log('UnicornStudio initialized');
          }
        };
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
        script.onload = function() {
          console.log('UnicornStudio script loaded');
          if (!window.UnicornStudio.isInitialized && typeof UnicornStudio !== 'undefined') {
            UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
            console.log('UnicornStudio initialized after script load');
          }
        };
        (document.head || document.body).appendChild(script);
      } else if (!window.UnicornStudio.isInitialized && typeof UnicornStudio !== 'undefined') {
        UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
        console.log('UnicornStudio re-initialized');
      }
    }
  }, [showBlackHoleAnimation]);
  
  return (
    <div className="relative">
      {/* UnicornStudio Animation Background for CHAMPION users with black hole theme */}
      {showBlackHoleAnimation && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
          <div 
            data-us-project="db3DaP9gWVnnnr7ZevK7" 
            style={{ 
              width: '200%', 
              height: '200%', 
              position: 'absolute', 
              top: '-50%', 
              left: '-50%',
              transform: 'scale(1.8)',
              transformOrigin: 'center center'
            }}
          />
        </div>
      )}
      
      <div className="text-center space-y-6 py-8 relative z-10">
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
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground brutalist-heading">
              FINANCIAL COMMAND CENTER
            </h1>
            {/* Animation Control Button for Black Hole theme */}
            {isChampionUser && currentTheme === 'black-hole' && isAnimationEnabled && (
              <button
                onClick={() => setAnimationPaused(!animationPaused)}
                className="p-2 border-2 border-accent bg-background hover:bg-accent hover:text-background transition-colors"
                title={animationPaused ? "Resume Animation" : "Pause Animation"}
              >
                {animationPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            )}
          </div>
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
