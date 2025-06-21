
import { FinancialData } from '../types';
import { defaultData } from '../initialState';

export const useDataMigration = () => {
  const loadInitialData = (): FinancialData => {
    const savedData = localStorage.getItem('financialData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Handle legacy data migration
        const migratedData: FinancialData = {
          userProfile: {
            name: parsedData.profileName || parsedData.userProfile?.name || "User",
            defaultCurrency: parsedData.userProfile?.defaultCurrency || 'BRL',
            language: parsedData.userProfile?.language || 'en',
            avatarIcon: parsedData.userProfile?.avatarIcon || undefined,
            liveDataEnabled: parsedData.userProfile?.liveDataEnabled || false,
            donorWallet: parsedData.userProfile?.donorWallet || undefined,
            totalDonated: parsedData.userProfile?.totalDonated || 0,
            theme: parsedData.userProfile?.theme || 'default'
          },
          projectionMonths: parsedData.projectionMonths || 12,
          exchangeRates: {
            ...defaultData.exchangeRates,
            ...(parsedData.exchangeRates || {}),
            lastUpdated: parsedData.exchangeRates?.lastUpdated || new Date().toISOString()
          },
          liquidAssets: Array.isArray(parsedData.liquidAssets) ? parsedData.liquidAssets : defaultData.liquidAssets,
          illiquidAssets: Array.isArray(parsedData.illiquidAssets) ? parsedData.illiquidAssets : defaultData.illiquidAssets,
          passiveIncome: Array.isArray(parsedData.passiveIncome) ? parsedData.passiveIncome : defaultData.passiveIncome,
          activeIncome: Array.isArray(parsedData.activeIncome) ? parsedData.activeIncome : defaultData.activeIncome,
          expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : defaultData.expenses,
          tasks: Array.isArray(parsedData.tasks) ? parsedData.tasks : defaultData.tasks,
          debts: Array.isArray(parsedData.debts) ? parsedData.debts : defaultData.debts,
          properties: Array.isArray(parsedData.properties) ? parsedData.properties : defaultData.properties,
          version: parsedData.version || '1.0.0',
          createdAt: parsedData.createdAt || new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        
        // Apply saved theme if exists
        if (migratedData.userProfile.theme) {
          const root = document.documentElement;
          root.classList.remove('theme-neon', 'theme-monochrome', 'theme-dual-tone', 'theme-high-contrast', 'theme-cyberpunk', 'theme-matrix', 'theme-gold');
          if (migratedData.userProfile.theme !== 'default') {
            root.classList.add(`theme-${migratedData.userProfile.theme}`);
          }
        }
        
        return migratedData;
      } catch (error) {
        console.error('Error parsing saved data, using defaults:', error);
        return defaultData;
      }
    }
    return defaultData;
  };

  return { loadInitialData };
};
