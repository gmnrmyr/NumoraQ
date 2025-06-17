
import React from 'react';

export const expenseCategories = [
  'Housing',
  'Transportation', 
  'Food & Dining',
  'Healthcare',
  'Personal Care',
  'Shopping',
  'Entertainment',
  'Travel & Trips',
  'Education',
  'Subscriptions',
  'Insurance',
  'Investments',
  'Taxes',
  'Gifts & Donations',
  'Business',
  'Utilities',
  'Miscellaneous'
] as const;

export type ExpenseCategory = typeof expenseCategories[number];
