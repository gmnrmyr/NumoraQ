import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DashboardMode = 'advanced' | 'simple';

interface DashboardModeContextType {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
  isSimpleMode: boolean;
  isAdvancedMode: boolean;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export const useDashboardMode = () => {
  const context = useContext(DashboardModeContext);
  if (context === undefined) {
    throw new Error('useDashboardMode must be used within a DashboardModeProvider');
  }
  return context;
};

interface DashboardModeProviderProps {
  children: ReactNode;
}

export const DashboardModeProvider: React.FC<DashboardModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<DashboardMode>('advanced');

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('dashboardMode') as DashboardMode;
    if (savedMode && (savedMode === 'advanced' || savedMode === 'simple')) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: DashboardMode) => {
    setModeState(newMode);
    localStorage.setItem('dashboardMode', newMode);
  };

  const value: DashboardModeContextType = {
    mode,
    setMode,
    isSimpleMode: mode === 'simple',
    isAdvancedMode: mode === 'advanced',
  };

  return (
    <DashboardModeContext.Provider value={value}>
      {children}
    </DashboardModeContext.Provider>
  );
}; 