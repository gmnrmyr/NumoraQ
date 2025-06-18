
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";

interface ExpenseSummaryCardProps {
  totalRecurring: number;
  totalVariable: number;
}

export const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({
  totalRecurring,
  totalVariable
}) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-card border-red-600 border-2">
      <CardHeader>
        <CardTitle className="text-foreground text-sm sm:text-base font-mono uppercase">{t.expenseSummary}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 sm:p-4 bg-background border-2 border-border brutalist-card">
            <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase">{t.monthly} {t.recurring} ({t.active})</div>
            <div className="text-lg sm:text-xl font-bold text-red-400 font-mono">
              $ {totalRecurring.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              $ {(totalRecurring * 12).toLocaleString()}/{t.yearly.toLowerCase()}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-background border-2 border-border brutalist-card">
            <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase">{t.variableExpenses} ({t.active})</div>
            <div className="text-lg sm:text-xl font-bold text-orange-400 font-mono">
              $ {totalVariable.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-mono">{t.oneTimeExpenses}</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-background border-2 border-accent brutalist-card">
            <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase">{t.totalImpact} ({t.active})</div>
            <div className="text-xl sm:text-2xl font-bold text-accent font-mono">
              $ {(totalRecurring + totalVariable).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-mono">{t.combinedActiveExpenses}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
