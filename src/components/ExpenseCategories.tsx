
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
  'Fitness & Sports',
  'Pets',
  'Family & Kids',
  'Professional Services',
  'Technology',
  'Home Improvement',
  'Charity',
  'Emergency Fund',
  'Savings',
  'Miscellaneous'
] as const;

export type ExpenseCategory = typeof expenseCategories[number];

// Expense category groups for better organization
export const expenseCategoryGroups = {
  'Essential': ['Housing', 'Utilities', 'Food & Dining', 'Transportation', 'Healthcare', 'Insurance'],
  'Lifestyle': ['Entertainment', 'Shopping', 'Personal Care', 'Fitness & Sports', 'Subscriptions'],
  'Financial': ['Investments', 'Taxes', 'Savings', 'Emergency Fund', 'Business'],
  'Family & Social': ['Family & Kids', 'Pets', 'Gifts & Donations', 'Charity'],
  'Growth': ['Education', 'Travel & Trips', 'Professional Services', 'Technology'],
  'Other': ['Home Improvement', 'Miscellaneous']
} as const;
