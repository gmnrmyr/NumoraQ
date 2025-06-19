
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ProjectionChart = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionChartCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('projectionChartCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const calculateProjection = () => {
    const months = data.projectionMonths;
    const projectionData = [];
    
    // Get current liquid assets
    const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
    const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Get monthly income and expenses
    const totalPassiveIncome = data.passiveIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalActiveIncome = data.activeIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalRecurringExpenses = data.expenses
      .filter(expense => expense.type === 'recurring' && expense.status === 'active')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
    
    // Calculate projection for each month
    let currentBalance = totalLiquid;
    
    for (let i = 0; i <= months; i++) {
      projectionData.push({
        month: i,
        balance: Math.round(currentBalance),
        monthlyIncome: totalPassiveIncome + totalActiveIncome,
        monthlyExpenses: totalRecurringExpenses,
        netChange: monthlyBalance,
        liquidAssets: totalLiquid
      });
      
      currentBalance += monthlyBalance;
    }
    
    return projectionData;
  };

  const projectionData = calculateProjection();
  const initialBalance = projectionData[0]?.balance || 0;
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const isPositiveProjection = finalBalance >= initialBalance;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <TrendingUp size={16} className="text-accent" />
            {t.projection || 'Financial Projection Chart'} - {data.projectionMonths} Months
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
                  formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Balance']}
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

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-2 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Initial</div>
              <div className="text-sm font-bold font-mono">
                {currencySymbol} {initialBalance.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-2 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Projected</div>
              <div className={`text-sm font-bold font-mono ${isPositiveProjection ? 'text-green-400' : 'text-red-400'}`}>
                {currencySymbol} {finalBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Detailed Monthly Projection Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-accent">Month</th>
                  <th className="text-right p-2 text-green-400">Income</th>
                  <th className="text-right p-2 text-red-400">Expenses</th>
                  <th className="text-right p-2 text-blue-400">Net</th>
                  <th className="text-right p-2 text-accent">Balance</th>
                </tr>
              </thead>
              <tbody>
                {projectionData.map((month, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-2">{index === 0 ? 'Current' : `Month ${index}`}</td>
                    <td className="text-right p-2 text-green-400">
                      {currencySymbol}{month.monthlyIncome.toLocaleString()}
                    </td>
                    <td className="text-right p-2 text-red-400">
                      -{currencySymbol}{month.monthlyExpenses.toLocaleString()}
                    </td>
                    <td className={`text-right p-2 ${month.netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {month.netChange >= 0 ? '+' : ''}{currencySymbol}{month.netChange.toLocaleString()}
                    </td>
                    <td className="text-right p-2 text-accent font-bold">
                      {currencySymbol}{month.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights Section */}
          <div className="mt-4 p-3 bg-muted/20 border-l-4 border-accent">
            <div className="text-xs font-mono text-muted-foreground">
              💡 <strong>Projection Insights:</strong>
              <br />
              • {isPositiveProjection ? 'Positive' : 'Negative'} growth trend over {data.projectionMonths} months
              <br />
              • Monthly net flow: {currencySymbol}{(projectionData[1]?.netChange || 0).toLocaleString()}
              <br />
              • Total projected change: {currencySymbol}{(finalBalance - initialBalance).toLocaleString()}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
