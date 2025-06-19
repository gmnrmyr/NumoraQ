
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { ExpenseCard } from "./ExpenseCard";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { Expense } from "@/contexts/financial-data/types";

interface ExpenseTabContentProps {
  type: 'recurring' | 'variable';
  expenses: Expense[];
  total: number;
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
  onRemoveExpense: (id: string) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  isAddingExpense: boolean;
  setIsAddingExpense: (adding: boolean) => void;
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
  const { data } = useFinancialData();

  const formatCurrency = (amount: number) => {
    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <Card className="bg-card/95 backdrop-blur-md border-2 border-border brutalist-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-accent font-mono uppercase text-sm sm:text-base">
            {type === 'recurring' ? t.recurringExpenses : t.variableExpenses} - {formatCurrency(total)}
          </CardTitle>
          <AddExpenseDialog
            type={type}
            onAddExpense={onAddExpense}
            categoryOptions={categoryOptions}
            isOpen={isAddingExpense}
            onOpenChange={setIsAddingExpense}
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
        
        {expenses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground font-mono">
            {t.noExpenses || "No expenses tracked yet. Add one to get started!"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
