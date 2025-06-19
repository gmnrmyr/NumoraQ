
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
        balance: currentBalance,
      });
      
      currentBalance += monthlyBalance;
    }
    
    return projectionData;
  };

  const projectionData = calculateProjection();
  const initialBalance = projectionData[0]?.balance || 0;
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const isPositiveProjection = finalBalance >= initialBalance;

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <TrendingUp size={16} className="text-accent" />
            {t.projection || 'Financial Projection Chart'}
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
          <div className="h-64 w-full">
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
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
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
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Initial</div>
              <div className="text-sm font-bold font-mono">
                $ {initialBalance.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-2 bg-background/50 border-2 border-border">
              <div className="text-xs text-muted-foreground font-mono uppercase">Projected</div>
              <div className={`text-sm font-bold font-mono ${isPositiveProjection ? 'text-green-400' : 'text-red-400'}`}>
                $ {finalBalance.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
