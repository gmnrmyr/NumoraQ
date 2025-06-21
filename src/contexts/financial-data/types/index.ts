
// Re-export all types for backward compatibility
export * from './assets';
export * from './income';
export * from './expenses';
export * from './tasks';
export * from './user';

// Main data structure and context types
import { LiquidAsset, IlliquidAsset, Property } from './assets';
import { PassiveIncome, ActiveIncome } from './income';
import { Expense, Debt } from './expenses';
import { Task } from './tasks';
import { UserProfile, ExchangeRates } from './user';

export interface FinancialData {
  userProfile: UserProfile;
  projectionMonths: number;
  exchangeRates: ExchangeRates;
  liquidAssets: LiquidAsset[];
  illiquidAssets: IlliquidAsset[];
  passiveIncome: PassiveIncome[];
  activeIncome: ActiveIncome[];
  expenses: Expense[];
  tasks: Task[];
  debts: Debt[];
  properties: Property[];
  version: string;
  createdAt: string;
  lastModified: string;
}

export interface FinancialDataContextType {
  data: FinancialData;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateProjectionMonths: (months: number) => void;
  updateExchangeRate: (key: keyof ExchangeRates, value: number) => void;
  updateLiquidAsset: (id: string, updates: Partial<LiquidAsset>) => void;
  updateIlliquidAsset: (id: string, updates: Partial<IlliquidAsset>) => void;
  updatePassiveIncome: (id: string, updates: Partial<PassiveIncome>) => void;
  updateActiveIncome: (id: string, updates: Partial<ActiveIncome>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  addLiquidAsset: (asset: Omit<LiquidAsset, 'id'>) => void;
  addIlliquidAsset: (asset: Omit<IlliquidAsset, 'id'>) => void;
  addPassiveIncome: (income: Omit<PassiveIncome, 'id'>) => void;
  addActiveIncome: (income: Omit<ActiveIncome, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  addProperty: (property: Omit<Property, 'id'>) => void;
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
  updateProfileName: (name: string) => void;
  saveToCloud: () => Promise<void>;
  loadFromCloud: (isSilent?: boolean) => Promise<void>;
  syncState: 'idle' | 'loading' | 'saving' | 'error';
  lastSync: string | null;
}
