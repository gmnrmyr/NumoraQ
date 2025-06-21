
import React from 'react';
import { useFinancialData } from "@/contexts/FinancialDataContext";

interface ProjectionMetricsProps {
  initialBalance: number;
  finalBalance: number;
  totalGrowth: number;
  monthlyAverage: number;
  isPositiveProjection: boolean;
  currencySymbol: string;
}

export const ProjectionMetrics: React.FC<ProjectionMetricsProps> = ({
  initialBalance,
  finalBalance,
  totalGrowth,
  monthlyAverage,
  isPositiveProjection,
  currencySymbol
}) => {
  const { data } = useFinancialData();

  return (
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
  );
};
