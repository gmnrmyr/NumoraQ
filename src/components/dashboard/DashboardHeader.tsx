
import React from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { DashboardIcons } from './DashboardIcons';
import { DashboardTitle } from './DashboardTitle';
import { DashboardAnimationLayer } from './DashboardAnimationLayer';
import { DashboardControls } from './DashboardControls';

export const DashboardHeader = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  
  // Check if user is Contributor+ (50+ points)
  const isContributor = userTitle.level >= 50;
  
  // Check themes
  const isDaTestTheme = data.userProfile.theme === 'da-test';

  return (
    <div className={`relative min-h-[400px] overflow-hidden ${isDaTestTheme ? 'dashboard-header' : ''}`}>
      {/* DA Test Theme Placeholder */}
      {isDaTestTheme && isContributor && (
        <div className="test-video-placeholder" />
      )}

      {/* Animation Layer */}
      <DashboardAnimationLayer />

      <div className="relative z-10">
        {/* Controls Layer */}
        <DashboardControls />

        <div className="text-center space-y-6 py-8 relative">
          {/* Content */}
          <DashboardIcons />
          
          <div className="relative">
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
    </div>
  );
};
