export interface LiquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
  trackingMode?: 'manual' | 'wallet' | 'price';
  isCrypto?: boolean;
  cryptoSymbol?: string;
  quantity?: number;
  isStock?: boolean;
  stockSymbol?: string;
  stockName?: string;
}

export interface IlliquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface PassiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
  note?: string;
}

// Alias for backward compatibility
export type PassiveIncomeItem = PassiveIncome;

export interface ActiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive';
  icon: string;
}

// Alias for backward compatibility
export type ActiveIncomeItem = ActiveIncome;

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'recurring' | 'variable';
  status: 'active' | 'inactive';
  specificDate?: string; // Added for variable expenses with specific dates
}

// Alias for backward compatibility
export type ExpenseItem = Expense;

export interface Task {
  id: string;
  // Legacy fields for backward compatibility
  item: string;
  date: string;
  priority: number;
  icon: string;
  completed: boolean;
  // New enhanced fields
  title?: string;
  description?: string;
  category?: 'goal' | 'asset' | 'finance' | 'personal';
  dueDate?: string;
}

// Alias for backward compatibility
export type TaskItem = Task;

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid';
  icon: string;
  description?: string;
  isActive: boolean;
}

// Alias for backward compatibility
export type DebtItem = Debt;

export interface Property {
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

// Alias for backward compatibility
export type PropertyItem = Property;

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  status: 'yielding' | 'growth' | 'dividend';
  yield?: number;
  statusIcon: string;
  statusText: string;
}

export interface ExchangeRates {
  brlToUsd: number;
  usdToBrl: number;
  btcPrice: number;
  ethPrice: number;
  lastUpdated: string;
}

export interface UserProfile {
  name: string;
  defaultCurrency: string;
  language: string;
  avatarIcon?: string;
  liveDataEnabled?: boolean;
  donorWallet?: string; // Added for donor wallet address
  totalDonated?: number; // Added for total donation amount
  theme?: string; // Added for theme preference
  premiumExpiresAt?: string; // Added for premium expiration tracking
}

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
