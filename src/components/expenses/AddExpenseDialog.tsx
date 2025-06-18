
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
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
    type: 'recurring' as 'recurring' | 'variable',
    status: 'active' as 'active' | 'inactive',
    day: '',
  });

  const handleAddExpense = () => {
    if (newExpense.name.trim()) {
      const payload =
        newExpense.type === 'recurring'
        ? {
            name: newExpense.name,
            amount: newExpense.amount,
            category: newExpense.category,
            type: newExpense.type,
            status: newExpense.status,
            day: newExpense.day,
          }
        : {
            name: newExpense.name,
            amount: newExpense.amount,
            category: newExpense.category,
            type: newExpense.type,
            status: newExpense.status,
          };

      onAddExpense(payload);
      setNewExpense({
        name: '',
        amount: 0,
        category: 'housing',
        type: 'recurring',
        status: 'active',
        day: '',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus size={16} className="mr-1" />
          {t.addExpense}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md bg-white z-50">
        <DialogHeader>
          <DialogTitle>{t.addNewExpense}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t.expenseName}
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder={t.amount}
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
          />
          <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t.selectCategory} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newExpense.type} onValueChange={(value: 'recurring' | 'variable') => setNewExpense({ ...newExpense, type: value })}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t.selectType} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="recurring">{t.recurring}</SelectItem>
              <SelectItem value="variable">{t.variable}</SelectItem>
            </SelectContent>
          </Select>
          {newExpense.type === 'recurring' && (
            <Input
              type="number"
              min={1}
              max={31}
              placeholder={t.dueDayPlaceholder}
              value={newExpense.day}
              onChange={(e) => setNewExpense({ ...newExpense, day: e.target.value })}
            />
          )}
          <Button onClick={handleAddExpense} className="w-full">
            {t.addExpense}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
