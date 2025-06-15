
export interface LiquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface IlliquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
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
  note?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'recurring' | 'variable';
  status: 'active' | 'inactive';
  day?: string;
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
  isActive: boolean;
}

export interface PropertyItem {
  id:string;
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
  // User Configuration
  userProfile: {
    name: string;
    defaultCurrency: 'BRL' | 'USD' | 'EUR';
    language: 'en' | 'pt' | 'es';
  };
  projectionMonths: number;
  
  // Exchange Rates (will be enhanced with live data later)
  exchangeRates: {
    brlToUsd: number;
    usdToBrl: number;
    btcPrice: number;
    ethPrice: number;
    lastUpdated?: string;
  };
  
  // Financial Data
  liquidAssets: LiquidAsset[];
  illiquidAssets: IlliquidAsset[];
  passiveIncome: PassiveIncomeItem[];
  activeIncome: ActiveIncomeItem[];
  expenses: ExpenseItem[];
  tasks: TaskItem[];
  debts: DebtItem[];
  properties: PropertyItem[];
  
  // Metadata for future compatibility
  version: string;
  createdAt: string;
  lastModified: string;
}

export interface FinancialDataContextType {
  data: FinancialData;
  updateUserProfile: (updates: Partial<FinancialData['userProfile']>) => void;
  updateProjectionMonths: (months: number) => void;
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
  addPassiveIncome: (income: Omit<PassiveIncomeItem, 'id'>) => void;
  addActiveIncome: (income: Omit<ActiveIncomeItem, 'id'>) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  addDebt: (debt: Omit<DebtItem, 'id'>) => void;
  addProperty: (property: Omit<PropertyItem, 'id'>) => void;
  removeLiquidAsset: (id: string) => void;
  removeIlliquidAsset: (id: string) => void;
  removePassiveIncome: (id: string) => void;
  removeActiveIncome: (id: string) => void;
  removeExpense: (id: string) => void;
  removeTask: (id: string) => void;
  removeCompletedTasks: () => void;
  removeDebt: (id: string) => void;
  removeProperty: (id: string) => void;
  exportToCSV: () => void;
  importFromJSON: (jsonData: string) => boolean;
  resetData: () => void;
  // Legacy support
  updateProfileName: (name: string) => void;
  // Add these:
  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  syncState: 'idle' | 'loading' | 'saving';
  lastSync: string | null;
}
