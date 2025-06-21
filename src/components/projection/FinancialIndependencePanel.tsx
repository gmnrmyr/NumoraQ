
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface FinancialIndependencePanelProps {
  fiRatio: number;
  monthsToFI: number;
}

export const FinancialIndependencePanel: React.FC<FinancialIndependencePanelProps> = ({
  fiRatio,
  monthsToFI
}) => {
  return (
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
  );
};
