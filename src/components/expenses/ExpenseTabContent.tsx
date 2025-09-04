
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Sorting controls (variable expenses only)
  const hasAnySpecificDate = React.useMemo(() => {
    return type === 'variable' && expenses.some((e: any) => !!e.specificDate);
  }, [expenses, type]);
  const [sortField, setSortField] = React.useState<'date' | 'amount' | 'name'>(hasAnySpecificDate ? 'date' : 'name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [userAdjustedSort, setUserAdjustedSort] = React.useState(false);

  // Auto-switch to date sort when any specificDate exists and user hasn't overridden
  React.useEffect(() => {
    if (type === 'variable' && hasAnySpecificDate && !userAdjustedSort && sortField !== 'date') {
      setSortField('date');
    }
  }, [type, hasAnySpecificDate, userAdjustedSort, sortField]);

  // Enhanced sorting for variable expenses with dates (non-mutating)
  const sortedExpenses = React.useMemo(() => {
    const copy = [...expenses];
    if (type === 'recurring') {
      // Recurring expenses: simple sort by name or date if available (non-mutating)
      return copy.sort((a: any, b: any) => {
        if (a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;
        return (a.name || '').localeCompare(b.name || '');
      });
    }

    const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'date') {
      const withDates = copy
        .filter((e: any) => !!e.specificDate)
        .sort((a: any, b: any) => {
          const aTime = new Date(a.specificDate).getTime();
          const bTime = new Date(b.specificDate).getTime();
          return (aTime - bTime) * directionMultiplier;
        });
      const withoutDates = copy
        .filter((e: any) => !e.specificDate)
        .sort((a: any, b: any) => ((a.name || '').localeCompare(b.name || '')) * directionMultiplier);
      return [...withDates, ...withoutDates];
    }

    if (sortField === 'amount') {
      return copy.sort((a: any, b: any) => (((a.amount || 0) - (b.amount || 0)) * directionMultiplier));
    }

    // Default: sort by name
    return copy.sort((a: any, b: any) => ((a.name || '').localeCompare(b.name || '') * directionMultiplier));
  }, [expenses, type, sortField, sortDirection]);

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
                <>
                  <div className={`text-xs ${titleClass} font-mono mt-1 break-words`}>
                    💡 Tip: Set specific dates for better projections
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs ${inactiveClass} font-mono`}>{t.sortBy}:</span>
                    <Select value={sortField} onValueChange={(v) => { setSortField(v as 'date' | 'amount' | 'name'); setUserAdjustedSort(true); }}>
                      <SelectTrigger className="h-6 w-28 text-xs bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-2 border-border z-50">
                        <SelectItem value="date" className="font-mono">{t.sortByDate}</SelectItem>
                        <SelectItem value="amount" className="font-mono">{t.sortByAmount}</SelectItem>
                        <SelectItem value="name" className="font-mono">{t.sortByName}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortDirection} onValueChange={(v) => { setSortDirection(v as 'asc' | 'desc'); setUserAdjustedSort(true); }}>
                      <SelectTrigger className="h-6 w-28 text-xs bg-input border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-2 border-border z-50">
                        <SelectItem value="asc" className="font-mono">{t.ascending}</SelectItem>
                        <SelectItem value="desc" className="font-mono">{t.descending}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
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
