import { FinancialData } from './types';

export const defaultData: FinancialData = {
  userProfile: {
    name: "User",
    defaultCurrency: 'BRL',
    language: 'en',
    avatarIcon: '🤖'
  },
  projectionMonths: 12,
  exchangeRates: {
    brlToUsd: 0.18,
    usdToBrl: 5.54,
    btcPrice: 100000,
    ethPrice: 2500,
    lastUpdated: new Date().toISOString()
  },
  liquidAssets: [
    { id: '1', name: 'Checking Account', value: 3200, icon: 'Banknote', color: 'text-green-600', isActive: true },
    { id: '2', name: 'Savings Account', value: 12500, icon: 'PiggyBank', color: 'text-blue-600', isActive: true },
    { id: '3', name: 'Bitcoin', value: 2800, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
    { id: '4', name: 'Emergency Fund', value: 15000, icon: 'Shield', color: 'text-purple-600', isActive: true }
  ],
  illiquidAssets: [
    { id: '1', name: '401k Retirement', value: 85000, icon: 'TrendingUp', color: 'text-green-700', isActive: true },
    { id: '2', name: 'Stock Portfolio', value: 28500, icon: 'BarChart3', color: 'text-blue-700', isActive: true },
    { id: '3', name: 'Home Equity', value: 125000, icon: 'Home', color: 'text-slate-600', isActive: true }
  ],
  passiveIncome: [
    { id: '1', source: 'Dividend Income', amount: 180, status: 'active', icon: 'TrendingUp', note: 'From stock portfolio' },
    { id: '2', source: 'Interest Savings', amount: 65, status: 'active', icon: 'DollarSign' },
    { id: '3', source: 'Rental Property', amount: 1200, status: 'pending', icon: 'Home', note: 'Property under renovation', useSchedule: false }
  ],
  activeIncome: [
    { id: '1', source: 'Software Engineer Salary', amount: 7500, status: 'active', icon: 'Briefcase' },
    { id: '2', source: 'Freelance Projects', amount: 1200, status: 'active', icon: 'Code' },
    { id: '3', source: 'Part-time Consulting', amount: 1800, status: 'active', icon: 'Users' }
  ],
  expenses: [
    { id: '1', name: 'Rent/Mortgage', amount: 2200, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '2', name: 'Groceries', amount: 600, category: 'Food', type: 'recurring', status: 'active' },
    { id: '3', name: 'Car Payment', amount: 450, category: 'Transportation', type: 'recurring', status: 'active' },
    { id: '4', name: 'Health Insurance', amount: 380, category: 'Healthcare', type: 'recurring', status: 'active' },
    { id: '5', name: 'Utilities', amount: 220, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '6', name: 'Phone Bill', amount: 95, category: 'Utilities', type: 'recurring', status: 'active' },
    { id: '7', name: 'Vacation Fund', amount: 3000, category: 'Travel', type: 'variable', status: 'active' },
    { id: '8', name: 'Home Improvements', amount: 2500, category: 'Housing', type: 'variable', status: 'active' }
  ],
  tasks: [
    { id: '1', item: 'Review 401k contributions', date: 'This Week', priority: 1, icon: 'TrendingUp', completed: false },
    { id: '2', item: 'Set up emergency fund auto-transfer', date: 'Next Week', priority: 2, icon: 'Shield', completed: false },
    { id: '3', item: 'Research high-yield savings accounts', date: 'This Month', priority: 3, icon: 'Search', completed: false },
    { id: '4', item: 'Update insurance beneficiaries', date: 'This Quarter', priority: 4, icon: 'FileText', completed: false }
  ],
  debts: [
    { id: '1', creditor: 'Student Loan Federal', amount: 28500, dueDate: '2029-05-15', status: 'partial', icon: 'GraduationCap', description: 'Federal student loan at 4.2% APR', isActive: true },
    { id: '2', creditor: 'Credit Card Visa', amount: 3200, dueDate: '2024-07-15', status: 'pending', icon: 'CreditCard', description: 'Chase Visa - 18.9% APR', isActive: true },
    { id: '3', creditor: 'Car Loan', amount: 22500, dueDate: '2027-03-20', status: 'partial', icon: 'Car', description: 'Auto loan at 5.8% APR', isActive: true }
  ],
  properties: [
    { id: '1', name: 'Primary Residence', value: 485000, status: 'rented', currentRent: 0, statusIcon: '🏠', statusText: 'Owned', prediction: 'Current', rentRange: 'N/A' },
    { id: '2', name: 'Rental Property (Downtown)', value: 320000, status: 'renovating', currentRent: 0, expectedRent: 2200, statusIcon: '🔄', statusText: 'Renovating', prediction: 'Spring 2025', rentRange: '$2,000-2,400' },
    { id: '3', name: 'Vacation Rental (Mountains)', value: 280000, minValue: 265000, maxValue: 295000, status: 'planned', currentRent: 0, expectedRent: 200, statusIcon: '📋', statusText: 'Planned', prediction: '2026', rentRange: '$180-220/night' }
  ],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};

export const initialFinancialData: FinancialData = {
  userProfile: {
    name: '',
    defaultCurrency: 'USD',
    language: 'en',
    avatarIcon: undefined
  },
  projectionMonths: 12,
  exchangeRates: {
    brlToUsd: 0.18,
    usdToBrl: 5.54,
    btcPrice: 100000,
    ethPrice: 2500,
    lastUpdated: new Date().toISOString()
  },
  liquidAssets: [
    { id: '1', name: 'Checking Account', value: 3200, icon: 'Banknote', color: 'text-green-600', isActive: true },
    { id: '2', name: 'Savings Account', value: 12500, icon: 'PiggyBank', color: 'text-blue-600', isActive: true },
    { id: '3', name: 'Bitcoin', value: 2800, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
    { id: '4', name: 'Emergency Fund', value: 15000, icon: 'Shield', color: 'text-purple-600', isActive: true }
  ],
  illiquidAssets: [
    { id: '1', name: '401k Retirement', value: 85000, icon: 'TrendingUp', color: 'text-green-700', isActive: true },
    { id: '2', name: 'Stock Portfolio', value: 28500, icon: 'BarChart3', color: 'text-blue-700', isActive: true },
    { id: '3', name: 'Home Equity', value: 125000, icon: 'Home', color: 'text-slate-600', isActive: true }
  ],
  passiveIncome: [
    { id: '1', source: 'Dividend Income', amount: 180, status: 'active', icon: 'TrendingUp', note: 'From stock portfolio' },
    { id: '2', source: 'Interest Savings', amount: 65, status: 'active', icon: 'DollarSign' },
    { id: '3', source: 'Rental Property', amount: 1200, status: 'pending', icon: 'Home', note: 'Property under renovation', useSchedule: false }
  ],
  activeIncome: [
    { id: '1', source: 'Software Engineer Salary', amount: 7500, status: 'active', icon: 'Briefcase' },
    { id: '2', source: 'Freelance Projects', amount: 1200, status: 'active', icon: 'Code' },
    { id: '3', source: 'Part-time Consulting', amount: 1800, status: 'active', icon: 'Users' }
  ],
  expenses: [
    { id: '1', name: 'Rent/Mortgage', amount: 2200, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '2', name: 'Groceries', amount: 600, category: 'Food', type: 'recurring', status: 'active' },
    { id: '3', name: 'Car Payment', amount: 450, category: 'Transportation', type: 'recurring', status: 'active' },
    { id: '4', name: 'Health Insurance', amount: 380, category: 'Healthcare', type: 'recurring', status: 'active' },
    { id: '5', name: 'Utilities', amount: 220, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '6', name: 'Phone Bill', amount: 95, category: 'Utilities', type: 'recurring', status: 'active' },
    { id: '7', name: 'Vacation Fund', amount: 3000, category: 'Travel', type: 'variable', status: 'active' },
    { id: '8', name: 'Home Improvements', amount: 2500, category: 'Housing', type: 'variable', status: 'active' }
  ],
  tasks: [
    { id: '1', item: 'Review 401k contributions', date: 'This Week', priority: 1, icon: 'TrendingUp', completed: false },
    { id: '2', item: 'Set up emergency fund auto-transfer', date: 'Next Week', priority: 2, icon: 'Shield', completed: false },
    { id: '3', item: 'Research high-yield savings accounts', date: 'This Month', priority: 3, icon: 'Search', completed: false },
    { id: '4', item: 'Update insurance beneficiaries', date: 'This Quarter', priority: 4, icon: 'FileText', completed: false }
  ],
  debts: [
    { id: '1', creditor: 'Student Loan Federal', amount: 28500, dueDate: '2029-05-15', status: 'partial', icon: 'GraduationCap', description: 'Federal student loan at 4.2% APR', isActive: true },
    { id: '2', creditor: 'Credit Card Visa', amount: 3200, dueDate: '2024-07-15', status: 'pending', icon: 'CreditCard', description: 'Chase Visa - 18.9% APR', isActive: true },
    { id: '3', creditor: 'Car Loan', amount: 22500, dueDate: '2027-03-20', status: 'partial', icon: 'Car', description: 'Auto loan at 5.8% APR', isActive: true }
  ],
  properties: [
    { id: '1', name: 'Primary Residence', value: 485000, status: 'rented', currentRent: 0, statusIcon: '🏠', statusText: 'Owned', prediction: 'Current', rentRange: 'N/A' },
    { id: '2', name: 'Rental Property (Downtown)', value: 320000, status: 'renovating', currentRent: 0, expectedRent: 2200, statusIcon: '🔄', statusText: 'Renovating', prediction: 'Spring 2025', rentRange: '$2,000-2,400' },
    { id: '3', name: 'Vacation Rental (Mountains)', value: 280000, minValue: 265000, maxValue: 295000, status: 'planned', currentRent: 0, expectedRent: 200, statusIcon: '📋', statusText: 'Planned', prediction: '2026', rentRange: '$180-220/night' }
  ],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};
