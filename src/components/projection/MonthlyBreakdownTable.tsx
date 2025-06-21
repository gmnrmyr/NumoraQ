
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronUp, ChevronDown } from "lucide-react";

interface MonthlyBreakdownTableProps {
  projectionData: any[];
  currencySymbol: string;
}

export const MonthlyBreakdownTable: React.FC<MonthlyBreakdownTableProps> = ({
  projectionData,
  currencySymbol
}) => {
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  return (
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
                  <th className="text-right p-2">Expenses</th>
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
                      {currencySymbol}{month.monthlyExpenses.toLocaleString()}
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
  );
};
