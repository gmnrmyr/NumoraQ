import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const MetricsOverview = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalAvailable = totalLiquid;
  
  const totalPassiveIncome = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalActiveIncome = data.activeIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalRecurringExpenses = data.expenses
    .filter(expense => expense.type === 'recurring' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
      <Card className="bg-card/80 backdrop-blur-sm border-green-500 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-green-400 flex items-center gap-1 sm:gap-2 font-mono uppercase">
            <DollarSign size={12} />
            <span className="hidden sm:inline">{t.availableNow}</span>
            <span className="sm:hidden truncate">Available</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-green-400 truncate font-mono">
            {currencySymbol} {totalAvailable.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-blue-500 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-blue-400 flex items-center gap-1 sm:gap-2 font-mono uppercase">
            <TrendingUp size={12} />
            <span className="hidden sm:inline">{t.monthlyIncome}</span>
            <span className="sm:hidden truncate">Income</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-blue-400 truncate font-mono">
            {currencySymbol} {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-red-500 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-red-400 flex items-center gap-1 sm:gap-2 font-mono uppercase">
            <TrendingDown size={12} />
            <span className="hidden sm:inline">{t.monthlyExpenses}</span>
            <span className="sm:hidden truncate">Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-red-400 truncate font-mono">
            {currencySymbol} {totalRecurringExpenses.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-orange-500 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-orange-400 flex items-center gap-1 sm:gap-2 font-mono uppercase">
            <AlertCircle size={12} />
            <span className="hidden sm:inline">{t.activeDebts}</span>
            <span className="sm:hidden truncate">Debts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-orange-400 truncate font-mono">
            {currencySymbol} {totalActiveDebt.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className={`col-span-2 lg:col-span-1 bg-card/80 backdrop-blur-sm border-2 ${monthlyBalance >= 0 ? 'border-accent' : 'border-red-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 font-mono uppercase ${monthlyBalance >= 0 ? 'text-accent' : 'text-red-400'}`}>
            <BarChart3 size={12} />
            <span className="hidden sm:inline">{t.monthlyBalance}</span>
            <span className="sm:hidden truncate">Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm sm:text-lg md:text-2xl font-bold truncate font-mono ${monthlyBalance >= 0 ? 'text-accent' : 'text-red-400'}`}>
            {currencySymbol} {monthlyBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
