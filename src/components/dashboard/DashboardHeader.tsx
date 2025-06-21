
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const animationInitRef = React.useRef<boolean>(false);
  
  // Check if user has CHAMPION+ role (level 70+)
  const isChampionUser = userTitle.level >= 70;
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Should show animation
  const shouldShowAnimation = isChampionUser && isBlackHoleTheme && isAnimationEnabled;

  React.useEffect(() => {
    if (!shouldShowAnimation) return;

    console.log('🕳️ BlackHole: Starting initialization');
    
    // Reset animation state on each page load
    animationInitRef.current = false;
    if (!window.UnicornStudio) {
      window.UnicornStudio = {
        isInitialized: false,
        init: () => {}
      };
    }

    // Force reinitialize if already exists
    if (window.UnicornStudio.isInitialized) {
      window.UnicornStudio.isInitialized = false;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
    script.onload = function () {
      if (!animationInitRef.current) {
        try {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
          animationInitRef.current = true;
          console.log('🕳️ BlackHole: Animation initialized successfully');
        } catch (error) {
          console.log('🕳️ BlackHole: Animation initialization skipped');
        }
      }
    };

    // Remove existing script if present
    const existingScript = document.querySelector('script[src*="unicornStudio"]');
    if (existingScript) {
      existingScript.remove();
    }
    (document.head || document.body).appendChild(script);

    // Initialize animation with a small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      if (window.UnicornStudio && !animationInitRef.current) {
        try {
          window.UnicornStudio.init();
          animationInitRef.current = true;
        } catch (error) {
          console.log('🕳️ BlackHole: Animation retry failed, but continuing');
        }
      }
    }, 500);

    return () => clearTimeout(initTimer);
  }, [shouldShowAnimation]);

  return (
    <div className="relative min-h-[400px] overflow-hidden">
      <div className="relative z-10">
        <div className="text-center space-y-6 py-8 relative">
          {/* Black Hole Animation - positioned behind the text */}
          {shouldShowAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div 
                data-us-project="db3DaP9gWVnnnr7ZevK7" 
                style={{ 
                  width: '400px', 
                  height: '400px',
                  opacity: animationPaused ? 0.3 : 1,
                  transition: 'opacity 0.3s ease'
                }}
                key={`blackhole-${animationInitRef.current}`}
              />
            </div>
          )}
          
          {/* Content on top of animation */}
          <div className="relative z-10">
            <DashboardIcons />
            <DashboardTitle />
            
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <div className="w-4 h-4 border-2 border-accent"></div>
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Controls - only show when animation is active */}
      {shouldShowAnimation && (
        <div className="absolute top-4 right-4 z-20">
          <Button 
            onClick={() => setAnimationPaused(!animationPaused)} 
            variant="outline" 
            size="sm" 
            className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative pointer-events-auto" 
            title={animationPaused ? 'Play Animation' : 'Pause Animation (Heavy GPU)'}
          >
            {animationPaused ? <Play size={16} /> : <Pause size={16} />}
            {/* Tooltip on hover */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {animationPaused ? 'Play Animation' : 'Pause Anim (Heavy GPU)'}
            </div>
          </Button>
        </div>
      )}

      {/* Black Hole Theme Status Indicator - only show when animation is active */}
      {shouldShowAnimation && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="bg-black/90 border border-accent/50 px-3 py-2 font-mono text-xs text-accent uppercase tracking-wider">
            // BLACK_HOLE_THEME_ON
          </div>
        </div>
      )}

      {/* Debug Info - enhanced */}
      {process.env.NODE_ENV === 'development' && shouldShowAnimation && (
        <div className="fixed top-4 left-4 text-xs text-white bg-black/80 p-3 rounded z-50 border border-white/20 pointer-events-auto">
          <div className="font-bold mb-1">🕳️ BlackHole Debug</div>
          <div>Champion User: {isChampionUser ? '✅' : '❌'}</div>
          <div>Black Hole Theme: {isBlackHoleTheme ? '✅' : '❌'}</div>
          <div>Animation Enabled: {isAnimationEnabled ? '✅' : '❌'}</div>
          <div>Should Show: {shouldShowAnimation ? '✅' : '❌'}</div>
          <div>Init Ref: {animationInitRef.current ? '✅' : '❌'}</div>
          <div>Paused: {animationPaused ? '✅' : '❌'}</div>
          <div>UnicornStudio: {window.UnicornStudio ? '✅' : '❌'}</div>
          <div>US Initialized: {window.UnicornStudio?.isInitialized ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
};
