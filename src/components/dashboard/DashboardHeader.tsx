
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { useViewport } from '@/hooks/useViewport';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';
import { AnimationDebugPanel } from './AnimationDebugPanel';
import { UnicornStudioAnimation } from './UnicornStudioAnimation';
import { Button } from '@/components/ui/button';
import { Play, Pause, Monitor, Smartphone } from 'lucide-react';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled, toggleAnimation } = useAnimationToggle();
  const { isMobile, isTablet } = useViewport();
  
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
  
  // Enhanced animation configurations with responsive sizing
  const blackHoleConfig = {
    projectId: 'db3DaP9gWVnnnr7ZevK7',
    width: isMobile ? '100%' : isTablet ? '600px' : '800px',
    height: isMobile ? '300px' : isTablet ? '400px' : '500px',
    enabled: isChampionUser && isBlackHoleTheme && isAnimationEnabled
  };

  const darkDitherConfig = {
    projectId: 'h49sb4lMLFG1hJLyIzdq',
    width: '100%',
    height: isMobile ? '300px' : isTablet ? '350px' : '400px',
    enabled: isWhalesUser && isDarkDitherTheme && isAnimationEnabled
  };

  // Determine active animation for controls
  const hasActiveAnimation = blackHoleConfig.enabled || darkDitherConfig.enabled;

  return (
    <div className={`relative min-h-[300px] sm:min-h-[400px] overflow-hidden ${isDaTestTheme ? 'dashboard-header' : ''}`}>
      {/* Black Hole Animation - Fixed at top center background */}
      {blackHoleConfig.enabled && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-0" style={{ marginTop: '80px' }}>
          <UnicornStudioAnimation
            projectId={blackHoleConfig.projectId}
            width={blackHoleConfig.width}
            height={blackHoleConfig.height}
            enabled={blackHoleConfig.enabled}
            responsive={true}
            className="w-full h-full"
          />
        </div>
      )}

      {/* DA Test Theme Placeholder - Enhanced for mobile */}
      {isDaTestTheme && isContributor && (
        <div className="test-video-placeholder">
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-black/90 border border-green-400/50 px-2 sm:px-3 py-1 sm:py-2 font-mono text-xs text-green-400 uppercase tracking-wider text-center sm:text-left">
              // DA_TEST_CONTRIBUTOR+ {isMobile && <Smartphone className="inline w-3 h-3 ml-1" />}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Enhanced Animation Controls - Responsive positioning */}
        {hasActiveAnimation && isAnimationEnabled && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 flex gap-2">
            <Button 
              onClick={toggleAnimation}
              variant="outline" 
              size="sm" 
              className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-2 sm:px-3 py-2 group relative" 
              title={isAnimationEnabled ? 'Disable Animation' : 'Enable Animation'}
            >
              {isAnimationEnabled ? <Pause size={14} /> : <Play size={14} />}
              {isMobile ? (
                <Smartphone size={12} className="ml-1" />
              ) : (
                <Monitor size={12} className="ml-1" />
              )}
              
              {/* Enhanced tooltip for mobile */}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                {isAnimationEnabled ? 'Disable Animation' : 'Enable Animation'} 
                {isMobile && ' (Mobile)'}
              </div>
            </Button>
          </div>
        )}

        {/* Enhanced Theme Status - Mobile optimized */}
        {blackHoleConfig.enabled && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-50">
            <div className="bg-black/90 border border-accent/50 px-2 sm:px-3 py-1 sm:py-2 font-mono text-xs text-accent uppercase tracking-wider">
              // BLACK_HOLE_CHAMPION+ {isMobile && <Smartphone className="inline w-3 h-3 ml-1" />}
            </div>
          </div>
        )}

        {darkDitherConfig.enabled && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-50">
            <div className="bg-black/90 border border-purple-400/50 px-2 sm:px-3 py-1 sm:py-2 font-mono text-xs text-purple-400 uppercase tracking-wider">
              // DARK_DITHER_WHALES+ {isMobile && <Smartphone className="inline w-3 h-3 ml-1" />}
            </div>
          </div>
        )}

        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 px-2 relative">
          {/* Content with responsive spacing */}
          <DashboardIcons />
          
          <div className="relative">
            {/* Dark Dither Animation - Enhanced for mobile */}
            {darkDitherConfig.enabled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <UnicornStudioAnimation
                  projectId={darkDitherConfig.projectId}
                  width={darkDitherConfig.width}
                  height={darkDitherConfig.height}
                  enabled={darkDitherConfig.enabled}
                  responsive={true}
                  className="w-full h-full"
                  style={{ maxWidth: '1440px' }}
                />
              </div>
            )}
            
            {/* Title on top with mobile optimization */}
            <div className="relative z-10">
              <DashboardTitle />
            </div>
          </div>
          
          {/* Enhanced decorative elements - responsive */}
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            <div className="w-4 sm:w-8 h-1 bg-accent"></div>
            <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-accent"></div>
            <div className="w-4 sm:w-8 h-1 bg-accent"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Debug Panel - mobile friendly */}
      {hasActiveAnimation && (
        <AnimationDebugPanel
          animationType={blackHoleConfig.enabled ? 'black-hole' : 'dark-dither'}
          projectId={blackHoleConfig.enabled ? blackHoleConfig.projectId : darkDitherConfig.projectId}
          isReady={true}
          isLoaded={true}
          isPaused={false}
          error={null}
          userTitle={userTitle.title}
          userLevel={userTitle.level}
          onTogglePause={() => {}}
          onRetry={() => {}}
          isChampionUser={isChampionUser}
          isWhalesUser={isWhalesUser}
          themeActive={isBlackHoleTheme || isDarkDitherTheme}
          animationEnabled={isAnimationEnabled}
        />
      )}
    </div>
  );
};
