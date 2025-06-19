import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCloudSync } from './financial-data/hooks/useCloudSync';
import {
  FinancialData,
  FinancialDataContextType,
  LiquidAsset,
  IlliquidAsset,
  PassiveIncomeItem,
  ActiveIncomeItem,
  ExpenseItem,
  TaskItem,
  DebtItem,
  PropertyItem,
} from './financial-data/types';
import { defaultData } from './financial-data/initialState';

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(() => {
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
  });

  const { user } = useAuth();
  const { syncState, lastSync, loadFromCloud, saveToCloud } = useCloudSync(data, setData, importFromJSON, user);

  useEffect(() => {
    const dataToSave = {
      ...data,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('financialData', JSON.stringify(dataToSave));
  }, [data]);
  
  useEffect(() => {
    if (user) {
      loadFromCloud(true);
    }
  }, [user]);

  const updateUserProfile = (updates: Partial<FinancialData['userProfile']>) => {
    setData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...updates
      }
    }));
  };

  const updateProjectionMonths = (months: number) => {
    setData(prev => ({
      ...prev,
      projectionMonths: months
    }));
  };

  const updateExchangeRate = (key: keyof FinancialData['exchangeRates'], value: number) => {
    setData(prev => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [key]: value,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  // Legacy support
  const updateProfileName = (name: string) => {
    updateUserProfile({ name });
  };

  const updateLiquidAsset = (id: string, updates: Partial<LiquidAsset>) => {
    setData(prev => ({
      ...prev,
      liquidAssets: prev.liquidAssets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    }));
  };

  const updateIlliquidAsset = (id: string, updates: Partial<IlliquidAsset>) => {
    setData(prev => ({
      ...prev,
      illiquidAssets: prev.illiquidAssets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    }));
  };

  const updatePassiveIncome = (id: string, updates: Partial<PassiveIncomeItem>) => {
    setData(prev => ({
      ...prev,
      passiveIncome: prev.passiveIncome.map(income => 
        income.id === id ? { ...income, ...updates } : income
      )
    }));
  };

  const updateActiveIncome = (id: string, updates: Partial<ActiveIncomeItem>) => {
    setData(prev => ({
      ...prev,
      activeIncome: prev.activeIncome.map(income => 
        income.id === id ? { ...income, ...updates } : income
      )
    }));
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      )
    }));
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  };

  const updateDebt = (id: string, updates: Partial<DebtItem>) => {
    setData(prev => ({
      ...prev,
      debts: prev.debts.map(debt => 
        debt.id === id ? { ...debt, ...updates } : debt
      )
    }));
  };

  const updateProperty = (id: string, updates: Partial<PropertyItem>) => {
    setData(prev => ({
      ...prev,
      properties: prev.properties.map(property => 
        property.id === id ? { ...property, ...updates } : property
      )
    }));
  };

  const addLiquidAsset = (asset: Omit<LiquidAsset, 'id'>) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      liquidAssets: [...prev.liquidAssets, newAsset]
    }));
  };

  const addIlliquidAsset = (asset: Omit<IlliquidAsset, 'id'>) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      illiquidAssets: [...prev.illiquidAssets, newAsset]
    }));
  };

  const addPassiveIncome = (income: Omit<PassiveIncomeItem, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      passiveIncome: [...prev.passiveIncome, newIncome]
    }));
  };

  const addActiveIncome = (income: Omit<ActiveIncomeItem, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      activeIncome: [...prev.activeIncome, newIncome]
    }));
  };

  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const addDebt = (debt: Omit<DebtItem, 'id'>) => {
    const newDebt = { ...debt, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      debts: [...prev.debts, newDebt]
    }));
  };

  const addProperty = (property: Omit<PropertyItem, 'id'>) => {
    const newProperty = { ...property, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
  };

  const removeLiquidAsset = (id: string) => {
    setData(prev => ({
      ...prev,
      liquidAssets: prev.liquidAssets.filter(asset => asset.id !== id)
    }));
  };

  const removeIlliquidAsset = (id: string) => {
    setData(prev => ({
      ...prev,
      illiquidAssets: prev.illiquidAssets.filter(asset => asset.id !== id)
    }));
  };

  const removePassiveIncome = (id: string) => {
    setData(prev => ({
      ...prev,
      passiveIncome: prev.passiveIncome.filter(income => income.id !== id)
    }));
  };

  const removeActiveIncome = (id: string) => {
    setData(prev => ({
      ...prev,
      activeIncome: prev.activeIncome.filter(income => income.id !== id)
    }));
  };

  const removeExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  const removeTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  };

  // New function to remove all completed tasks
  const removeCompletedTasks = () => {
    setData(prev => {
      const activeTasks = prev.tasks.filter(task => !task.completed);
      const removedCount = prev.tasks.length - activeTasks.length;
      if (removedCount > 0) {
        toast({
          title: "Completed tasks removed",
          description: `${removedCount} task(s) deleted.`
        });
      } else {
        toast({
          title: "No completed tasks",
          description: "There were no completed tasks to remove."
        });
      }
      return {
        ...prev,
        tasks: activeTasks
      };
    });
  };

  const removeDebt = (id: string) => {
    setData(prev => ({
      ...prev,
      debts: prev.debts.filter(debt => debt.id !== id)
    }));
  };

  const removeProperty = (id: string) => {
    setData(prev => ({
      ...prev,
      properties: prev.properties.filter(property => property.id !== id)
    }));
  };

  const exportToCSV = () => {
    const csvData = [
      ['Section', 'Item', 'Value', 'Status', 'Category'],
      ...data.liquidAssets.map(asset => ['Liquid Assets', asset.name, asset.value.toString(), 'Active', 'Asset']),
      ...data.illiquidAssets.map(asset => ['Illiquid Assets', asset.name, asset.value.toString(), 'Active', 'Asset']),
      ...data.passiveIncome.map(income => ['Passive Income', income.source, income.amount.toString(), income.status, 'Income']),
      ...data.activeIncome.map(income => ['Active Income', income.source, income.amount.toString(), income.status, 'Income']),
      ...data.expenses.map(expense => ['Expenses', expense.name, expense.amount.toString(), expense.status, expense.category]),
      ...data.debts.map(debt => ['Debts', debt.creditor, debt.amount.toString(), debt.status, 'Debt']),
      ...data.properties.map(property => ['Properties', property.name, property.value.toString(), property.status, 'Real Estate'])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-dashboard-${data.userProfile.name.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  function importFromJSON(jsonData: string): boolean {
    try {      
      const parsedData = JSON.parse(jsonData);
      
      if (typeof parsedData !== 'object' || parsedData === null) {
        console.error('Invalid data structure - not an object');
        throw new Error('Invalid data structure');
      }
      
      const validatedData: FinancialData = {
        userProfile: {
          name: parsedData.userProfile?.name || parsedData.profileName || "User",
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
      
      setData(validatedData);
      return true;
    } catch (error) {
      console.error('Error importing JSON data:', error);
      return false;
    }
  }

  const resetData = () => {
    setData(defaultData);
    console.log('Data reset to default values');
  };

  const contextValue = {
    data,
    updateUserProfile,
    updateProjectionMonths,
    updateExchangeRate,
    updateLiquidAsset,
    updateIlliquidAsset,
    updatePassiveIncome,
    updateActiveIncome,
    updateExpense,
    updateTask,
    updateDebt,
    updateProperty,
    addLiquidAsset,
    addIlliquidAsset,
    addPassiveIncome,
    addActiveIncome,
    addExpense,
    addTask,
    addDebt,
    addProperty,
    removeLiquidAsset,
    removeIlliquidAsset,
    removePassiveIncome,
    removeActiveIncome,
    removeExpense,
    removeTask,
    removeCompletedTasks,
    removeDebt,
    removeProperty,
    exportToCSV,
    importFromJSON,
    resetData,
    updateProfileName,
    saveToCloud,
    loadFromCloud,
    syncState,
    lastSync,
  };

  return (
    <FinancialDataContext.Provider value={contextValue}>
      {children}
    </FinancialDataContext.Provider>
  );
};
