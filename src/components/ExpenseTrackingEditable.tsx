
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

  const totalRecurring = recurringExpenses
    .filter(expense => expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  // Only count variable expenses that are scheduled for current month or have no date
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const totalVariable = variableExpenses
    .filter(expense => {
      if (expense.status !== 'active') return false;
      
      // If no specific date, count as monthly
      if (!expense.specificDate) return true;
      
      // If has specific date, only count if it's in current month
      const expenseDate = new Date(expense.specificDate);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

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
            expenses={variableExpenses}
            total={totalVariable}
            onUpdateExpense={updateExpense}
            onRemoveExpense={removeExpense}
            onAddExpense={addExpense}
            categoryOptions={categoryOptions}
            isAddingExpense={isAddingExpense}
            setIsAddingExpense={setIsAddingExpense}
          />
        </TabsContent>
      </Tabs>

      <ExpenseSummaryCard 
        totalRecurring={totalRecurring}
        totalVariable={totalVariable}
      />
    </div>
  );
};
