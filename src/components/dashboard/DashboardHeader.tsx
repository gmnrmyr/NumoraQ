
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';
import { DashboardAnimationLayer } from './DashboardAnimationLayer';
import { DashboardControls } from './DashboardControls';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  
  // Check user permissions
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  const isWhalesUser = userTitle.level >= 10000 || ['WHALE', 'LEGEND'].includes(userTitle.title);
  const isContributor = userTitle.level >= 50;
  
  // Theme checks
  const currentTheme = data.userProfile.theme;
  const isBlackHoleTheme = currentTheme === 'black-hole';
  const isDarkDitherTheme = currentTheme === 'dark-dither';
  const isDaTestTheme = currentTheme === 'da-test';
  const isLerasTheme = currentTheme === 'leras';

  return (
    <div className={`relative min-h-[400px] overflow-hidden ${isDaTestTheme ? 'dashboard-header' : ''}`}>
      {/* DA Test Theme Placeholder */}
      {isDaTestTheme && isContributor && (
        <div className="test-video-placeholder" />
      )}

      {/* Leras Theme Video */}
      {isLerasTheme && isWhalesUser && (
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images-cdn.exchange.art/h_LlokVSPPqR--EqohreR7-BMUYIhpjT1uvuNZQ8RKg?ext=fastly"
            alt="Leras Theme Background"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          />
        </div>
      )}

      {/* Animation Layer */}
      <DashboardAnimationLayer
        isChampionUser={isChampionUser}
        isWhalesUser={isWhalesUser}
        isBlackHoleTheme={isBlackHoleTheme}
        isDarkDitherTheme={isDarkDitherTheme}
        isAnimationEnabled={isAnimationEnabled}
      />

      {/* Controls Layer */}
      <DashboardControls
        userTitle={userTitle}
        isChampionUser={isChampionUser}
        isWhalesUser={isWhalesUser}
        isContributor={isContributor}
        currentTheme={currentTheme}
        isAnimationEnabled={isAnimationEnabled}
      />

      <div className="relative z-10">
        <div className="text-center space-y-6 py-8 relative">
          <DashboardIcons />
          
          <div className="relative z-10">
            <DashboardTitle />
          </div>
          
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-1 bg-accent"></div>
            <div className="w-4 h-4 border-2 border-accent"></div>
            <div className="w-8 h-1 bg-accent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
