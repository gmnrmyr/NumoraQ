
import { FinancialData } from './types';

export const defaultData: FinancialData = {
  userProfile: {
    name: "User",
    defaultCurrency: 'BRL',
    language: 'en',
    theme: 'dark',
    donorWallet: '',
    totalDonated: 0
  },
  projectionMonths: 12,
  exchangeRates: {
    brlToUsd: 0.20,
    usdToBrl: 5.00,
    btcPrice: 50000,
    ethPrice: 3000,
    lastUpdated: new Date().toISOString()
  },
  liquidAssets: [
    {
      id: '1',
      name: 'Emergency Fund',
      value: 5000,
      icon: 'PiggyBank',
      color: 'bg-green-500',
      isActive: true,
      trackingMode: 'manual'
    },
    {
      id: '2',
      name: 'Checking Account',
      value: 2500,
      icon: 'CreditCard',
      color: 'bg-blue-500',
      isActive: true,
      trackingMode: 'manual'
    }
  ],
  illiquidAssets: [
    {
      id: '1',
      name: 'Investment Portfolio',
      value: 15000,
      icon: 'TrendingUp',
      color: 'bg-purple-500',
      isActive: true
    }
  ],
  passiveIncome: [
    {
      id: '1',
      source: 'Dividends',
      amount: 200,
      status: 'active',
      icon: 'TrendingUp'
    },
    {
      id: '2',
      source: 'Rental Income',
      amount: 800,
      status: 'active',
      icon: 'Home'
    }
  ],
  activeIncome: [
    {
      id: '1',
      source: 'Salary',
      amount: 5000,
      status: 'active',
      icon: 'Briefcase'
    }
  ],
  expenses: [
    {
      id: '1',
      name: 'Rent',
      amount: 1200,
      category: 'housing',
      type: 'recurring',
      status: 'active'
    },
    {
      id: '2',
      name: 'Groceries',
      amount: 400,
      category: 'food',
      type: 'recurring',
      status: 'active'
    },
    {
      id: '3',
      name: 'Vacation',
      amount: 1500,
      category: 'travel',
      type: 'variable',
      status: 'active',
      specificDate: '2024-07-15'
    }
  ],
  tasks: [
    {
      id: '1',
      item: 'Review investment portfolio',
      date: new Date().toISOString().split('T')[0],
      priority: 1,
      icon: 'Target',
      completed: false
    },
    {
      id: '2',
      item: 'Set up emergency fund',
      date: new Date().toISOString().split('T')[0],
      priority: 2,
      icon: 'Shield',
      completed: false
    }
  ],
  debts: [
    {
      id: '1',
      creditor: 'Credit Card',
      amount: 2500,
      dueDate: '2024-12-31',
      status: 'pending',
      icon: 'CreditCard',
      description: 'Monthly credit card balance',
      isActive: true
    }
  ],
  properties: [
    {
      id: '1',
      name: 'Primary Residence',
      value: 250000,
      status: 'rented',
      currentRent: 1200,
      statusIcon: '🏠',
      statusText: 'Rented',
      prediction: 'Stable',
      rentRange: '$1,100 - $1,300'
    }
  ],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};
