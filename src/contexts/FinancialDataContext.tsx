import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LiquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean; // New field to control if it counts in calculations
}

export interface IlliquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean; // New field to control if it counts in calculations
}

export interface PassiveIncomeItem {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'pending' | 'inactive';
  icon: string;
  note?: string;
}

export interface ActiveIncomeItem {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'pending' | 'inactive';
  icon: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'recurring' | 'variable';
  status: 'active' | 'inactive';
}

export interface TaskItem {
  id: string;
  item: string;
  date: string;
  priority: number;
  icon: string;
  completed: boolean;
}

export interface DebtItem {
  id: string;
  creditor: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid';
  icon: string;
  description: string;
  isActive: boolean; // New field to control if it counts in calculations
}

export interface PropertyItem {
  id: string;
  name: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  status: 'rented' | 'renovating' | 'planned';
  currentRent: number;
  expectedRent?: number;
  statusIcon: string;
  statusText: string;
  prediction: string;
  rentRange: string;
}

export interface FinancialData {
  exchangeRates: {
    brlToUsd: number;
    usdToBrl: number;
    btcPrice: number;
    ethPrice: number;
  };
  liquidAssets: LiquidAsset[];
  illiquidAssets: IlliquidAsset[];
  passiveIncome: PassiveIncomeItem[];
  activeIncome: ActiveIncomeItem[];
  expenses: ExpenseItem[];
  tasks: TaskItem[];
  debts: DebtItem[];
  properties: PropertyItem[];
}

interface FinancialDataContextType {
  data: FinancialData;
  updateExchangeRate: (key: keyof FinancialData['exchangeRates'], value: number) => void;
  updateLiquidAsset: (id: string, updates: Partial<LiquidAsset>) => void;
  updateIlliquidAsset: (id: string, updates: Partial<IlliquidAsset>) => void;
  updatePassiveIncome: (id: string, updates: Partial<PassiveIncomeItem>) => void;
  updateActiveIncome: (id: string, updates: Partial<ActiveIncomeItem>) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  updateDebt: (id: string, updates: Partial<DebtItem>) => void;
  updateProperty: (id: string, updates: Partial<PropertyItem>) => void;
  addLiquidAsset: (asset: Omit<LiquidAsset, 'id'>) => void;
  addIlliquidAsset: (asset: Omit<IlliquidAsset, 'id'>) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  addDebt: (debt: Omit<DebtItem, 'id'>) => void;
  addProperty: (property: Omit<PropertyItem, 'id'>) => void;
  removeLiquidAsset: (id: string) => void;
  removeIlliquidAsset: (id: string) => void;
  removeExpense: (id: string) => void;
  removeTask: (id: string) => void;
  removeDebt: (id: string) => void;
  removeProperty: (id: string) => void;
  exportToCSV: () => void;
  importFromJSON: (jsonData: string): boolean => void;
  resetData: () => void;
}

