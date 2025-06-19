
import { useState, useEffect } from 'react';
import { useCMSSettings } from './useCMSSettings';
import { usePremiumCodes } from './usePremiumCodes';

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
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

  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode');
    if (adminMode === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  const enterAdminMode = (password: string) => {
    if (password === 'admin123') {
      setIsAdminMode(true);
      setShowAdminPanel(false);
      localStorage.setItem('adminMode', 'true');
      return true;
    }
    return false;
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    localStorage.removeItem('adminMode');
  };

  return {
    isAdminMode,
    showAdminPanel,
    setShowAdminPanel,
    enterAdminMode,
    exitAdminMode,
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
