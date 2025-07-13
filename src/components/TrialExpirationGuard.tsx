import React from 'react';

interface TrialExpirationGuardProps {
  children: React.ReactNode;
  showFullPageBlock?: boolean;
}

export const TrialExpirationGuard: React.FC<TrialExpirationGuardProps> = ({ 
  children, 
  showFullPageBlock = false 
}) => {
  // For now, just render children to fix the blank page issue
  // We'll add the trial logic back after confirming the app works
  return <>{children}</>;
};

// Hook to check if trial blocking should be applied
export const useTrialBlocking = () => {
  return {
    shouldBlockAccess: false,
    isInTrialPeriod: true,
    isTrialExpired: false,
    isPremiumUser: false
  };
}; 