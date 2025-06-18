
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
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-slate-800 text-sm sm:text-base">{t.expenseSummary}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xs sm:text-sm text-slate-600">{t.monthly} {t.recurring} ({t.active})</div>
            <div className="text-lg sm:text-xl font-bold text-red-600">
              $ {totalRecurring.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              $ {(totalRecurring * 12).toLocaleString()}/{t.yearly.toLowerCase()}
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xs sm:text-sm text-slate-600">{t.variableExpenses} ({t.active})</div>
            <div className="text-lg sm:text-xl font-bold text-orange-600">
              $ {totalVariable.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">{t.oneTimeExpenses}</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
            <div className="text-xs sm:text-sm text-slate-600">{t.totalImpact} ({t.active})</div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              $ {(totalRecurring + totalVariable).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">{t.combinedActiveExpenses}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
