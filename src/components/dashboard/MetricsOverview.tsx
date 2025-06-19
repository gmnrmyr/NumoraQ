
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull, Bot, Zap } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const MetricsOverview = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();

  // Calculate metrics
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const activePassiveIncome = data.passiveIncome.filter(income => income.status === 'active');
  const totalPassiveIncome = activePassiveIncome.reduce((sum, income) => sum + income.amount, 0);
  
  const activeActiveIncome = data.activeIncome.filter(income => income.status === 'active');
  const totalActiveIncome = activeActiveIncome.reduce((sum, income) => sum + income.amount, 0);
  
  const activeExpenses = data.expenses.filter(expense => expense.status === 'active');
  const totalExpenses = activeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalIncome = totalPassiveIncome + totalActiveIncome;
  const netWorth = totalLiquid + totalIlliquid;
  const monthlyCashFlow = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    return `${currency} ${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Net Worth */}
      <Card className="bg-card/80 backdrop-blur-sm border-accent border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-mono uppercase text-accent">
            {t.netWorth || 'Net Worth'}
          </CardTitle>
          <Bot className="h-6 w-6 text-accent animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-accent">
            {formatCurrency(netWorth)}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {activeLiquidAssets.length + activeIlliquidAssets.length} active assets
          </p>
        </CardContent>
      </Card>

      {/* Monthly Cash Flow */}
      <Card className="bg-card/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300"
            style={{ 
              borderColor: monthlyCashFlow >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' 
            }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-mono uppercase"
                     style={{ 
                       color: monthlyCashFlow >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' 
                     }}>
            Monthly Flow
          </CardTitle>
          {monthlyCashFlow >= 0 ? (
            <Zap className="h-6 w-6 text-green-500 animate-bounce" />
          ) : (
            <Skull className="h-6 w-6 text-red-500 animate-pulse" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono"
               style={{ 
                 color: monthlyCashFlow >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' 
               }}>
            {monthlyCashFlow >= 0 ? '+' : '-'}{formatCurrency(monthlyCashFlow)}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {formatCurrency(totalIncome)} in - {formatCurrency(totalExpenses)} out
          </p>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="bg-card/80 backdrop-blur-sm border-green-500 border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-mono uppercase text-green-500">
            Monthly Income
          </CardTitle>
          <Bot className="h-6 w-6 text-green-500" style={{ filter: 'hue-rotate(120deg)' }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-green-500">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {formatCurrency(totalPassiveIncome)} passive + {formatCurrency(totalActiveIncome)} active
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
