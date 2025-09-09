import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCloudSync } from './hooks/useCloudSync';
import { FinancialData, FinancialDataContextType, LiquidAsset, IlliquidAsset, PassiveIncomeItem, ActiveIncomeItem, ExpenseItem, TaskItem, DebtItem, PropertyItem } from './types';
import { defaultData } from './initialState';
import { useDataPersistence } from './hooks/useDataPersistence';
import { useDataMigration } from './hooks/useDataMigration';
import { useBackupManager } from '@/hooks/useBackupManager';

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { loadInitialData } = useDataMigration();
  const [data, setData] = useState<FinancialData>(loadInitialData);

  const { user } = useAuth();
  const { syncState, lastSync, loadFromCloud, saveToCloud } = useCloudSync(data, setData, importFromJSON, user);
  const { saveData } = useDataPersistence(data);
  const { 
    backups, 
    createBackup: createBackupInternal, 
    restoreBackup: restoreBackupInternal, 
    deleteBackup, 
    getBackupStats, 
    formatBackupSize 
  } = useBackupManager();

  useEffect(() => {
    saveData();
  }, [data, saveData]);
  
  useEffect(() => {
    if (user) {
      loadFromCloud(true);
    }
  }, [user]);

  // Check for scheduled assets on mount and periodically
  useEffect(() => {
    // Check immediately on mount
    checkAndTriggerScheduledAssets();
    
    // Check every hour for scheduled assets
    const interval = setInterval(() => {
      checkAndTriggerScheduledAssets();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  // Update entire data object
  const updateData = (newData: Partial<FinancialData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

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

  // Function to check and trigger scheduled assets
  const checkAndTriggerScheduledAssets = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    setData(prev => {
      const updatedAssets = prev.illiquidAssets.map(asset => {
        // Check if asset is scheduled, not triggered, and scheduled date has arrived
        if (asset.isScheduled && 
            !asset.isTriggered && 
            asset.scheduledDate && 
            asset.scheduledDate <= today) {
          
          // Trigger the asset
          return {
            ...asset,
            isTriggered: true,
            triggeredDate: today,
            value: asset.scheduledValue || asset.value,
            isActive: true
          };
        }
        return asset;
      });

      // Check if any assets were triggered
      const triggeredAssets = updatedAssets.filter(asset => 
        asset.isScheduled && 
        !prev.illiquidAssets.find(prevAsset => 
          prevAsset.id === asset.id && prevAsset.isTriggered
        ) && 
        asset.isTriggered
      );

      // Show toast for triggered assets
      if (triggeredAssets.length > 0) {
        triggeredAssets.forEach(asset => {
          toast({
            title: "Asset Triggered!",
            description: `${asset.name} has been activated with value $${asset.value.toLocaleString()}`,
            duration: 5000,
          });
        });
      }

      return {
        ...prev,
        illiquidAssets: updatedAssets
      };
    });
  };

  // Function to link expense to illiquid asset and update asset scheduling
  const linkExpenseToAsset = (expenseId: string, assetId: string) => {
    const expense = data.expenses.find(exp => exp.id === expenseId);
    const asset = data.illiquidAssets.find(ast => ast.id === assetId);
    
    if (expense && asset) {
      // Update expense with linked asset
      updateExpense(expenseId, { linkedIlliquidAssetId: assetId });
      
      // Update asset with linked expense and schedule if it has a specific date
      if (expense.specificDate) {
        updateIlliquidAsset(assetId, {
          linkedExpenseId: expenseId,
          scheduledDate: expense.specificDate,
          scheduledValue: expense.amount,
          isScheduled: true,
          isActive: false // Keep inactive until triggered
        });
      }
    }
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
    setData(prev => {
      const updatedExpenses = prev.expenses.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      );
      
      // Find the updated expense
      const updatedExpense = updatedExpenses.find(exp => exp.id === id);
      
      // If expense has a linked asset and the date changed, update the asset's scheduled date
      if (updatedExpense && updatedExpense.linkedIlliquidAssetId && (updates.specificDate || updates.startDate || updates.endDate)) {
        const linkedAsset = prev.illiquidAssets.find(asset => asset.id === updatedExpense.linkedIlliquidAssetId);
        if (linkedAsset && linkedAsset.isScheduled) {
          // Determine which date to use for the asset
          let newScheduledDate = linkedAsset.scheduledDate;
          
          if (updates.specificDate) {
            newScheduledDate = updates.specificDate;
          } else if (updates.startDate) {
            newScheduledDate = updates.startDate;
          } else if (updates.endDate) {
            newScheduledDate = updates.endDate;
          }
          
          // Update the asset's scheduled date to match the expense date
          const updatedAssets = prev.illiquidAssets.map(asset => 
            asset.id === updatedExpense.linkedIlliquidAssetId 
              ? { ...asset, scheduledDate: newScheduledDate }
              : asset
          );
          
          return {
            ...prev,
            expenses: updatedExpenses,
            illiquidAssets: updatedAssets
          };
        }
      }
      
      return {
        ...prev,
        expenses: updatedExpenses
      };
    });
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

  const resetData = () => {
    setData(defaultData);
    console.log('Data reset to default values');
  };

  // Backup functionality
  const createBackup = (name?: string) => {
    return createBackupInternal(data, name, false);
  };

  const restoreBackup = (backupId: string) => {
    const backupData = restoreBackupInternal(backupId);
    if (backupData) {
      setData(backupData);
    }
  };

  const contextValue: FinancialDataContextType = {
    data,
    updateData,
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
    // Backup functionality
    backups,
    createBackup,
    restoreBackup,
    deleteBackup,
    getBackupStats,
    formatBackupSize,
    // Asset scheduling functionality
    checkAndTriggerScheduledAssets,
    linkExpenseToAsset,
  };

  return (
    <FinancialDataContext.Provider value={contextValue}>
      {children}
    </FinancialDataContext.Provider>
  );
};
