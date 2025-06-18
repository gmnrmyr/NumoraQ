
import { FinancialData } from './types';

export const defaultData: FinancialData = {
  userProfile: {
    name: "Starter",
    defaultCurrency: "USD",
    language: "en"
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
    { id: '2', name: 'Savings Account', value: 8500, icon: 'PiggyBank', color: 'text-blue-600', isActive: true },
    { id: '3', name: 'Bitcoin', value: 2800, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
    { id: '4', name: 'Emergency Fund', value: 12000, icon: 'Shield', color: 'text-purple-600', isActive: true }
  ],
  illiquidAssets: [
    { id: '1', name: '401k Retirement', value: 45000, icon: 'TrendingUp', color: 'text-green-700', isActive: true },
    { id: '2', name: 'Stock Portfolio', value: 18500, icon: 'BarChart3', color: 'text-blue-700', isActive: true },
    { id: '3', name: 'Home Equity', value: 85000, icon: 'Home', color: 'text-slate-600', isActive: true }
  ],
  passiveIncome: [
    { id: '1', source: 'Dividend Income', amount: 120, status: 'active', icon: 'TrendingUp', note: 'From stock portfolio' },
    { id: '2', source: 'Interest Savings', amount: 45, status: 'active', icon: 'DollarSign' },
    { id: '3', source: 'Rental Property', amount: 800, status: 'pending', icon: 'Home', note: 'Property under renovation' }
  ],
  activeIncome: [
    { id: '1', source: 'Software Engineer Salary', amount: 4500, status: 'active', icon: 'Briefcase' },
    { id: '2', source: 'Freelance Projects', amount: 800, status: 'active', icon: 'Code' },
    { id: '3', source: 'Part-time Consulting', amount: 1200, status: 'active', icon: 'Users' }
  ],
  expenses: [
    { id: '1', name: 'Rent/Mortgage', amount: 1800, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '2', name: 'Groceries', amount: 450, category: 'Food', type: 'recurring', status: 'active' },
    { id: '3', name: 'Car Payment', amount: 380, category: 'Transportation', type: 'recurring', status: 'active' },
    { id: '4', name: 'Health Insurance', amount: 320, category: 'Healthcare', type: 'recurring', status: 'active' },
    { id: '5', name: 'Utilities', amount: 180, category: 'Housing', type: 'recurring', status: 'active' },
    { id: '6', name: 'Phone Bill', amount: 85, category: 'Utilities', type: 'recurring', status: 'active' },
    { id: '7', name: 'Vacation Fund', amount: 2500, category: 'Travel', type: 'variable', status: 'active' },
    { id: '8', name: 'Home Improvements', amount: 1800, category: 'Housing', type: 'variable', status: 'active' }
  ],
  tasks: [
    { id: '1', item: 'Review 401k contributions', date: 'This Week', priority: 1, icon: 'TrendingUp', completed: false },
    { id: '2', item: 'Set up emergency fund auto-transfer', date: 'Next Week', priority: 2, icon: 'Shield', completed: false },
    { id: '3', item: 'Research high-yield savings accounts', date: 'This Month', priority: 3, icon: 'Search', completed: false },
    { id: '4', item: 'Update insurance beneficiaries', date: 'This Quarter', priority: 4, icon: 'FileText', completed: false }
  ],
  debts: [
    { id: '1', creditor: 'Student Loan Federal', amount: 15200, dueDate: '2029-05-15', status: 'active', icon: 'GraduationCap', description: 'Federal student loan at 4.2% APR', isActive: true },
    { id: '2', creditor: 'Credit Card Visa', amount: 2800, dueDate: '2024-07-15', status: 'active', icon: 'CreditCard', description: 'Chase Visa - 18.9% APR', isActive: true },
    { id: '3', creditor: 'Car Loan', amount: 18500, dueDate: '2027-03-20', status: 'active', icon: 'Car', description: 'Auto loan at 5.8% APR', isActive: true }
  ],
  properties: [
    { id: '1', name: 'Primary Residence', value: 385000, status: 'owned', currentRent: 0, statusIcon: '🏠', statusText: 'Owned', prediction: 'Current', rentRange: 'N/A' },
    { id: '2', name: 'Rental Property (Downtown)', value: 220000, status: 'renovating', currentRent: 0, expectedRent: 1800, statusIcon: '🔄', statusText: 'Renovating', prediction: 'Spring 2025', rentRange: '$1,600-2,000' },
    { id: '3', name: 'Vacation Rental (Mountains)', value: 180000, minValue: 165000, maxValue: 195000, status: 'planned', currentRent: 0, expectedRent: 150, statusIcon: '📋', statusText: 'Planned', prediction: '2026', rentRange: '$120-180/night' }
  ],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};
