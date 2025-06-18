
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
  
  const cardClass = type === 'recurring' ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200";
  const titleClass = type === 'recurring' ? "text-red-800" : "text-orange-800";
  const totalClass = type === 'recurring' ? "text-red-700" : "text-orange-700";
  const inactiveClass = type === 'recurring' ? "text-red-600" : "text-orange-600";

  return (
    <Card className={cardClass}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className={`${titleClass} text-sm sm:text-base`}>
              {type === 'recurring' ? t.recurringExpenses : t.variableExpenses}
            </CardTitle>
            <div className={`text-lg sm:text-2xl font-bold ${totalClass}`}>
              $ {total.toLocaleString()}{type === 'recurring' ? `/${t.monthly.toLowerCase()}` : ` ${t.totalExpenses}`}
            </div>
            <div className={`text-xs ${inactiveClass}`}>
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
        {expenses.map((expense) => (
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
