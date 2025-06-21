
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: any) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  expenseType?: 'recurring' | 'variable';
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddExpense,
  categoryOptions,
  expenseType = 'recurring'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: categoryOptions[0]?.value || 'other',
    specificDate: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      amount: 0,
      category: categoryOptions[0]?.value || 'other',
      specificDate: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an expense name.",
        variant: "destructive"
      });
      return;
    }

    if (formData.amount <= 0) {
      toast({
        title: "Error", 
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const expenseData = {
      name: formData.name,
      amount: formData.amount,
      category: formData.category,
      type: expenseType,
      status: 'active',
      ...(expenseType === 'variable' && formData.specificDate && {
        specificDate: formData.specificDate
      })
    };

    onAddExpense(expenseData);
    onOpenChange(false);
    resetForm();

    toast({
      title: "Expense Added",
      description: `${formData.name} has been added successfully.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="brutalist-button text-xs">
          <Plus size={14} className="mr-1" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase text-accent">
            Add {expenseType === 'recurring' ? 'Recurring' : 'Variable'} Expense
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-mono text-xs uppercase">Expense Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-input border-2 border-border font-mono"
              placeholder="e.g., Rent, Groceries"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="font-mono text-xs uppercase">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="bg-input border-2 border-border font-mono"
              placeholder="0"
            />
          </div>

          <div>
            <Label className="font-mono text-xs uppercase">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-input border-2 border-border font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {expenseType === 'variable' && (
            <div>
              <Label htmlFor="specificDate" className="font-mono text-xs uppercase">
                Specific Date (Optional)
              </Label>
              <Input
                id="specificDate"
                type="date"
                value={formData.specificDate}
                onChange={(e) => setFormData(prev => ({ ...prev, specificDate: e.target.value }))}
                className="bg-input border-2 border-border font-mono"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Leave empty for monthly recurring variable expense
              </div>
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full brutalist-button"
          >
            Add Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
