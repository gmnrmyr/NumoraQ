
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { useUnicornStudioAnimation } from '@/hooks/useUnicornStudioAnimation';
import { UnicornStudioAnimation } from './UnicornStudioAnimation';

export const DashboardAnimationLayer = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  
  // Check if user has CHAMPION+ role (level 70+ OR champion/legend titles)
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  
  // Check if user is Whales+ (10,000+ points)
  const isWhalesUser = userTitle.level >= 10000 || ['WHALE', 'LEGEND'].includes(userTitle.title);
  
  // Check themes
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  const isDarkDitherTheme = data.userProfile.theme === 'dark-dither';
  
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

  if (!blackHoleConfig.enabled && !darkDitherConfig.enabled) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Black Hole Animation */}
      {blackHoleConfig.enabled && (
        <div className="absolute inset-0 flex items-center justify-center">
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
        <div className="absolute inset-0 flex items-center justify-center">
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
    </div>
  );
};
