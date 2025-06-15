
import { FinancialData } from './types';

export const defaultData: FinancialData = {
  userProfile: {
    name: "Gui",
    defaultCurrency: "BRL",
    language: "en"
  },
  projectionMonths: 12,
  exchangeRates: {
    brlToUsd: 0.18,
    usdToBrl: 5.54,
    btcPrice: 588300,
    ethPrice: 14000,
    lastUpdated: new Date().toISOString()
  },
  liquidAssets: [
    { id: '1', name: 'BTC', value: 33500, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
    { id: '2', name: 'Altcoins & NFT', value: 4500, icon: 'Coins', color: 'text-purple-600', isActive: true },
    { id: '3', name: 'Banco', value: 100, icon: 'Banknote', color: 'text-green-600', isActive: true },
    { id: '4', name: 'PXL DEX', value: 50000, icon: 'Coins', color: 'text-blue-600', isActive: false }
  ],
  illiquidAssets: [
    { id: '1', name: 'Bens GUI', value: 50000, icon: 'Building', color: 'text-slate-600', isActive: true },
    { id: '2', name: 'Bens Pais', value: 30000, icon: 'Building', color: 'text-slate-600', isActive: true }
  ],
  passiveIncome: [
    { id: '1', source: 'Locação Macuco', amount: 6000, status: 'pending', icon: 'Home', note: 'Not rented yet, simulated' },
    { id: '2', source: 'Locação Laurindo', amount: 1600, status: 'active', icon: 'Home' },
    { id: '3', source: 'Aposentadoria Mãe', amount: 1518, status: 'active', icon: 'User' },
    { id: '4', source: 'Locação Ataliba', amount: 1300, status: 'active', icon: 'Home' },
    { id: '5', source: 'Apoio da IRA', amount: 1000, status: 'active', icon: 'Heart' },
    { id: '6', source: 'Aposentadoria Pai', amount: 0, status: 'pending', icon: 'User' }
  ],
  activeIncome: [
    { id: '1', source: 'Freelas Pai', amount: 600, status: 'active', icon: 'Briefcase' },
    { id: '2', source: 'CLT GUI (Gestor Seller)', amount: 1800, status: 'active', icon: 'Briefcase' },
    { id: '3', source: 'Freelas GUI', amount: 600, status: 'active', icon: 'Briefcase' }
  ],
  expenses: [
    { id: '1', name: 'Condomínio Macuco', amount: 1117, category: 'Vacância', type: 'recurring', status: 'active' },
    { id: '2', name: 'Locação Taubaté', amount: 2800, category: 'Moradia', type: 'recurring', status: 'active' },
    { id: '3', name: 'Convênio GUI', amount: 1163, category: 'Saúde', type: 'recurring', status: 'active' },
    { id: '4', name: 'Cannabis GUI', amount: 1000, category: 'Vícios', type: 'recurring', status: 'active' },
    { id: '5', name: 'Reforma Macuco', amount: 7100, category: 'Reforma', type: 'variable', status: 'active' },
    { id: '6', name: 'Cartão Inter GUI', amount: 4600, category: 'Cartão', type: 'variable', status: 'active' }
  ],
  tasks: [
    { id: '1', item: 'Exames', date: 'Domingo', priority: 1, icon: 'User', completed: false },
    { id: '2', item: 'Encontrar carteira de trabalho', date: 'Segunda', priority: 2, icon: 'FileText', completed: false },
    { id: '3', item: 'Consulta Psiquiatra', date: 'Julho', priority: 5, icon: 'User', completed: false }
  ],
  debts: [
    { id: '1', creditor: 'Goodstorage Avaria', amount: 1200, dueDate: 'INDEF', status: 'pending', icon: 'Home', description: 'Storage damage compensation', isActive: true },
    { id: '2', creditor: 'Devo Mãe', amount: 2000, dueDate: 'INDEF', status: 'pending', icon: 'User', description: 'Family loan - various expenses', isActive: true },
    { id: '3', creditor: 'Devo Fernando', amount: 5000, dueDate: 'INDEF', status: 'pending', icon: 'User', description: 'Personal loan', isActive: true }
  ],
  properties: [
    { id: '1', name: 'Laurindo', value: 230400, status: 'rented', currentRent: 1600, statusIcon: '✅', statusText: 'Alugado', prediction: 'Atual', rentRange: 'R$ 1.600' },
    { id: '2', name: 'Macuco (Moema)', value: 1050000, status: 'renovating', currentRent: 0, expectedRent: 6000, statusIcon: '🔄', statusText: 'Reformando', prediction: 'outubro/2025', rentRange: 'R$ 6.000' },
    { id: '3', name: 'Ataliba (comercial)', value: 206220, minValue: 172440, maxValue: 240000, status: 'planned', currentRent: 0, expectedRent: 1750, statusIcon: '📋', statusText: 'Planejado', prediction: '2027', rentRange: 'R$ 1.500-2.000' }
  ],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};
