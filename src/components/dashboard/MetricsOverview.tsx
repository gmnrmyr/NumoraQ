
import React from 'react';
import { Card } from '@/components/ui/card';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank, CreditCard } from 'lucide-react';

export const MetricsOverview = () => {
  const { data } = useFinancialData();

  const totalAssets = data.liquidAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0) +
                     data.illiquidAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
  
  const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalDebt = data.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalAssets - totalDebt;
  const monthlyCashFlow = totalIncome - totalExpenses;

  const currencySymbol = data.userProfile.currency === 'EUR' ? '€' : '$';

  const metrics = [
    {
      title: 'Net Worth',
      value: netWorth,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Assets',
      value: totalAssets,
      icon: PiggyBank,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Monthly Cash Flow',
      value: monthlyCashFlow,
      icon: monthlyCashFlow >= 0 ? TrendingUp : TrendingDown,
      color: monthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: monthlyCashFlow >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
    },
    {
      title: 'Total Debt',
      value: totalDebt,
      icon: CreditCard,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="brutalist-card bg-card border-2 border-border p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-mono text-muted-foreground uppercase tracking-wider">
                {metric.title}
              </p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold font-mono ${metric.color}`}>
                {currencySymbol}{Math.abs(metric.value).toLocaleString()}
                {metric.value < 0 && <span className="text-red-500 ml-1">-</span>}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
