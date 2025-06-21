
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseCard } from "./ExpenseCard";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { useTranslation } from "@/contexts/TranslationContext";

interface ExpenseTabContentProps {
  type: 'recurring' | 'variable';
  expenses: any[];
  total: number;
  onUpdateExpense: (id: string, updates: any) => void;
  onRemoveExpense: (id: string) => void;
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  isAddingExpense: boolean;
  setIsAddingExpense: (open: boolean) => void;
}

export const ExpenseTabContent: React.FC<ExpenseTabContentProps> = ({
  type,
  expenses,
  total,
  onUpdateExpense,
  onRemoveExpense,
  onAddExpense,
  categoryOptions,
  isAddingExpense,
  setIsAddingExpense
}) => {
  const { t } = useTranslation();
  
  const cardClass = type === 'recurring' ? "bg-card border-red-600" : "bg-card border-orange-500";
  const titleClass = type === 'recurring' ? "text-red-400" : "text-orange-400";
  const totalClass = type === 'recurring' ? "text-red-400" : "text-orange-400";
  const inactiveClass = type === 'recurring' ? "text-red-400/70" : "text-orange-400/70";

  // Enhanced sorting for variable expenses with dates
  const sortedExpenses = React.useMemo(() => {
    if (type === 'recurring') {
      // Recurring expenses: simple sort by name or date if available
      return expenses.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;
        return a.name.localeCompare(b.name);
      });
    } else {
      // Variable expenses: sort by date (chronological), then no dates in middle
      const withDates = expenses.filter(e => e.date)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const withoutDates = expenses.filter(e => !e.date)
        .sort((a, b) => a.name.localeCompare(b.name));
      return [...withDates, ...withoutDates];
    }
  }, [expenses, type]);

  return (
    <Card className={`${cardClass} border-2 backdrop-blur-sm`}>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className={`${titleClass} text-xs sm:text-base font-mono uppercase break-words`}>
                {type === 'recurring' ? t.recurringExpenses : t.variableExpenses}
              </CardTitle>
              <div className={`text-base sm:text-2xl font-bold ${totalClass} font-mono break-words`}>
                $ {total.toLocaleString()}{type === 'recurring' ? `/${t.monthly.toLowerCase()}` : ` ${t.totalExpenses}`}
              </div>
              <div className={`text-xs ${inactiveClass} font-mono break-words`}>
                {expenses.filter(e => e.status === 'inactive').length} {t.inactiveExpenses}
              </div>
              {type === 'variable' && (
                <div className={`text-xs ${titleClass} font-mono mt-1 break-words`}>
                  💡 Tip: Set specific dates for better projections
                </div>
              )}
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <AddExpenseDialog
                isOpen={isAddingExpense}
                onOpenChange={setIsAddingExpense}
                onAddExpense={onAddExpense}
                categoryOptions={categoryOptions}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {sortedExpenses.map((expense) => (
          <ExpenseCard 
            key={expense.id} 
            expense={expense} 
            onUpdate={onUpdateExpense}
            onRemove={onRemoveExpense}
            categoryOptions={categoryOptions}
          />
        ))}
      </CardContent>
    </Card>
  );
};
