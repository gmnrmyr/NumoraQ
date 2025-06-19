
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
  
  // Helper function to format date correctly
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    // Ensure we have the full YYYY-MM-DD format
    if (dateStr.length === 7) {
      return dateStr + '-01'; // Add day if missing
    }
    return dateStr;
  };

  // Helper function to handle date changes
  const handleDateChange = (newDate: string) => {
    // Validate date format and ensure it's properly formatted
    if (newDate && newDate.length >= 7) {
      onUpdate(expense.id, { specificDate: newDate });
    } else if (!newDate) {
      onUpdate(expense.id, { specificDate: null });
    }
  };
  
  return (
    <div className={`p-3 bg-card border-3 border-border brutalist-card font-mono ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-3">
        {/* Top row - Icon, Name, Amount */}
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Input
              value={expense.name}
              onChange={(e) => onUpdate(expense.id, { name: e.target.value })}
              className="brutalist-input border-none p-0 font-medium bg-transparent text-sm h-auto font-mono"
            />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-bold text-sm">$</span>
            <EditableValue
              value={expense.amount}
              onSave={(value) => onUpdate(expense.id, { amount: Number(value) })}
              type="number"
              className="inline w-20 text-sm brutalist-input font-mono font-bold"
            />
          </div>
        </div>
        
        {/* Bottom row - Category, Date/Day, Status, Delete */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1">
            {showCategory && (
              <Select value={expense.category} onValueChange={(value) => onUpdate(expense.id, { category: value })}>
                <SelectTrigger className="w-24 h-7 text-xs brutalist-input font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-3 border-border z-50">
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="font-mono hover:bg-accent hover:text-accent-foreground">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Date input for variable expenses or day for recurring */}
            {expense.type === 'variable' ? (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <Input 
                  type="date" 
                  value={formatDateForInput(expense.specificDate || '')}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-32 h-7 text-xs brutalist-input px-2 font-mono"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{t.day}:</span>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  value={expense.day || ''} 
                  onChange={(e) => onUpdate(expense.id, { day: e.target.value })} 
                  className="w-14 h-7 text-xs brutalist-input px-2 font-mono"
                  placeholder="1-31"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <StatusToggle
              status={expense.status || 'active'}
              onToggle={(newStatus) => onUpdate(expense.id, { status: newStatus })}
              options={['active', 'inactive']}
            />
            <Button
              onClick={() => onRemove(expense.id)}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive p-1 h-7 w-7 brutalist-button"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
