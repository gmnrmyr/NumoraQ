
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { ExpenseTabContent } from "./expenses/ExpenseTabContent";
import { ExpenseSummaryCard } from "./expenses/ExpenseSummaryCard";

export const ExpenseTrackingEditable = () => {
  const { data, updateExpense, addExpense, removeExpense } = useFinancialData();
  const { t } = useTranslation();
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const recurringExpenses = data.expenses.filter(expense => expense.type === 'recurring');
  const variableExpenses = data.expenses.filter(expense => expense.type === 'variable');

  // Calculate monthly recurring expenses
  const totalRecurring = recurringExpenses
    .filter(expense => expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  // Calculate variable expenses (only those without specific dates or with current month dates count as monthly)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const totalVariable = variableExpenses
    .filter(expense => {
      if (expense.status !== 'active') return false;
      
      // If no specific date, it's a monthly variable expense
      if (!expense.specificDate) return true;
      
      // If specific date is in current month, include it
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate future dated variable expenses separately
  const futureVariableExpenses = variableExpenses
    .filter(expense => {
      if (expense.status !== 'active' || !expense.specificDate) return false;
      
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth > currentMonth;
    });

  // Calculate past dated variable expenses separately  
  const pastVariableExpenses = variableExpenses
    .filter(expense => {
      if (expense.status !== 'active' || !expense.specificDate) return false;
      
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth < currentMonth;
    });

  const categoryOptions = [
    { value: 'housing', label: t.housing },
    { value: 'health', label: t.health },
    { value: 'food', label: t.food },
    { value: 'transportation', label: t.transportation },
    { value: 'entertainment', label: t.entertainment },
    { value: 'utilities', label: t.utilities },
    { value: 'personal', label: t.personal },
    { value: 'travel', label: t.travel },
    { value: 'trips', label: t.trips },
    { value: 'other', label: t.other }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="recurring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring" className="text-xs sm:text-sm">{t.recurringExpenses}</TabsTrigger>
          <TabsTrigger value="variable" className="text-xs sm:text-sm">{t.variableExpenses}</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <ExpenseTabContent
            type="recurring"
            expenses={recurringExpenses}
            total={totalRecurring}
            onUpdateExpense={updateExpense}
            onRemoveExpense={removeExpense}
            onAddExpense={addExpense}
            categoryOptions={categoryOptions}
            isAddingExpense={isAddingExpense}
            setIsAddingExpense={setIsAddingExpense}
          />
        </TabsContent>

        <TabsContent value="variable" className="space-y-4">
          <ExpenseTabContent
            type="variable"
            expenses={variableExpenses.filter(e => !e.specificDate || e.specificDate.slice(0, 7) === currentMonth)}
            total={totalVariable}
            onUpdateExpense={updateExpense}
            onRemoveExpense={removeExpense}
            onAddExpense={addExpense}
            categoryOptions={categoryOptions}
            isAddingExpense={isAddingExpense}
            setIsAddingExpense={setIsAddingExpense}
          />
          
          {/* Show future expenses separately */}
          {futureVariableExpenses.length > 0 && (
            <div className="mt-4 p-3 bg-muted border-2 border-border">
              <h4 className="font-mono font-bold text-sm mb-2 text-blue-400">
                Future Scheduled Expenses:
              </h4>
              <div className="space-y-1 text-xs font-mono">
                {futureVariableExpenses.map(expense => (
                  <div key={expense.id} className="flex justify-between">
                    <span>{expense.name}</span>
                    <span className="text-blue-400">${expense.amount} on {expense.specificDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show past expenses separately */}
          {pastVariableExpenses.length > 0 && (
            <div className="mt-4 p-3 bg-muted border-2 border-border">
              <h4 className="font-mono font-bold text-sm mb-2 text-orange-400">
                Past Scheduled Expenses:
              </h4>
              <div className="space-y-1 text-xs font-mono">
                {pastVariableExpenses.map(expense => (
                  <div key={expense.id} className="flex justify-between">
                    <span>{expense.name}</span>
                    <span className="text-orange-400">${expense.amount} on {expense.specificDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ExpenseSummaryCard 
        totalRecurring={totalRecurring}
        totalVariable={totalVariable}
      />
    </div>
  );
};
