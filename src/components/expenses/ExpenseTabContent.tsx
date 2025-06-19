
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseCard } from "./ExpenseCard";
import { VariableExpenseCard } from "./VariableExpenseCard";
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

  // Separate expenses by date status for variable expenses
  const separatedExpenses = type === 'variable' ? {
    past: expenses.filter(e => {
      if (!e.specificDate) return false;
      const expenseDate = new Date(e.specificDate);
      const today = new Date();
      return expenseDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }),
    today: expenses.filter(e => {
      if (!e.specificDate) return false;
      const expenseDate = new Date(e.specificDate);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const expenseDateStart = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
      return expenseDateStart.getTime() === todayStart.getTime();
    }),
    future: expenses.filter(e => {
      if (!e.specificDate) return false;
      const expenseDate = new Date(e.specificDate);
      const today = new Date();
      return expenseDate > new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }),
    noDate: expenses.filter(e => !e.specificDate)
  } : null;

  return (
    <Card className={`${cardClass} border-3 backdrop-blur-none brutalist-card`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className={`${titleClass} text-sm sm:text-base font-mono uppercase brutalist-heading`}>
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
            type={type}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {type === 'variable' && separatedExpenses ? (
          <div className="space-y-4">
            {/* Today's expenses */}
            {separatedExpenses.today.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-green-400 mb-2">⭐ Due Today</h4>
                <div className="space-y-2">
                  {separatedExpenses.today.map((expense) => (
                    <VariableExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onUpdate={onUpdateExpense}
                      onRemove={onRemoveExpense}
                      categoryOptions={categoryOptions}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Future expenses */}
            {separatedExpenses.future.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-blue-400 mb-2">⏰ Upcoming</h4>
                <div className="space-y-2">
                  {separatedExpenses.future.map((expense) => (
                    <VariableExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onUpdate={onUpdateExpense}
                      onRemove={onRemoveExpense}
                      categoryOptions={categoryOptions}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Past expenses */}
            {separatedExpenses.past.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-red-400 mb-2">📅 Past</h4>
                <div className="space-y-2">
                  {separatedExpenses.past.map((expense) => (
                    <VariableExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onUpdate={onUpdateExpense}
                      onRemove={onRemoveExpense}
                      categoryOptions={categoryOptions}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* No date expenses */}
            {separatedExpenses.noDate.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-orange-400 mb-2">❓ No Date</h4>
                <div className="space-y-2">
                  {separatedExpenses.noDate.map((expense) => (
                    <VariableExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      onUpdate={onUpdateExpense}
                      onRemove={onRemoveExpense}
                      categoryOptions={categoryOptions}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Recurring expenses (original layout)
          expenses.map((expense) => (
            <ExpenseCard 
              key={expense.id} 
              expense={expense} 
              onUpdate={onUpdateExpense}
              onRemove={onRemoveExpense}
              categoryOptions={categoryOptions}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
