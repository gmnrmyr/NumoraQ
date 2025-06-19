
import { 
  LiquidAsset, 
  IlliquidAsset, 
  PassiveIncome, 
  ActiveIncome, 
  Expense, 
  Task, 
  Debt, 
  Property,
  ExchangeRates
} from "./dataTypes";

export interface FinancialData {
  userProfile: UserProfile;
  liquidAssets: LiquidAsset[];
  illiquidAssets: IlliquidAsset[];
  expenses: Expense[];
  activeIncome: ActiveIncome[];
  passiveIncome: PassiveIncome[];
  debts: Debt[];
  tasks: Task[];
  properties: Property[];
  projectionMonths: number;
  exchangeRates: ExchangeRates;
  version: string;
  createdAt: string;
  lastModified: string;
}

export interface UserProfile {
  name: string;
  defaultCurrency: 'USD' | 'EUR' | 'BRL';
  language: 'en' | 'pt' | 'es';
  avatar?: string;
}

export type IncomeStatus = 'active' | 'inactive';
export type ExpenseType = 'recurring' | 'variable';
export type AssetType = 'cash' | 'investment' | 'other';
export type DebtType = 'loan' | 'credit_card' | 'mortgage' | 'other';

// Export all the data types for use in other files
export type { LiquidAsset, IlliquidAsset, PassiveIncome, ActiveIncome, Expense, Task, Debt, Property, ExchangeRates };

// Legacy aliases for backward compatibility
export type PassiveIncomeItem = PassiveIncome;
export type ActiveIncomeItem = ActiveIncome;
export type ExpenseItem = Expense;
export type TaskItem = Task;
export type DebtItem = Debt;
export type PropertyItem = Property;

// Context type with aligned sync states
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
  loadFromCloud: (showToast?: boolean) => Promise<void>;
  syncState: 'idle' | 'loading' | 'saving' | 'error';
  lastSync: string | null;
}
