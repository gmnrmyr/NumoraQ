import React, { useState, useRef, useEffect } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { useUnicornStudioAnimation } from '@/hooks/useUnicornStudioAnimation';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';
import { AnimationDebugPanel } from './AnimationDebugPanel';
import { UnicornStudioAnimation } from './UnicornStudioAnimation';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const [isTerminalAnimPaused, setIsTerminalAnimPaused] = useState(false);
  const [isDaTestAnimPaused, setIsDaTestAnimPaused] = useState(false);
  const terminalAnimRef = useRef<HTMLDivElement>(null);
  const daTestAnimRef = useRef<HTMLDivElement>(null);
  const daTestAnimationInitRef = useRef<boolean>(false);
  
  // Check if user has CHAMPION+ role (level 70+ OR champion/legend titles)
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  
  // Check if user is Whales+ (10,000+ points)
  const isWhalesUser = userTitle.level >= 10000 || ['WHALE', 'LEGEND'].includes(userTitle.title);
  
  // Check if user is Contributor+ (50+ points)
  const isContributor = userTitle.level >= 50;
  
  // Check themes
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  const isDarkDitherTheme = data.userProfile.theme === 'dark-dither';
  const isDaTestTheme = data.userProfile.theme === 'da-test';
  const isDaTerminalTheme = data.userProfile.theme === 'da-terminal' && isWhalesUser;

  // DA Test animation initialization (same as landing page)
  useEffect(() => {
    if (isDaTestTheme && isContributor && isAnimationEnabled) {
      const initializeDaTestAnimation = () => {
        if (!window.UnicornStudio) {
          window.UnicornStudio = {
            isInitialized: false,
            init: () => {}
          };
        }

        // Force reinitialize if already exists for DA Test
        if (window.UnicornStudio.isInitialized) {
          window.UnicornStudio.isInitialized = false;
        }
        
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
        script.onload = function () {
          if (!daTestAnimationInitRef.current) {
            try {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
              daTestAnimationInitRef.current = true;
              console.log('🎬 DA Test animation initialized successfully');
            } catch (error) {
              console.log('DA Test animation initialization skipped');
            }
          }
        };

        // Remove existing script if present
        const existingScript = document.querySelector('script[src*="unicornStudio"]');
        if (existingScript) {
          existingScript.remove();
        }
        (document.head || document.body).appendChild(script);
      };

      // Only initialize animation if user has enabled it
      const initTimer = setTimeout(initializeDaTestAnimation, 100);
      return () => {
        clearTimeout(initTimer);
      };
    }
  }, [isDaTestTheme, isContributor, isAnimationEnabled]);

  // Additional effect to handle DA Test animation state changes
  useEffect(() => {
    if (isDaTestTheme && isContributor && isAnimationEnabled && !daTestAnimationInitRef.current) {
      // Re-attempt initialization if animation is enabled but not initialized
      const retryTimer = setTimeout(() => {
        if (window.UnicornStudio && !daTestAnimationInitRef.current) {
          try {
            window.UnicornStudio.init();
            daTestAnimationInitRef.current = true;
            console.log('🎬 DA Test animation retry successful');
          } catch (error) {
            console.log('DA Test animation retry failed, but continuing');
          }
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [isDaTestTheme, isContributor, isAnimationEnabled]);

  // Animation configurations
  const blackHoleConfig = {
    projectId: 'db3DaP9gWVnnnr7ZevK7',
    width: '400px',
    height: '400px',
    enabled: isChampionUser && isBlackHoleTheme && isAnimationEnabled
  };

  const darkDitherConfig = {
    projectId: 'h49sb4lMLFG1hJLyIzdq',
    width: '100%',
    height: '400px',
    enabled: isWhalesUser && isDarkDitherTheme && isAnimationEnabled
  };

  // Animation hooks
  const blackHoleAnimation = useUnicornStudioAnimation(blackHoleConfig);
  const darkDitherAnimation = useUnicornStudioAnimation(darkDitherConfig);

  // Determine which animation is active
  const activeAnimation = blackHoleConfig.enabled ? blackHoleAnimation : 
                         darkDitherConfig.enabled ? darkDitherAnimation : null;
  
  const activeConfig = blackHoleConfig.enabled ? blackHoleConfig : 
                      darkDitherConfig.enabled ? darkDitherConfig : null;

  return (
    <div className={`relative min-h-[400px] overflow-hidden ${isDaTestTheme ? 'dashboard-header' : ''}`}>
      {/* DA Terminal Theme Animation */}
      {isDaTerminalTheme && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none animation-bg" style={{ opacity: 0.5 }}>
          <button
            className="play-pause"
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: 'rgba(0,255,0,0.5)',
              color: '#000',
              border: 'none',
              padding: 5,
              cursor: 'pointer',
              zIndex: 10,
              pointerEvents: 'auto'
            }}
            onClick={() => {
              setIsTerminalAnimPaused((prev) => {
                const paused = !prev;
                const el = terminalAnimRef.current?.querySelector('div[data-us-project]');
                if (el) {
                  (el as HTMLElement).style.animationPlayState = paused ? 'paused' : 'running';
                }
                return paused;
              });
            }}
            type="button"
          >
            {isTerminalAnimPaused ? 'Play' : 'Pause'}
          </button>
          <div
            ref={terminalAnimRef}
            style={{ width: '1440px', height: '900px', margin: '0 auto' }}
          >
            <div data-us-project="h49sb4lMLFG1hJLyIzdq" style={{ width: '1440px', height: '900px' }} />
          </div>
        </div>
      )}

      {/* DA Test Theme - Same Animation as Landing Page */}
      {isDaTestTheme && isContributor && isAnimationEnabled && (
        <div 
          ref={daTestAnimRef}
          className="absolute inset-0 -mx-8 -mt-8 overflow-hidden z-0" 
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 80%, rgba(var(--background)) 100%)',
            opacity: isDaTestAnimPaused ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          {/* Desktop Animation */}
          <div 
            data-us-project="PZSV1Zb8lHQjhdLRBsQN" 
            className="hidden lg:block w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
            style={{
              width: 'max(1440px, 120vw)',
              height: 'max(900px, 120vh)',
              transform: 'scale(1.1)',
              animationPlayState: isDaTestAnimPaused ? 'paused' : 'running'
            }} 
            key={`desktop-datest-${daTestAnimationInitRef.current}`}
          />
          
          {/* Mobile & Tablet Animation */}
          <div 
            data-us-project="Jmp7i20rUQsDyxKJ0OWM" 
            className="lg:hidden w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
            style={{
              width: 'max(768px, 120vw)',
              height: 'max(1024px, 120vh)',
              transform: 'scale(1.1)',
              animationPlayState: isDaTestAnimPaused ? 'paused' : 'running'
            }} 
            key={`mobile-datest-${daTestAnimationInitRef.current}`}
          />
          
          {/* DA Test Animation Controls */}
          <div className="absolute top-4 right-4 z-50">
            <Button 
              onClick={() => {
                setIsDaTestAnimPaused(prev => {
                  const newPaused = !prev;
                  // Also control the animation elements directly
                  setTimeout(() => {
                    const elements = daTestAnimRef.current?.querySelectorAll('div[data-us-project]');
                    elements?.forEach(el => {
                      (el as HTMLElement).style.animationPlayState = newPaused ? 'paused' : 'running';
                    });
                  }, 50);
                  return newPaused;
                });
              }}
              variant="outline" 
              size="sm" 
              className="bg-card/80 backdrop-blur-sm border-green-400/50 hover:bg-green-400/10 px-3 py-2 group relative" 
              title={isDaTestAnimPaused ? 'Play Animation' : 'Pause Animation (Heavy GPU)'}
            >
              {isDaTestAnimPaused ? <Play size={16} /> : <Pause size={16} />}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {isDaTestAnimPaused ? 'Play Landing Animation' : 'Pause Landing Anim (Heavy GPU)'}
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* DA Test Theme Fallback when animation disabled */}
      {isDaTestTheme && isContributor && !isAnimationEnabled && (
        <div className="test-video-placeholder" />
      )}

      {/* Animation Controls - TOP RIGHT when animation is active */}
      {activeAnimation && activeAnimation.isReady && (
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={activeAnimation.togglePause}
            variant="outline" 
            size="sm" 
            className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative" 
            title={activeAnimation.isPaused ? 'Play Animation' : 'Pause Animation (Heavy GPU)'}
          >
            {activeAnimation.isPaused ? <Play size={16} /> : <Pause size={16} />}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {activeAnimation.isPaused ? 'Play Animation' : 'Pause Anim (Heavy GPU)'}
            </div>
          </Button>
        </div>
      )}

      {/* Theme Status - BOTTOM LEFT when animation is active */}
      {blackHoleConfig.enabled && blackHoleAnimation.isReady && (
        <div className="absolute bottom-4 left-4 z-50">
          <div className="bg-black/90 border border-accent/50 px-3 py-2 font-mono text-xs text-accent uppercase tracking-wider">
            // BLACK_HOLE_CHAMPION+
          </div>
        </div>
      )}

      {darkDitherConfig.enabled && darkDitherAnimation.isReady && (
        <div className="absolute bottom-4 left-4 z-50">
          <div className="bg-black/90 border border-purple-400/50 px-3 py-2 font-mono text-xs text-purple-400 uppercase tracking-wider">
            // DARK_DITHER_WHALES+
          </div>
        </div>
      )}

      {isDaTestTheme && isContributor && (
        <div className="absolute bottom-4 left-4 z-50">
          <div className="bg-black/90 border border-green-400/50 px-3 py-2 font-mono text-xs text-green-400 uppercase tracking-wider">
            // DA_TEST_CONTRIBUTOR+ {isAnimationEnabled ? '(LANDING_ANIM)' : '(PLACEHOLDER)'}
          </div>
        </div>
      )}

      <div className="text-center space-y-6 py-8 relative">
        {/* Content */}
        <DashboardIcons />
        
        <div className="relative">
          {/* Black Hole Animation */}
          {blackHoleConfig.enabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <UnicornStudioAnimation
                projectId={blackHoleConfig.projectId}
                width={blackHoleConfig.width}
                height={blackHoleConfig.height}
                enabled={blackHoleConfig.enabled}
                isPaused={blackHoleAnimation.isPaused}
              />
            </div>
          )}

          {/* Dark Dither Animation */}
          {darkDitherConfig.enabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <UnicornStudioAnimation
                projectId={darkDitherConfig.projectId}
                width={darkDitherConfig.width}
                height={darkDitherConfig.height}
                enabled={darkDitherConfig.enabled}
                isPaused={darkDitherAnimation.isPaused}
                style={{ maxWidth: '1440px' }}
              />
            </div>
          )}
          
          {/* Title on top */}
          <div className="relative z-10">
            <DashboardTitle />
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-1 bg-accent"></div>
          <div className="w-4 h-4 border-2 border-accent"></div>
          <div className="w-8 h-1 bg-accent"></div>
        </div>
      </div>

      {/* Enhanced Debug Panel */}
      {(blackHoleConfig.enabled || darkDitherConfig.enabled) && (
        <AnimationDebugPanel
          animationType={blackHoleConfig.enabled ? 'black-hole' : 'dark-dither'}
          projectId={activeConfig?.projectId || ''}
          isReady={activeAnimation?.isReady || false}
          isLoaded={activeAnimation?.isLoaded || false}
          isPaused={activeAnimation?.isPaused || false}
          error={activeAnimation?.error || null}
          userTitle={userTitle.title}
          userLevel={userTitle.level}
          onTogglePause={activeAnimation?.togglePause || (() => {})}
          onRetry={activeAnimation?.retry || (() => {})}
          isChampionUser={isChampionUser}
          isWhalesUser={isWhalesUser}
          themeActive={isBlackHoleTheme || isDarkDitherTheme}
          animationEnabled={isAnimationEnabled}
        />
      )}
    </div>
  );
};
