
export interface PassiveIncome {
  id: string;
  source: string;
  amount: number;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
  note?: string;
  // Optional scheduling
  useSchedule?: boolean;
  startDate?: string; // YYYY-MM or YYYY-MM-DD
  endDate?: string;   // YYYY-MM or YYYY-MM-DD (optional => open-ended)
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
