
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface RiskAssessmentPanelProps {
  initialBalance: number;
  monthlyExpenses: number;
  fiRatio: number;
  isPositiveProjection: boolean;
  totalGrowth: number;
  projectionMonths: number;
}

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  initialBalance,
  monthlyExpenses,
  fiRatio,
  isPositiveProjection,
  totalGrowth,
  projectionMonths
}) => {
  return (
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
              {Math.abs((totalGrowth / initialBalance) * 100).toFixed(1)}% over {projectionMonths}m
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
