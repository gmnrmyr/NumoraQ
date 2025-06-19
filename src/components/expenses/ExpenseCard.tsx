
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Expense } from "@/contexts/financial-data/types";

interface ExpenseCardProps {
  expense: Expense;
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onRemove: (id: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onUpdate,
  onRemove,
  categoryOptions
}) => {
  const { data } = useFinancialData();
  const { t } = useTranslation();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      housing: 'bg-blue-100 text-blue-800 border-blue-200',
      food: 'bg-green-100 text-green-800 border-green-200',
      transportation: 'bg-purple-100 text-purple-800 border-purple-200',
      entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
      utilities: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      health: 'bg-red-100 text-red-800 border-red-200',
      personal: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      travel: 'bg-orange-100 text-orange-800 border-orange-200',
      trips: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`p-2 sm:p-3 bg-background/50 border-2 border-border brutalist-card ${expense.status !== 'active' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <EditableValue
              value={expense.name}
              onSave={(value) => onUpdate(expense.id, { name: String(value) })}
              type="text"
              className="font-medium bg-input border-2 border-border text-sm font-mono"
            />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-medium text-sm text-accent">{data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}</span>
            <EditableValue
              value={expense.amount}
              onSave={(value) => onUpdate(expense.id, { amount: Number(value) })}
              type="number"
              className="inline w-20 text-sm bg-input border-2 border-border font-mono"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <Badge className={getCategoryColor(expense.category)}>
              {categoryOptions.find(cat => cat.value === expense.category)?.label || expense.category}
            </Badge>
            
            {expense.type === 'variable' && expense.specificDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar size={12} />
                <span className="font-mono">{formatDate(expense.specificDate)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <StatusToggle
              status={expense.status}
              onToggle={(newStatus) => onUpdate(expense.id, { status: newStatus })}
              options={['active', 'inactive']}
            />
            <Button
              onClick={() => onRemove(expense.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
        
        {expense.type === 'variable' && expense.specificDate && (
          <div className="text-xs text-muted-foreground font-mono">
            <EditableValue
              value={expense.specificDate}
              onSave={(value) => onUpdate(expense.id, { specificDate: String(value) })}
              type="text"
              className="w-full bg-input border border-border"
              placeholder="YYYY-MM-DD"
            />
          </div>
        )}
      </div>
    </div>
  );
};
