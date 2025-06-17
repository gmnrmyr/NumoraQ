
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
  'Personal Development',
  'Hobbies',
  'Books & Media',
  'Clothing',
  'Beauty & Grooming',
  'Medical & Dental',
  'Phone & Internet',
  'Streaming Services',
  'Gaming',
  'Photography',
  'Music & Concerts',
  'Dining Out',
  'Groceries',
  'Coffee & Tea',
  'Alcohol & Bars',
  'Vacation & Holidays',
  'Weekend Trips',
  'Miscellaneous'
] as const;

export type ExpenseCategory = typeof expenseCategories[number];

// Expense category groups for better organization
export const expenseCategoryGroups = {
  'Essential': [
    'Housing', 
    'Utilities', 
    'Food & Dining', 
    'Groceries',
    'Transportation', 
    'Healthcare', 
    'Medical & Dental',
    'Insurance',
    'Phone & Internet'
  ],
  'Lifestyle': [
    'Entertainment', 
    'Shopping', 
    'Clothing',
    'Personal Care', 
    'Beauty & Grooming',
    'Fitness & Sports', 
    'Hobbies',
    'Gaming',
    'Music & Concerts'
  ],
  'Food & Beverage': [
    'Dining Out',
    'Coffee & Tea',
    'Alcohol & Bars'
  ],
  'Digital & Media': [
    'Subscriptions',
    'Streaming Services', 
    'Books & Media',
    'Technology',
    'Photography'
  ],
  'Travel & Recreation': [
    'Travel & Trips',
    'Vacation & Holidays',
    'Weekend Trips'
  ],
  'Financial': [
    'Investments', 
    'Taxes', 
    'Savings', 
    'Emergency Fund', 
    'Business'
  ],
  'Personal Growth': [
    'Education',
    'Personal Development'
  ],
  'Family & Social': [
    'Family & Kids', 
    'Pets', 
    'Gifts & Donations', 
    'Charity'
  ],
  'Professional': [
    'Professional Services',
    'Home Improvement'
  ],
  'Other': [
    'Miscellaneous'
  ]
} as const;
