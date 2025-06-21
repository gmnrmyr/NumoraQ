
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

  // Sort expenses: with dates chronologically first, without dates in middle
  const sortedExpenses = React.useMemo(() => {
    const withDates = expenses.filter(e => e.specificDate).sort((a, b) => new Date(a.specificDate).getTime() - new Date(b.specificDate).getTime());
    const withoutDates = expenses.filter(e => !e.specificDate);
    return [...withDates, ...withoutDates];
  }, [expenses]);

  return (
    <Card className={`${cardClass} border-2 backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className={`${titleClass} text-sm sm:text-base font-mono uppercase`}>
              {type === 'recurring' ? t.recurringExpenses : t.variableExpenses}
            </CardTitle>
            <div className={`text-lg sm:text-2xl font-bold ${totalClass} font-mono`}>
              $ {total.toLocaleString()}{type === 'recurring' ? `/${t.monthly.toLowerCase()}` : ` ${t.totalExpenses}`}
            </div>
            <div className={`text-xs ${inactiveClass} font-mono`}>
              {expenses.filter(e => e.status === 'inactive').length} {t.inactiveExpenses}
            </div>
          </div>
          <AddExpenseDialog
            isOpen={isAddingExpense}
            onOpenChange={setIsAddingExpense}
            onAddExpense={onAddExpense}
            categoryOptions={categoryOptions}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
