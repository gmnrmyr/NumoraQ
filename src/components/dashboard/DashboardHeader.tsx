
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { BlackHoleAnimation } from './BlackHoleAnimation';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  
  // Check if user has CHAMPION role (level 50+)
  const isChampionUser = userTitle.level >= 50;
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Should show animation
  const shouldShowAnimation = isChampionUser && isBlackHoleTheme && isAnimationEnabled;
  
  return (
    <>
      {/* Black Hole Animation */}
      <BlackHoleAnimation isVisible={shouldShowAnimation} />
      
      <div className="relative">
        <div className="text-center space-y-6 py-8 relative z-10">
          <DashboardIcons />
          <DashboardTitle />
          
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-1 bg-accent"></div>
            <div className="w-4 h-4 border-2 border-accent"></div>
            <div className="w-8 h-1 bg-accent"></div>
          </div>
        </div>
      </div>
    </>
  );
};
