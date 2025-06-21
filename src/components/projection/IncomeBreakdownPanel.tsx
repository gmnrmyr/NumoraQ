
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
  );
};
