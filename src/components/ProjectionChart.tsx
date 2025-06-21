
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, ChevronDown, ChevronUp, DollarSign, Calendar, Target, AlertTriangle, BarChart3 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ProjectionChart = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionChartCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  useEffect(() => {
    localStorage.setItem('projectionChartCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const calculateProjection = () => {
    const months = data.projectionMonths;
    const projectionData = [];
    
    // Get current liquid assets (only active ones)
    const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
    const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Get monthly income and expenses (only active ones)
    const totalPassiveIncome = data.passiveIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalActiveIncome = data.activeIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalRecurringExpenses = data.expenses
      .filter(expense => expense.type === 'recurring' && expense.status === 'active')
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Helper function to get variable expenses for a specific month
    const getVariableExpensesForMonth = (monthOffset: number) => {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const targetMonth = targetDate.toISOString().slice(0, 7); // YYYY-MM format
      
      return data.expenses
        .filter(expense => {
          if (expense.type !== 'variable' || expense.status !== 'active') return false;
          
          // If no specific date, it's a monthly variable expense (triggers every month)
          if (!expense.specificDate) return true;
          
          // If specific date matches this month, include it
          const expenseMonth = expense.specificDate.slice(0, 7);
          return expenseMonth === targetMonth;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
    };
    
    const monthlyNetIncome = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
    
    // Calculate projection for each month
    let runningBalance = totalLiquid;
    
    // Add current month (month 0)
    const currentMonthVariableExpenses = getVariableExpensesForMonth(0);
    projectionData.push({
      month: 0,
      balance: Math.round(runningBalance),
      monthlyIncome: totalPassiveIncome + totalActiveIncome,
      monthlyExpenses: totalRecurringExpenses + currentMonthVariableExpenses,
      netChange: 0,
      passiveIncome: totalPassiveIncome,
      activeIncome: totalActiveIncome,
      recurringExpenses: totalRecurringExpenses,
      variableExpenses: currentMonthVariableExpenses,
      cumulativeGrowth: 0,
      balanceChange: 0
    });
    
    // Calculate future months
    for (let i = 1; i <= months; i++) {
      const previousBalance = runningBalance;
      
      // Get variable expenses for this specific month
      const variableExpensesThisMonth = getVariableExpensesForMonth(i);
      const monthlyChange = monthlyNetIncome - variableExpensesThisMonth;
      
      runningBalance += monthlyChange;
      
      projectionData.push({
        month: i,
        balance: Math.round(runningBalance),
        monthlyIncome: totalPassiveIncome + totalActiveIncome,
        monthlyExpenses: totalRecurringExpenses + variableExpensesThisMonth,
        netChange: monthlyChange,
        passiveIncome: totalPassiveIncome,
        activeIncome: totalActiveIncome,
        recurringExpenses: totalRecurringExpenses,
        variableExpenses: variableExpensesThisMonth,
        cumulativeGrowth: runningBalance - totalLiquid,
        balanceChange: runningBalance - previousBalance
      });
    }
    
    return projectionData;
  };

  const projectionData = calculateProjection();
  const initialBalance = projectionData[0]?.balance || 0;
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const isPositiveProjection = finalBalance >= initialBalance;
  const totalGrowth = finalBalance - initialBalance;
  const monthlyAverage = totalGrowth / data.projectionMonths;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

  // Financial Independence calculations
  const monthlyExpenses = data.expenses
    .filter(expense => expense.type === 'recurring' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const passiveIncome = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);

  const fiRatio = monthlyExpenses > 0 ? (passiveIncome / monthlyExpenses) * 100 : 0;
  const monthsToFI = passiveIncome < monthlyExpenses && monthlyAverage > 0 
    ? Math.ceil((monthlyExpenses * 25 - initialBalance) / monthlyAverage) 
    : 0;

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <TrendingUp size={16} className="text-accent" />
            Advanced Financial Projection - {data.projectionMonths} Months
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
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Current Balance</div>
              <div className="text-lg font-bold font-mono text-accent">
                {currencySymbol} {initialBalance.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Projected ({data.projectionMonths}m)</div>
              <div className={`text-lg font-bold font-mono ${isPositiveProjection ? 'text-green-400' : 'text-red-400'}`}>
                {currencySymbol} {finalBalance.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Total Growth</div>
              <div className={`text-lg font-bold font-mono ${totalGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGrowth >= 0 ? '+' : ''}{currencySymbol} {totalGrowth.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Monthly Avg</div>
              <div className={`text-lg font-bold font-mono ${monthlyAverage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {monthlyAverage >= 0 ? '+' : ''}{currencySymbol} {Math.round(monthlyAverage).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Financial Independence Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card className="bg-background/30 border-2 border-purple-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 flex items-center gap-2 text-sm font-mono uppercase">
                  <Target size={16} />
                  Financial Independence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-muted-foreground">FI Ratio</span>
                    <span className={`font-mono font-bold ${fiRatio >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {fiRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded">
                    <div 
                      className={`h-2 rounded transition-all ${fiRatio >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={{ width: `${Math.min(fiRatio, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {fiRatio >= 100 ? '🎉 Financially Independent!' : 
                     fiRatio >= 75 ? '🚀 Almost there!' :
                     fiRatio >= 50 ? '📈 Good progress!' :
                     fiRatio >= 25 ? '🌱 Building momentum!' : '🎯 Starting journey'}
                  </div>
                  {monthsToFI > 0 && monthsToFI < 1200 && (
                    <div className="text-xs font-mono text-accent">
                      Est. {monthsToFI} months to FI ({Math.ceil(monthsToFI/12)} years)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/30 border-2 border-blue-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 flex items-center gap-2 text-sm font-mono uppercase">
                  <DollarSign size={16} />
                  Income Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-green-400">Passive Income</span>
                    <span className="text-xs font-mono font-bold text-green-400">
                      {currencySymbol} {projectionData[0]?.passiveIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-blue-400">Active Income</span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {currencySymbol} {projectionData[0]?.activeIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-red-400">Recurring Expenses</span>
                    <span className="text-xs font-mono font-bold text-red-400">
                      {currencySymbol} {projectionData[0]?.recurringExpenses.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="text-xs font-mono font-bold">Net Monthly</span>
                    <span className={`text-xs font-mono font-bold ${projectionData[1]?.netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {projectionData[1]?.netChange >= 0 ? '+' : ''}{currencySymbol} {Math.round(projectionData[1]?.netChange || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  label={{ 
                    value: 'Months', 
                    position: 'insideBottomRight', 
                    offset: -10,
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 12
                  }}
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Balance', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 12
                  }}
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid #333',
                    borderRadius: 0,
                    color: '#fff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12
                  }}
                  formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, 'Balance']}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke={isPositiveProjection ? "#00ff00" : "#ff0066"} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
                  activeDot={{ r: 5, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Detail Table - Optional */}
          <Card className="bg-background/30 border-2 border-cyan-600 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-400 flex items-center gap-2 text-sm font-mono uppercase">
                  <BarChart3 size={16} />
                  Monthly Breakdown
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailedTable(!showDetailedTable)}
                  className="text-cyan-400 hover:text-cyan-300 p-1"
                >
                  {showDetailedTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </div>
            </CardHeader>
            {showDetailedTable && (
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">Month</th>
                        <th className="text-right p-2">Income</th>
                        <th className="text-right p-2">Recurring</th>
                        <th className="text-right p-2">Variable</th>
                        <th className="text-right p-2">Net</th>
                        <th className="text-right p-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectionData.slice(0, Math.min(12, projectionData.length)).map((month) => (
                        <tr key={month.month} className="border-b border-border/50">
                          <td className="p-2">{month.month === 0 ? 'Current' : `Month ${month.month}`}</td>
                          <td className="text-right p-2 text-green-400">
                            {currencySymbol}{month.monthlyIncome.toLocaleString()}
                          </td>
                          <td className="text-right p-2 text-red-400">
                            {currencySymbol}{month.recurringExpenses.toLocaleString()}
                          </td>
                          <td className="text-right p-2 text-orange-400">
                            {currencySymbol}{(month.variableExpenses || 0).toLocaleString()}
                          </td>
                          <td className={`text-right p-2 ${month.netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {month.netChange >= 0 ? '+' : ''}{currencySymbol}{Math.round(month.netChange).toLocaleString()}
                          </td>
                          <td className="text-right p-2 text-accent font-bold">
                            {currencySymbol}{month.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Risk Assessment Panel */}
          <Card className="bg-background/30 border-2 border-yellow-600 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm font-mono uppercase">
                <AlertTriangle size={16} />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Emergency Fund</div>
                  <div className={`font-mono font-bold ${initialBalance >= (monthlyExpenses * 6) ? 'text-green-400' : 'text-yellow-400'}`}>
                    {monthlyExpenses > 0 ? `${(initialBalance / monthlyExpenses).toFixed(1)} months` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {initialBalance >= (monthlyExpenses * 6) ? '✅ Well covered' : '⚠️ Consider building'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Income Stability</div>
                  <div className={`font-mono font-bold ${fiRatio >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {fiRatio >= 75 ? 'High' : fiRatio >= 50 ? 'Medium' : fiRatio >= 25 ? 'Low' : 'Very Low'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Passive income ratio
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Growth Trend</div>
                  <div className={`font-mono font-bold ${isPositiveProjection ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositiveProjection ? 'Positive' : 'Negative'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {Math.abs((totalGrowth / initialBalance) * 100).toFixed(1)}% over {data.projectionMonths}m
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/20 border-l-4 border-accent">
            <div className="text-xs font-mono text-muted-foreground">
              💡 <strong>AI Insights:</strong>
              <br />
              • {isPositiveProjection ? 'Positive' : 'Negative'} growth trajectory over {data.projectionMonths} months
              <br />
              • Monthly net flow: {currencySymbol}{Math.round(projectionData[1]?.netChange || 0).toLocaleString()}
              <br />
              • Total projected change: {currencySymbol}{totalGrowth.toLocaleString()}
              <br />
              • {fiRatio >= 100 ? 'Congratulations! You\'ve achieved financial independence!' :
                 fiRatio >= 75 ? 'You\'re very close to financial independence!' :
                 fiRatio >= 50 ? 'You\'re making good progress towards financial independence.' :
                 fiRatio >= 25 ? 'Consider increasing passive income or reducing expenses.' :
                 'Focus on building passive income streams for long-term stability.'}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
