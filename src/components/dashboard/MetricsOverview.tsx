
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, BarChart3, Eye, EyeOff } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const MetricsOverview = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

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
  
  const activeDebts = data.debts.filter(debt => debt.isActive && debt.status !== 'paid');
  const totalActiveDebts = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const totalIncome = totalPassiveIncome + totalActiveIncome;
  const availableNow = totalLiquid; // Available liquid assets
  const monthlyBalance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    return `${currency} ${Math.abs(amount).toLocaleString()}`;
  };

  const metrics = [
    {
      title: "Available Now",
      value: availableNow,
      icon: DollarSign,
      description: `${activeLiquidAssets.length} liquid assets`,
      color: "text-blue-500",
      borderColor: "border-blue-500"
    },
    {
      title: "Monthly Income",
      value: totalIncome,
      icon: TrendingUp,
      description: `${formatCurrency(totalPassiveIncome)} passive + ${formatCurrency(totalActiveIncome)} active`,
      color: "text-green-500",
      borderColor: "border-green-500"
    },
    {
      title: "Monthly Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      description: `${activeExpenses.length} active expenses`,
      color: "text-red-500",
      borderColor: "border-red-500"
    },
    {
      title: "Active Debts",
      value: totalActiveDebts,
      icon: CreditCard,
      description: `${activeDebts.length} pending debts`,
      color: "text-orange-500",
      borderColor: "border-orange-500"
    },
    {
      title: "Monthly Balance",
      value: monthlyBalance,
      icon: BarChart3,
      description: `${formatCurrency(totalIncome)} in - ${formatCurrency(totalExpenses)} out`,
      color: monthlyBalance >= 0 ? "text-green-500" : "text-red-500",
      borderColor: monthlyBalance >= 0 ? "border-green-500" : "border-red-500"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-mono uppercase text-foreground">
          OVERVIEW
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-2 border-border hover:bg-accent"
        >
          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="ml-2 font-mono text-xs">
            {isExpanded ? 'HIDE' : 'SHOW'}
          </span>
        </Button>
      </div>

      {/* Metrics Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className={`bg-card/80 backdrop-blur-sm border-2 ${metric.borderColor} hover:shadow-lg transition-all duration-300`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium font-mono uppercase ${metric.color}`}>
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-xl sm:text-2xl font-bold font-mono ${metric.color}`}>
                    {metric.value >= 0 && metric.title === "Monthly Balance" ? '+' : ''}
                    {metric.value < 0 && metric.title === "Monthly Balance" ? '-' : ''}
                    {formatCurrency(metric.value)}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
