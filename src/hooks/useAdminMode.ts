
import { useState, useEffect } from 'react';

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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

  const enterAdminMode = (password: string) => {
    // Simple password check - in production this should be more secure
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

  const generateDegenCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `DEGEN-${code}`;
  };

  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode');
    if (adminMode === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  return {
    isAdminMode,
    showAdminPanel,
    setShowAdminPanel,
    enterAdminMode,
    exitAdminMode,
    generateDegenCode
  };
};
