
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
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-green-700 flex items-center gap-1 sm:gap-2">
            <DollarSign size={12} />
            <span className="hidden sm:inline">{t.availableNow}</span>
            <span className="sm:hidden truncate">Available</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-green-800 truncate">
            {currencySymbol} {totalAvailable.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 flex items-center gap-1 sm:gap-2">
            <TrendingUp size={12} />
            <span className="hidden sm:inline">{t.monthlyIncome}</span>
            <span className="sm:hidden truncate">Income</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-blue-800 truncate">
            {currencySymbol} {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-red-700 flex items-center gap-1 sm:gap-2">
            <TrendingDown size={12} />
            <span className="hidden sm:inline">{t.monthlyExpenses}</span>
            <span className="sm:hidden truncate">Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-red-800 truncate">
            {currencySymbol} {totalRecurringExpenses.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-orange-700 flex items-center gap-1 sm:gap-2">
            <AlertCircle size={12} />
            <span className="hidden sm:inline">{t.activeDebts}</span>
            <span className="sm:hidden truncate">Debts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm sm:text-lg md:text-2xl font-bold text-orange-800 truncate">
            {currencySymbol} {totalActiveDebt.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className={`col-span-2 lg:col-span-1 ${monthlyBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${monthlyBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            <BarChart3 size={12} />
            <span className="hidden sm:inline">{t.monthlyBalance}</span>
            <span className="sm:hidden truncate">Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm sm:text-lg md:text-2xl font-bold truncate ${monthlyBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            {currencySymbol} {monthlyBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
