
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface IncomeBreakdownPanelProps {
  projectionData: any[];
  currencySymbol: string;
}

export const IncomeBreakdownPanel: React.FC<IncomeBreakdownPanelProps> = ({
  projectionData,
  currencySymbol
}) => {
  // Use month 1 if available to include variable expenses that trigger in the current month per projection logic
  const idx = projectionData && projectionData.length > 1 ? 1 : 0;
  const month = projectionData[idx] || {} as any;

  return (
    <Card className="bg-background/30 border-2 border-blue-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-400 flex items-center gap-2 text-sm font-mono uppercase">
          <DollarSign size={16} />
          Income Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-green-400">Passive Income</span>
            <span className="text-xs font-mono font-bold text-green-400">
              {currencySymbol} {(month.passiveIncome || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-blue-400">Active Income</span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {currencySymbol} {(month.activeIncome || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-red-400">Recurring Expenses</span>
            <span className="text-xs font-mono font-bold text-red-400">
              {currencySymbol} {(month.recurringExpenses || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono text-orange-400">Variable Expenses (this month)</span>
            <span className="text-xs font-mono font-bold text-orange-400">
              {currencySymbol} {(month.variableExpenses || 0).toLocaleString()}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold">Net Monthly</span>
            <span className={`text-xs font-mono font-bold ${(month.monthlyIncome - (month.monthlyExpenses || (month.recurringExpenses || 0) + (month.variableExpenses || 0))) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {((month.monthlyIncome - (month.monthlyExpenses || (month.recurringExpenses || 0) + (month.variableExpenses || 0))) >= 0 ? '+' : '')}{currencySymbol} {Math.round((month.monthlyIncome || 0) - (month.monthlyExpenses ?? ((month.recurringExpenses || 0) + (month.variableExpenses || 0)))).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
