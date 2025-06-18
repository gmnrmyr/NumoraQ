
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ProjectionCard = () => {
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
  
  const totalVariableExpenses = data.expenses
    .filter(expense => expense.type === 'variable' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
  const yearProjection = (monthlyBalance * data.projectionMonths) - totalVariableExpenses + totalAvailable - totalActiveDebt;

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
          <PieChart size={16} className="text-accent" />
          {data.projectionMonths}-{t.monthly.toLowerCase()} {t.projection}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-mono uppercase">{t.income} ({data.projectionMonths}m)</div>
            <div className="text-xs sm:text-sm md:text-xl font-bold text-accent truncate font-mono">
              {currencySymbol} {((totalPassiveIncome + totalActiveIncome) * data.projectionMonths).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-mono uppercase">{t.expenses} ({data.projectionMonths}m)</div>
            <div className="text-xs sm:text-sm md:text-xl font-bold text-red-400 truncate font-mono">
              {currencySymbol} {(totalRecurringExpenses * data.projectionMonths + totalVariableExpenses).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-mono uppercase">{t.debt}</div>
            <div className="text-xs sm:text-sm md:text-xl font-bold text-orange-400 truncate font-mono">
              {currencySymbol} {totalActiveDebt.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-mono uppercase">Net Result</div>
            <div className={`text-xs sm:text-sm md:text-xl font-bold truncate font-mono ${yearProjection >= 0 ? 'text-accent' : 'text-red-400'}`}>
              {currencySymbol} {yearProjection.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
