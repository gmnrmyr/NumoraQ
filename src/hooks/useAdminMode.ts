
import { useState, useEffect } from 'react';
import { useCMSSettings } from './useCMSSettings';
import { usePremiumCodes } from './usePremiumCodes';
import { useSecureAdminAuth } from './useSecureAdminAuth';

export const useAdminMode = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdmin } = useSecureAdminAuth();
  
  // Use the new backend hooks
  const cmsSettings = useCMSSettings();
  const premiumCodes = usePremiumCodes();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isAdminMode: isAdmin, // Use secure admin status
    showAdminPanel,
    setShowAdminPanel,
    // CMS settings
    cmsSettings: cmsSettings.settings,
    updateCMSSetting: cmsSettings.updateSetting,
    updateMultipleCMSSettings: cmsSettings.updateMultipleSettings,
    // Premium codes
    premiumCodes: premiumCodes.codes,
    generatePremiumCode: premiumCodes.generateCode,
    activatePremiumCode: premiumCodes.activateCode,
    deletePremiumCode: premiumCodes.deleteCode,
    getCodeStats: premiumCodes.getCodeStats,
    premiumCodesLoading: premiumCodes.loading
  };
};
