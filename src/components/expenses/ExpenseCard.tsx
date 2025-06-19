
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";
import { getCategoryIcon } from "./expenseUtils";

interface ExpenseCardProps {
  expense: any;
  showCategory?: boolean;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  showCategory = true, 
  onUpdate, 
  onRemove,
  categoryOptions 
}) => {
  const { t } = useTranslation();
  const Icon = getCategoryIcon(expense.category);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const isUpcoming = expense.type === 'variable' && expense.specificDate;
  const isPastDue = isUpcoming && new Date(expense.specificDate) < new Date();
  
  return (
    <div className={`p-2 sm:p-3 bg-card border-2 border-border brutalist-card font-mono ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''} ${isPastDue ? 'border-red-500' : ''}`}>
      <div className="flex flex-col gap-2">
        {/* Top row - Icon, Name, Amount */}
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Input
              value={expense.name}
              onChange={(e) => onUpdate(expense.id, { name: e.target.value })}
              className="border-none p-0 font-medium bg-transparent text-sm h-auto font-mono bg-input border-2 border-border"
            />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-medium text-sm">$</span>
            <EditableValue
              value={expense.amount}
              onSave={(value) => onUpdate(expense.id, { amount: Number(value) })}
              type="number"
              className="inline w-16 text-sm bg-input border-2 border-border font-mono"
            />
          </div>
        </div>
        
        {/* Bottom row - Category, Day/Date, Status, Delete */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1">
            {showCategory && (
              <Select value={expense.category} onValueChange={(value) => onUpdate(expense.id, { category: value })}>
                <SelectTrigger className="w-20 h-6 text-xs bg-input border-2 border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-border z-50">
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="font-mono hover:bg-accent hover:text-accent-foreground">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {expense.type === 'recurring' && (
              <div className="flex items-center gap-1">
                <span className="font-mono">{t.day}:</span>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  value={expense.day || ''} 
                  onChange={(e) => onUpdate(expense.id, { day: e.target.value })} 
                  className="w-12 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                  placeholder="1-31"
                />
              </div>
            )}
            {expense.type === 'variable' && (
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-muted-foreground" />
                <Input 
                  type="date" 
                  value={formatDate(expense.specificDate)} 
                  onChange={(e) => onUpdate(expense.id, { specificDate: e.target.value })} 
                  className="w-28 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                  placeholder="Select date"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <StatusToggle
              status={expense.status || 'active'}
              onToggle={(newStatus) => onUpdate(expense.id, { status: newStatus })}
              options={['active', 'inactive']}
            />
            <Button
              onClick={() => onRemove(expense.id)}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive p-1 h-6 w-6 border-2 border-border font-mono"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
