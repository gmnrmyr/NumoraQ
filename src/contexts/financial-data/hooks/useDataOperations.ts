
import { useCallback } from 'react';
import { FinancialData, LiquidAsset, IlliquidAsset, PassiveIncomeItem, ActiveIncomeItem, ExpenseItem, TaskItem, DebtItem, PropertyItem } from '../types';
import { toast } from "@/hooks/use-toast";

export const useDataOperations = (data: FinancialData, setData: React.Dispatch<React.SetStateAction<FinancialData>>) => {
  // User Profile Operations
  const updateUserProfile = useCallback((updates: Partial<FinancialData['userProfile']>) => {
    setData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...updates
      }
    }));
  }, [setData]);

  const updateProjectionMonths = useCallback((months: number) => {
    setData(prev => ({
      ...prev,
      projectionMonths: months
    }));
  }, [setData]);

  const updateExchangeRate = useCallback((key: keyof FinancialData['exchangeRates'], value: number) => {
    setData(prev => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [key]: value,
        lastUpdated: new Date().toISOString()
      }
    }));
  }, [setData]);

  // Legacy support
  const updateProfileName = useCallback((name: string) => {
    updateUserProfile({ name });
  }, [updateUserProfile]);

  // Liquid Assets Operations
  const updateLiquidAsset = useCallback((id: string, updates: Partial<LiquidAsset>) => {
    setData(prev => ({
      ...prev,
      liquidAssets: prev.liquidAssets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    }));
  }, [setData]);

  const addLiquidAsset = useCallback((asset: Omit<LiquidAsset, 'id'>) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      liquidAssets: [...prev.liquidAssets, newAsset]
    }));
  }, [setData]);

  const removeLiquidAsset = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      liquidAssets: prev.liquidAssets.filter(asset => asset.id !== id)
    }));
  }, [setData]);

  // Similar patterns for other data types...
  // Task Operations with special handling
  const removeCompletedTasks = useCallback(() => {
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
  }, [setData]);

  return {
    updateUserProfile,
    updateProjectionMonths,
    updateExchangeRate,
    updateProfileName,
    updateLiquidAsset,
    addLiquidAsset,
    removeLiquidAsset,
    removeCompletedTasks,
    // ... additional operations would be defined here
  };
};
