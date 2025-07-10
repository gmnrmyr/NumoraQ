import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, BarChart3, Eye, EyeOff, Sparkles, Play } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/hooks/use-toast";

export const MetricsOverview = () => {
  const { data, updateData } = useFinancialData();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if user has no significant data
  const hasNoData = data.liquidAssets.length === 0 && 
                   data.expenses.length === 0 && 
                   data.passiveIncome.length === 0 && 
                   data.activeIncome.length === 0;

  // Calculate metrics
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const activePassiveIncome = data.passiveIncome.filter(income => income.status === 'active');
  const totalPassiveIncome = activePassiveIncome.reduce((sum, income) => sum + income.amount, 0);
  
  const activeActiveIncome = data.activeIncome.filter(income => income.status === 'active');
  const totalActiveIncome = activeActiveIncome.reduce((sum, income) => sum + income.amount, 0);
  
  // Calculate monthly expenses correctly: only recurring + unscheduled variable expenses
  const recurringExpenses = data.expenses.filter(expense => 
    expense.type === 'recurring' && expense.status === 'active'
  );
  const totalRecurringExpenses = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Only include variable expenses that are active AND have no specific date (unscheduled)
  const unscheduledVariableExpenses = data.expenses.filter(expense => 
    expense.type === 'variable' && 
    expense.status === 'active' && 
    !expense.specificDate
  );
  const totalUnscheduledVariableExpenses = unscheduledVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalExpenses = totalRecurringExpenses + totalUnscheduledVariableExpenses;
  
  const activeDebts = data.debts.filter(debt => debt.isActive && debt.status !== 'paid');
  const totalActiveDebts = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const totalIncome = totalPassiveIncome + totalActiveIncome;
  const availableNow = totalLiquid; // Available liquid assets
  const monthlyBalance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    return `${currency} ${Math.abs(amount).toLocaleString()}`;
  };

  const addDemoData = () => {
    const demoData = {
      liquidAssets: [
        { id: 'demo-1', name: 'Bitcoin', value: 45000, type: 'crypto', isActive: true },
        { id: 'demo-2', name: 'Ethereum', value: 15000, type: 'crypto', isActive: true },
        { id: 'demo-3', name: 'Cash Savings', value: 8000, type: 'cash', isActive: true },
        { id: 'demo-4', name: 'S&P 500 ETF', value: 12000, type: 'stocks', isActive: true },
      ],
      expenses: [
        { id: 'demo-exp-1', name: 'Rent', amount: 1200, type: 'recurring', status: 'active' },
        { id: 'demo-exp-2', name: 'Food', amount: 600, type: 'recurring', status: 'active' },
        { id: 'demo-exp-3', name: 'Utilities', amount: 200, type: 'recurring', status: 'active' },
        { id: 'demo-exp-4', name: 'Entertainment', amount: 300, type: 'variable', status: 'active' },
      ],
      passiveIncome: [
        { id: 'demo-inc-1', name: 'Dividend Income', amount: 400, frequency: 'monthly', status: 'active' },
        { id: 'demo-inc-2', name: 'Rental Income', amount: 800, frequency: 'monthly', status: 'active' },
      ],
      activeIncome: [
        { id: 'demo-inc-3', name: 'Salary', amount: 5000, frequency: 'monthly', status: 'active' },
        { id: 'demo-inc-4', name: 'Freelance', amount: 1500, frequency: 'monthly', status: 'active' },
      ],
      debts: [
        { id: 'demo-debt-1', name: 'Credit Card', amount: 2500, isActive: true, status: 'active' },
        { id: 'demo-debt-2', name: 'Student Loan', amount: 15000, isActive: true, status: 'active' },
      ]
    };

    updateData(demoData);
    toast({
      title: "Demo Data Added! 🎉",
      description: "Explore the dashboard with sample financial data. You can edit or replace it anytime.",
    });
  };

  const metrics = [
    {
      title: t.availableNow,
      value: availableNow,
      icon: DollarSign,
      description: `${activeLiquidAssets.length} ${t.liquidAssets.toLowerCase()}`,
      color: "text-blue-500",
      borderColor: "border-blue-500"
    },
    {
      title: t.monthlyIncome,
      value: totalIncome,
      icon: TrendingUp,
      description: `${formatCurrency(totalPassiveIncome)} ${t.passiveIncome.toLowerCase()} + ${formatCurrency(totalActiveIncome)} ${t.activeIncome.toLowerCase()}`,
      color: "text-green-500",
      borderColor: "border-green-500"
    },
    {
      title: t.monthlyExpenses,
      value: totalExpenses,
      icon: TrendingDown,
      description: `${recurringExpenses.length + unscheduledVariableExpenses.length} ${t.active.toLowerCase()} ${t.expenses.toLowerCase()}`,
      color: "text-red-500",
      borderColor: "border-red-500"
    },
    {
      title: t.activeDebts,
      value: totalActiveDebts,
      icon: CreditCard,
      description: `${activeDebts.length} ${t.pending.toLowerCase()} ${t.debt.toLowerCase()}`,
      color: "text-orange-500",
      borderColor: "border-orange-500"
    },
    {
      title: t.monthlyBalance,
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
          {t.overview.toUpperCase()}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-2 border-border hover:bg-accent"
        >
          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="ml-2 font-mono text-xs">
            {isExpanded ? t.hide.toUpperCase() : t.show.toUpperCase()}
          </span>
        </Button>
      </div>

      {/* Demo Data Section for New Users */}
      {hasNoData && isExpanded && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold font-mono text-blue-900 uppercase">
                {t.welcomeToNumoraq}
              </h3>
              <p className="text-sm text-blue-800 font-mono max-w-md mx-auto">
                {t.demoDataDescription}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={addDemoData}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                >
                  <Play size={16} className="mr-2" />
                  {t.addDemoData}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="border-blue-300 text-blue-700 font-mono"
                >
                  {t.addMyOwn}
                </Button>
              </div>
              <p className="text-xs text-blue-600 font-mono">
                💡 {t.proTip}: Use the portfolio section below to start adding your real assets
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
