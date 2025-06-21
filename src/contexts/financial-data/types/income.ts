
export interface PassiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
  note?: string;
}

export interface ActiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive';
  icon: string;
}

// Aliases for backward compatibility
export type PassiveIncomeItem = PassiveIncome;
export type ActiveIncomeItem = ActiveIncome;
