
export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'recurring' | 'variable';
  status: 'active' | 'inactive';
  specificDate?: string; // Added for variable expenses with specific dates
  // Linking to illiquid assets
  linkedIlliquidAssetId?: string; // ID of the illiquid asset this expense will trigger
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

// Aliases for backward compatibility
export type ExpenseItem = Expense;
export type DebtItem = Debt;
