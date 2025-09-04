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
  isReit?: boolean;
  stockSymbol?: string;
  stockName?: string;
  isPreciousMetal?: boolean;
  metalSymbol?: string;
  isWalletTracked?: boolean;
  walletAddress?: string;
  autoCompound?: boolean;
  monthlyYield?: number;
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
  useSchedule?: boolean;
  startDate?: string; // YYYY-MM or YYYY-MM-DD
  endDate?: string;   // YYYY-MM or YYYY-MM-DD
}

export interface ActiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive';
  icon: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'recurring' | 'variable';
  status: 'active' | 'inactive';
  specificDate?: string; // Added for variable expenses with specific dates
}

export interface Task {
  id: string;
  item: string;
  date: string;
  priority: number;
  icon: string;
  completed: boolean;
}

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
  donorWallet?: string;
  totalDonated?: number;
  theme?: string;
}