const defaultData: FinancialData = {
  exchangeRates: {
    brlToUsd: 0.18,
    usdToBrl: 5.54,
    btcPrice: 588300,
    ethPrice: 14000
  },
  liquidAssets: [
    { id: '1', name: 'BTC', value: 33500, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
    { id: '2', name: 'Altcoins & NFT', value: 4500, icon: 'Coins', color: 'text-purple-600', isActive: true },
    { id: '3', name: 'Banco', value: 100, icon: 'Banknote', color: 'text-green-600', isActive: true },
    { id: '4', name: 'PXL DEX', value: 50000, icon: 'Coins', color: 'text-blue-600', isActive: false }
  ],
  illiquidAssets: [
    { id: '1', name: 'Bens GUI', value: 50000, icon: 'Building', color: 'text-slate-600', isActive: true },
    { id: '2', name: 'Bens Pais', value: 30000, icon: 'Building', color: 'text-slate-600', isActive: true }
  ],
  passiveIncome: [
    { id: '1', source: 'Locação Macuco', amount: 6000, status: 'pending', icon: 'Home', note: 'Not rented yet, simulated' },
    { id: '2', source: 'Locação Laurindo', amount: 1600, status: 'active', icon: 'Home' },
    { id: '3', source: 'Aposentadoria Mãe', amount: 1518, status: 'active', icon: 'User' },
    { id: '4', source: 'Locação Ataliba', amount: 1300, status: 'active', icon: 'Home' },
    { id: '5', source: 'Apoio da IRA', amount: 1000, status: 'active', icon: 'Heart' },
    { id: '6', source: 'Aposentadoria Pai', amount: 0, status: 'pending', icon: 'User' }
  ],
  activeIncome: [
    { id: '1', source: 'Freelas Pai', amount: 600, status: 'active', icon: 'Briefcase' },
    { id: '2', source: 'CLT GUI (Gestor Seller)', amount: 1800, status: 'active', icon: 'Briefcase' },
    { id: '3', source: 'Freelas GUI', amount: 600, status: 'active', icon: 'Briefcase' }
  ],
  expenses: [
    { id: '1', name: 'Condomínio Macuco', amount: 1117, category: 'Vacância', type: 'recurring', status: 'active' },
    { id: '2', name: 'Locação Taubaté', amount: 2800, category: 'Moradia', type: 'recurring', status: 'active' },
    { id: '3', name: 'Convênio GUI', amount: 1163, category: 'Saúde', type: 'recurring', status: 'active' },
    { id: '4', name: 'Cannabis GUI', amount: 1000, category: 'Vícios', type: 'recurring', status: 'active' },
    { id: '5', name: 'Reforma Macuco', amount: 7100, category: 'Reforma', type: 'variable', status: 'active' },
    { id: '6', name: 'Cartão Inter GUI', amount: 4600, category: 'Cartão', type: 'variable', status: 'active' }
  ],
  tasks: [
    { id: '1', item: 'Exames', date: 'Domingo', priority: 1, icon: 'User', completed: false },
    { id: '2', item: 'Encontrar carteira de trabalho', date: 'Segunda', priority: 2, icon: 'FileText', completed: false },
    { id: '3', item: 'Consulta Psiquiatra', date: 'Julho', priority: 5, icon: 'User', completed: false }
  ],
  debts: [
    { id: '1', creditor: 'Goodstorage Avaria', amount: 1200, dueDate: 'INDEF', status: 'pending', icon: 'Home', description: 'Storage damage compensation', isActive: true },
    { id: '2', creditor: 'Devo Mãe', amount: 2000, dueDate: 'INDEF', status: 'pending', icon: 'User', description: 'Family loan - various expenses', isActive: true },
    { id: '3', creditor: 'Devo Fernando', amount: 5000, dueDate: 'INDEF', status: 'pending', icon: 'User', description: 'Personal loan', isActive: true }
  ],
  properties: [
    { id: '1', name: 'Laurindo', value: 230400, status: 'rented', currentRent: 1600, statusIcon: '✅', statusText: 'Alugado', prediction: 'Atual', rentRange: 'R$ 1.600' },
    { id: '2', name: 'Macuco (Moema)', value: 1050000, status: 'renovating', currentRent: 0, expectedRent: 6000, statusIcon: '🔄', statusText: 'Reformando', prediction: 'outubro/2025', rentRange: 'R$ 6.000' },
    { id: '3', name: 'Ataliba (comercial)', value: 206220, minValue: 172440, maxValue: 240000, status: 'planned', currentRent: 0, expectedRent: 1750, statusIcon: '📋', statusText: 'Planejado', prediction: '2027', rentRange: 'R$ 1.500-2.000' }
  ]
};

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
    return savedData ? JSON.parse(savedData) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('financialData', JSON.stringify(data));
  }, [data]);

  const updateExchangeRate = (key: keyof FinancialData['exchangeRates'], value: number) => {
    setData(prev => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [key]: value
      }
    }));
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
    a.download = `financial-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromJSON = (jsonData: string): boolean => {
    try {
      // Validate that it's actually JSON
      const parsedData = JSON.parse(jsonData);
      
      // Basic validation - check if it has the expected structure
      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid data structure');
      }
      
      // Merge with default data to ensure all required fields exist
      const validatedData = {
        ...defaultData,
        ...parsedData,
        // Ensure arrays exist even if empty
        liquidAssets: Array.isArray(parsedData.liquidAssets) ? parsedData.liquidAssets : defaultData.liquidAssets,
        illiquidAssets: Array.isArray(parsedData.illiquidAssets) ? parsedData.illiquidAssets : defaultData.illiquidAssets,
        passiveIncome: Array.isArray(parsedData.passiveIncome) ? parsedData.passiveIncome : defaultData.passiveIncome,
        activeIncome: Array.isArray(parsedData.activeIncome) ? parsedData.activeIncome : defaultData.activeIncome,
        expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : defaultData.expenses,
        tasks: Array.isArray(parsedData.tasks) ? parsedData.tasks : defaultData.tasks,
        debts: Array.isArray(parsedData.debts) ? parsedData.debts : defaultData.debts,
        properties: Array.isArray(parsedData.properties) ? parsedData.properties : defaultData.properties,
        exchangeRates: parsedData.exchangeRates || defaultData.exchangeRates
      };
      
      setData(validatedData);
      console.log('Data imported successfully:', validatedData);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const resetData = () => {
    setData(defaultData);
  };

  return (
    <FinancialDataContext.Provider value={{
      data,
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
      addExpense,
      addTask,
      addDebt,
      addProperty,
      removeLiquidAsset,
      removeIlliquidAsset,
      removeExpense,
      removeTask,
      removeDebt,
      removeProperty,
      exportToCSV,
      importFromJSON,
      resetData
    }}>
      {children}
    </FinancialDataContext.Provider>
  );
};
