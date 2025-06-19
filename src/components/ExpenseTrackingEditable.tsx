
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

  // Separate future and past expenses for better organization
  const currentVariableExpenses = variableExpenses.filter(expense => {
    if (!expense.specificDate) return true;
    const expenseMonth = expense.specificDate.slice(0, 7);
    return expenseMonth === currentMonth;
  });

  const futureVariableExpenses = variableExpenses
    .filter(expense => {
      if (!expense.specificDate) return false;
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth > currentMonth;
    })
    .sort((a, b) => (a.specificDate || '').localeCompare(b.specificDate || ''));

  const pastVariableExpenses = variableExpenses
    .filter(expense => {
      if (!expense.specificDate) return false;
      const expenseMonth = expense.specificDate.slice(0, 7);
      return expenseMonth < currentMonth;
    })
    .sort((a, b) => (b.specificDate || '').localeCompare(a.specificDate || ''));

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
            expenses={currentVariableExpenses}
            total={totalVariable}
            onUpdateExpense={updateExpense}
            onRemoveExpense={removeExpense}
            onAddExpense={addExpense}
            categoryOptions={categoryOptions}
            isAddingExpense={isAddingExpense}
            setIsAddingExpense={setIsAddingExpense}
          />
          
          {/* Show future expenses as editable cards */}
          {futureVariableExpenses.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 border-3 border-border brutalist-card">
              <h4 className="font-mono font-bold text-sm mb-3 text-blue-400 brutalist-heading">
                FUTURE SCHEDULED EXPENSES
              </h4>
              <div className="space-y-3">
                {futureVariableExpenses.map(expense => (
                  <ExpenseTabContent
                    key={expense.id}
                    type="variable"
                    expenses={[expense]}
                    total={0}
                    onUpdateExpense={updateExpense}
                    onRemoveExpense={removeExpense}
                    onAddExpense={addExpense}
                    categoryOptions={categoryOptions}
                    isAddingExpense={false}
                    setIsAddingExpense={() => {}}
                    hideAddButton={true}
                    hideTotal={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show past expenses as editable cards */}
          {pastVariableExpenses.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 border-3 border-border brutalist-card">
              <h4 className="font-mono font-bold text-sm mb-3 text-orange-400 brutalist-heading">
                PAST SCHEDULED EXPENSES
              </h4>
              <div className="space-y-3">
                {pastVariableExpenses.map(expense => (
                  <ExpenseTabContent
                    key={expense.id}
                    type="variable"
                    expenses={[expense]}
                    total={0}
                    onUpdateExpense={updateExpense}
                    onRemoveExpense={removeExpense}
                    onAddExpense={addExpense}
                    categoryOptions={categoryOptions}
                    isAddingExpense={false}
                    setIsAddingExpense={() => {}}
                    hideAddButton={true}
                    hideTotal={true}
                  />
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
