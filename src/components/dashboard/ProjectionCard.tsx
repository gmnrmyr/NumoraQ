
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, ChevronDown, ChevronUp } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ProjectionCard = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionCardCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('projectionCardCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

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

  // Calculate variable expenses that count in the projection (current month + no-date expenses)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthVariableExpenses = data.expenses
    .filter(expense => {
      if (expense.type !== 'variable' || expense.status !== 'active') return false;
      
      // If no specific date, it's a monthly variable expense
      if (!expense.specificDate) return true;
      
      // If specific date is in current month, include it
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate total variable expenses for the entire projection period
  const getAllVariableExpensesForProjection = () => {
    let totalVariableForPeriod = 0;
    const currentDate = new Date();
    
    for (let monthOffset = 0; monthOffset < data.projectionMonths; monthOffset++) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const targetMonth = targetDate.toISOString().slice(0, 7);
      
      const monthVariableExpenses = data.expenses
        .filter(expense => {
          if (expense.type !== 'variable' || expense.status !== 'active') return false;
          
          // If no specific date, it's a monthly variable expense (counts every month)
          if (!expense.specificDate) return true;
          
          // If specific date matches this month, include it
          const expenseMonth = expense.specificDate.slice(0, 7);
          return expenseMonth === targetMonth;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      totalVariableForPeriod += monthVariableExpenses;
    }
    
    return totalVariableForPeriod;
  };

  const totalVariableExpenses = getAllVariableExpensesForProjection();

  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
  const yearProjection = (monthlyBalance * data.projectionMonths) - totalVariableExpenses + totalAvailable - totalActiveDebt;

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <PieChart size={16} className="text-accent" />
            {data.projectionMonths}-{t.monthly?.toLowerCase() || 'month'} {t.projection || 'projection'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-accent hover:text-accent/80 p-1"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">{t.income || 'Income'} ({data.projectionMonths}m)</div>
              <div className="text-xs sm:text-sm md:text-xl font-bold text-accent truncate font-mono">
                {currencySymbol} {((totalPassiveIncome + totalActiveIncome) * data.projectionMonths).toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">{t.expenses || 'Expenses'} ({data.projectionMonths}m)</div>
              <div className="text-xs sm:text-sm md:text-xl font-bold text-red-400 truncate font-mono">
                {currencySymbol} {(totalRecurringExpenses * data.projectionMonths + totalVariableExpenses).toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">{t.debt || 'Debt'}</div>
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
      )}
    </Card>
  );
};
