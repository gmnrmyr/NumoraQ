
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface AddExpenseDialogProps {
  type: 'recurring' | 'variable';
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  type,
  onAddExpense,
  categoryOptions,
  isOpen,
  onOpenChange
}) => {
  const { t } = useTranslation();
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: '',
    specificDate: ''
  });

  const handleAddExpense = () => {
    if (newExpense.name.trim() && newExpense.amount > 0 && newExpense.category) {
      const expenseData = {
        name: newExpense.name,
        amount: newExpense.amount,
        category: newExpense.category,
        type,
        status: 'active' as const,
        ...(type === 'variable' && newExpense.specificDate && { specificDate: newExpense.specificDate })
      };
      
      onAddExpense(expenseData);
      setNewExpense({ name: '', amount: 0, category: '', specificDate: '' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="brutalist-button">
          <Plus size={16} className="mr-1" />
          {t.add || "Add"} {type === 'recurring' ? t.recurringExpenses : t.variableExpenses}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase">
            {t.add || "Add"} {type === 'recurring' ? t.recurringExpenses : t.variableExpenses}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t.expenseName || "Expense name"}
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            className="bg-input border-2 border-border"
          />
          <Input
            type="number"
            placeholder={t.amount || "Amount"}
            value={newExpense.amount || ''}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
            className="bg-input border-2 border-border"
          />
          <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
            <SelectTrigger className="bg-input border-2 border-border">
              <SelectValue placeholder={t.selectCategory || "Select category"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border">
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {type === 'variable' && (
            <div className="space-y-2">
              <label className="text-sm font-mono text-muted-foreground">
                {t.specificDate || "Specific Date"} ({t.optional || "Optional"})
              </label>
              <Input
                type="date"
                value={newExpense.specificDate}
                onChange={(e) => setNewExpense({ ...newExpense, specificDate: e.target.value })}
                className="bg-input border-2 border-border"
              />
              <p className="text-xs text-muted-foreground font-mono">
                {t.dateHelp || "Leave empty for monthly recurring variable expense"}
              </p>
            </div>
          )}
          
          <Button onClick={handleAddExpense} className="w-full brutalist-button">
            {t.add || "Add"} {t.expense || "Expense"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
