
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
  const [animationReady, setAnimationReady] = React.useState(false);
  
  // Check if user has CHAMPION+ role (level 70+ OR whale/legend titles)
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  
  // Check if user is Whales+ (10,000+ points)
  const isWhalesUser = userTitle.level >= 10000 || ['WHALE', 'LEGEND'].includes(userTitle.title);
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Check if Dark Dither theme is active
  const isDarkDitherTheme = data.userProfile.theme === 'dark-dither';
  
  // Should show Black Hole animation
  const shouldShowBlackHole = isChampionUser && isBlackHoleTheme && isAnimationEnabled;
  
  // Should show Dark Dither animation
  const shouldShowDarkDither = isWhalesUser && isDarkDitherTheme && isAnimationEnabled;

  React.useEffect(() => {
    if (!shouldShowBlackHole && !shouldShowDarkDither) return;

    // Clean up any existing scripts first
    const existingScripts = document.querySelectorAll('script[src*="unicornStudio"]');
    existingScripts.forEach(script => script.remove());

    console.log('🎬 Initializing UnicornStudio animations...');
    
    if (shouldShowBlackHole) {
      console.log('🕳️ BlackHole: Initializing for CHAMPION+ user:', userTitle.title, 'level:', userTitle.level);
    }
    
    if (shouldShowDarkDither) {
      console.log('🌊 DarkDither: Initializing for Whales+ user:', userTitle.title, 'level:', userTitle.level);
    }
    
    // Create and inject the UnicornStudio script with immediate initialization
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function() {
        if (!window.UnicornStudio) {
          window.UnicornStudio = { isInitialized: false };
          
          var script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
          
          script.onload = function() {
            if (!window.UnicornStudio.isInitialized) {
              try {
                UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
                console.log('🎬 UnicornStudio initialized successfully');
                
                // Trigger a custom event to notify components
                window.dispatchEvent(new CustomEvent('unicornStudioReady'));
              } catch (error) {
                console.error('🎬 UnicornStudio initialization failed:', error);
              }
            }
          };
          
          script.onerror = function() {
            console.error('🎬 Failed to load UnicornStudio script');
          };
          
          (document.head || document.body).appendChild(script);
        } else if (!window.UnicornStudio.isInitialized) {
          try {
            UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
            console.log('🎬 UnicornStudio re-initialized');
            window.dispatchEvent(new CustomEvent('unicornStudioReady'));
          } catch (error) {
            console.error('🎬 UnicornStudio re-initialization failed:', error);
          }
        } else {
          console.log('🎬 UnicornStudio already ready');
          window.dispatchEvent(new CustomEvent('unicornStudioReady'));
        }
      })();
    `;
    
    document.head.appendChild(script);

    // Listen for UnicornStudio ready event
    const handleUnicornReady = () => {
      console.log('🎬 UnicornStudio ready event received');
      setAnimationReady(true);
    };

    window.addEventListener('unicornStudioReady', handleUnicornReady);

    return () => {
      window.removeEventListener('unicornStudioReady', handleUnicornReady);
      // Don't remove scripts on cleanup to avoid re-initialization issues
    };
  }, [shouldShowBlackHole, shouldShowDarkDither, userTitle.title, userTitle.level]);

  const toggleAnimation = () => {
    setAnimationPaused(!animationPaused);
    console.log('🎬 Animation', animationPaused ? 'resumed' : 'paused');
  };

  return (
    <div className="relative min-h-[400px] overflow-hidden">
      <div className="relative z-10">
        {/* Animation Controls - TOP RIGHT when animation is active */}
        {(shouldShowBlackHole || shouldShowDarkDither) && animationReady && (
          <div className="absolute top-4 right-4 z-50">
            <Button 
              onClick={toggleAnimation}
              variant="outline" 
              size="sm" 
              className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative" 
              title={animationPaused ? 'Play Animation' : 'Pause Animation (Heavy GPU)'}
            >
              {animationPaused ? <Play size={16} /> : <Pause size={16} />}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {animationPaused ? 'Play Animation' : 'Pause Anim (Heavy GPU)'}
              </div>
            </Button>
          </div>
        )}

        {/* Theme Status - BOTTOM LEFT when animation is active */}
        {shouldShowBlackHole && animationReady && (
          <div className="absolute bottom-4 left-4 z-50">
            <div className="bg-black/90 border border-accent/50 px-3 py-2 font-mono text-xs text-accent uppercase tracking-wider">
              // BLACK_HOLE_CHAMPION+
            </div>
          </div>
        )}

        {shouldShowDarkDither && animationReady && (
          <div className="absolute bottom-4 left-4 z-50">
            <div className="bg-black/90 border border-purple-400/50 px-3 py-2 font-mono text-xs text-purple-400 uppercase tracking-wider">
              // DARK_DITHER_WHALES+
            </div>
          </div>
        )}

        <div className="text-center space-y-6 py-8 relative">
          {/* Content */}
          <DashboardIcons />
          
          <div className="relative">
            {/* Black Hole Animation - positioned behind the title */}
            {shouldShowBlackHole && animationReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div 
                  data-us-project="db3DaP9gWVnnnr7ZevK7" 
                  style={{ 
                    width: '400px', 
                    height: '400px',
                    opacity: animationPaused ? 0.3 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </div>
            )}

            {/* Dark Dither Animation - positioned behind the title */}
            {shouldShowDarkDither && animationReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div 
                  data-us-project="h49sb4lMLFG1hJLyIzdq" 
                  style={{ 
                    width: '100%', 
                    height: '400px',
                    maxWidth: '1440px',
                    opacity: animationPaused ? 0.3 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </div>
            )}
            
            {/* Title on top */}
            <div className="relative z-10">
              <DashboardTitle />
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-1 bg-accent"></div>
            <div className="w-4 h-4 border-2 border-accent"></div>
            <div className="w-8 h-1 bg-accent"></div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (shouldShowBlackHole || shouldShowDarkDither) && (
        <div className="fixed top-4 left-4 text-xs text-white bg-black/80 p-3 rounded z-50 border border-white/20">
          <div className="font-bold mb-1">🎬 Animation Debug</div>
          <div>User Title: {userTitle.title}</div>
          <div>User Level: {userTitle.level}</div>
          <div>Champion Check: {isChampionUser ? '✅' : '❌'}</div>
          <div>Whales+ Check: {isWhalesUser ? '✅' : '❌'}</div>
          <div>Black Hole Theme: {isBlackHoleTheme ? '✅' : '❌'}</div>
          <div>Dark Dither Theme: {isDarkDitherTheme ? '✅' : '❌'}</div>
          <div>Animation Enabled: {isAnimationEnabled ? '✅' : '❌'}</div>
          <div>Should Show BlackHole: {shouldShowBlackHole ? '✅' : '❌'}</div>
          <div>Should Show DarkDither: {shouldShowDarkDither ? '✅' : '❌'}</div>
          <div>Animation Ready: {animationReady ? '✅' : '❌'}</div>
          <div>Paused: {animationPaused ? '✅' : '❌'}</div>
          <div>UnicornStudio: {typeof window !== 'undefined' && window.UnicornStudio ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
};
