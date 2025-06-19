import { ActiveIncome, Expense, LiquidAsset, PassiveIncome, Debt, Task } from "./dataTypes";

export interface FinancialData {
  userProfile: UserProfile;
  liquidAssets: LiquidAsset[];
  expenses: Expense[];
  activeIncome: ActiveIncome[];
  passiveIncome: PassiveIncome[];
  debts: Debt[];
  tasks: Task[];
  projectionMonths: number;
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
