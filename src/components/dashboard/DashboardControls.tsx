
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { AnimationDebugPanel } from './AnimationDebugPanel';
import { useUnicornStudioAnimation } from '@/hooks/useUnicornStudioAnimation';

interface DashboardControlsProps {
  userTitle: any;
  isChampionUser: boolean;
  isWhalesUser: boolean;
  isContributor: boolean;
  currentTheme: string;
  isAnimationEnabled: boolean;
}

export const DashboardControls = ({
  userTitle,
  isChampionUser,
  isWhalesUser,
  isContributor,
  currentTheme,
  isAnimationEnabled
}: DashboardControlsProps) => {
  const isBlackHoleTheme = currentTheme === 'black-hole';
  const isDarkDitherTheme = currentTheme === 'dark-dither';
  const isDaTestTheme = currentTheme === 'da-test';
  const isLerasTheme = currentTheme === 'leras';

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

  // Show debug panel for any animation or theme
  const showDebugPanel = blackHoleConfig.enabled || darkDitherConfig.enabled || isDaTestTheme || isLerasTheme;

  return (
    <>
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

      {/* Theme Status - BOTTOM LEFT */}
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
            // DA_TEST_CONTRIBUTOR+
          </div>
        </div>
      )}

      {isLerasTheme && isWhalesUser && (
        <div className="absolute bottom-4 left-4 z-50">
          <div className="bg-black/90 border border-orange-400/50 px-3 py-2 font-mono text-xs text-orange-400 uppercase tracking-wider">
            // LERAS_WHALES+
          </div>
        </div>
      )}

      {/* Enhanced Debug Panel - Show for any special theme */}
      {showDebugPanel && (
        <AnimationDebugPanel
          animationType={blackHoleConfig.enabled ? 'black-hole' : darkDitherConfig.enabled ? 'dark-dither' : isDaTestTheme ? 'da-test' : 'leras'}
          projectId={activeConfig?.projectId || 'static-theme'}
          isReady={activeAnimation?.isReady || false}
          isLoaded={activeAnimation?.isLoaded || true}
          isPaused={activeAnimation?.isPaused || false}
          error={activeAnimation?.error || null}
          userTitle={userTitle.title}
          userLevel={userTitle.level}
          onTogglePause={activeAnimation?.togglePause || (() => {})}
          onRetry={activeAnimation?.retry || (() => {})}
          isChampionUser={isChampionUser}
          isWhalesUser={isWhalesUser}
          themeActive={isBlackHoleTheme || isDarkDitherTheme || isDaTestTheme || isLerasTheme}
          animationEnabled={isAnimationEnabled}
        />
      )}
    </>
  );
};
