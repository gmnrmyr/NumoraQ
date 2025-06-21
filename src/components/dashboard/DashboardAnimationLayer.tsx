
import React from 'react';
import { UnicornStudioAnimation } from './UnicornStudioAnimation';
import { useUnicornStudioAnimation } from '@/hooks/useUnicornStudioAnimation';

interface DashboardAnimationLayerProps {
  isChampionUser: boolean;
  isWhalesUser: boolean;
  isBlackHoleTheme: boolean;
  isDarkDitherTheme: boolean;
  isAnimationEnabled: boolean;
}

export const DashboardAnimationLayer = ({
  isChampionUser,
  isWhalesUser,
  isBlackHoleTheme,
  isDarkDitherTheme,
  isAnimationEnabled
}: DashboardAnimationLayerProps) => {
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

  return (
    <>
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
    </>
  );
};
