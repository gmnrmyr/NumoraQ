
import { useCallback } from 'react';
import { FinancialData } from '../types';

export const useDataPersistence = (data: FinancialData) => {
  const saveData = useCallback(() => {
    const dataToSave = {
      ...data,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('financialData', JSON.stringify(dataToSave));
  }, [data]);

  return { saveData };
};
