
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { ExpenseCard } from "./ExpenseCard";
import { AddExpenseDialog } from "./AddExpenseDialog";

interface ExpenseTabContentProps {
  type: 'recurring' | 'variable';
  expenses: any[];
  total: number;
  onUpdateExpense: (id: string, updates: any) => void;
  onRemoveExpense: (id: string) => void;
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  isAddingExpense: boolean;
  setIsAddingExpense: (adding: boolean) => void;
  hideAddButton?: boolean;
  hideTotal?: boolean;
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
  setIsAddingExpense,
  hideAddButton = false,
  hideTotal = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {!hideTotal && (
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-accent font-mono brutalist-heading">
            Monthly Total: ${total.toFixed(2)}
          </div>
          {!hideAddButton && (
            <Button 
              onClick={() => setIsAddingExpense(true)}
              size="sm" 
              className="brutalist-button"
            >
              <Plus size={16} className="mr-1" />
              {type === 'recurring' ? `Add ${t.recurring}` : `Add ${t.variable}`}
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onUpdate={onUpdateExpense}
            onRemove={onRemoveExpense}
            categoryOptions={categoryOptions}
          />
        ))}
        
        {expenses.length === 0 && !hideAddButton && (
          <div className="text-center py-8 text-muted-foreground font-mono">
            <p className="brutalist-heading">No {type} expenses yet</p>
            <p className="text-xs mt-2">Add your first {type} expense to start tracking</p>
          </div>
        )}
      </div>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        type={type}
        onAddExpense={onAddExpense}
        categoryOptions={categoryOptions}
        isOpen={isAddingExpense}
        onOpenChange={setIsAddingExpense}
      />
    </div>
  );
};
