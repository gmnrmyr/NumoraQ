
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface AddExpenseDialogProps {
  type: 'recurring' | 'variable';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  type,
  isOpen,
  onOpenChange,
  onAddExpense,
  categoryOptions
}) => {
  const { t } = useTranslation();
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: 'housing',
    status: 'active' as 'active' | 'inactive',
    day: '',
    specificDate: '',
  });

  const handleAddExpense = () => {
    if (newExpense.name.trim()) {
      const payload: any = {
        name: newExpense.name,
        amount: newExpense.amount,
        category: newExpense.category,
        type: type,
        status: newExpense.status,
      };

      if (type === 'recurring') {
        payload.day = newExpense.day;
      } else if (type === 'variable' && newExpense.specificDate) {
        payload.specificDate = newExpense.specificDate;
      }

      onAddExpense(payload);
      setNewExpense({
        name: '',
        amount: 0,
        category: 'housing',
        status: 'active',
        day: '',
        specificDate: '',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase">{t.addNewExpense}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t.expenseName}
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            className="bg-input border-2 border-border font-mono"
          />
          <Input
            type="number"
            placeholder={t.amount}
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
            className="bg-input border-2 border-border font-mono"
          />
          <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
            <SelectTrigger className="bg-input border-2 border-border font-mono">
              <SelectValue placeholder={t.selectCategory} />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border z-50">
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="font-mono hover:bg-accent hover:text-accent-foreground">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {type === 'recurring' && (
            <Input
              type="number"
              min={1}
              max={31}
              placeholder={t.dueDayPlaceholder}
              value={newExpense.day}
              onChange={(e) => setNewExpense({ ...newExpense, day: e.target.value })}
              className="bg-input border-2 border-border font-mono"
            />
          )}
          {type === 'variable' && (
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="Specific date (optional)"
                value={newExpense.specificDate}
                onChange={(e) => setNewExpense({ ...newExpense, specificDate: e.target.value })}
                className="bg-input border-2 border-border font-mono"
              />
              <div className="text-xs text-muted-foreground font-mono">
                Leave empty for monthly recurring expense
              </div>
            </div>
          )}
          <Button onClick={handleAddExpense} className="w-full brutalist-button">
            {t.addExpense}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
