
import React from 'react';
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
      {/* DA Test Theme Placeholder */}
      {isDaTestTheme && isContributor && (
        <div className="test-video-placeholder" />
      )}

      <div className="relative z-10">
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
              // DA_TEST_CONTRIBUTOR+
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
          
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-1 bg-accent"></div>
            <div className="w-4 h-4 border-2 border-accent"></div>
            <div className="w-8 h-1 bg-accent"></div>
          </div>
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
