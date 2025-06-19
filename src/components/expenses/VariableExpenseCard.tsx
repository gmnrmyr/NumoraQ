
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Edit2, Save, X } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";
import { getCategoryIcon } from "./expenseUtils";

interface VariableExpenseCardProps {
  expense: any;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const VariableExpenseCard: React.FC<VariableExpenseCardProps> = ({ 
  expense, 
  onUpdate, 
  onRemove,
  categoryOptions 
}) => {
  const { t } = useTranslation();
  const Icon = getCategoryIcon(expense.category);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: expense.name,
    amount: expense.amount,
    category: expense.category,
    specificDate: expense.specificDate || ''
  });

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSave = () => {
    onUpdate(expense.id, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      specificDate: expense.specificDate || ''
    });
    setIsEditing(false);
  };

  const getDateStatus = () => {
    if (!expense.specificDate) return 'no-date';
    
    const expenseDate = new Date(expense.specificDate);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const expenseDateStart = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
    
    if (expenseDateStart.getTime() < todayStart.getTime()) return 'past';
    if (expenseDateStart.getTime() === todayStart.getTime()) return 'today';
    return 'future';
  };

  const dateStatus = getDateStatus();
  const statusColors = {
    'past': 'border-red-400 bg-red-50',
    'today': 'border-green-400 bg-green-50',
    'future': 'border-blue-400 bg-blue-50',
    'no-date': 'border-orange-400 bg-orange-50'
  };

  return (
    <div className={`p-2 sm:p-3 bg-card border-2 ${statusColors[dateStatus]} brutalist-card font-mono ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-2">
        {/* Top row - Icon, Name, Amount */}
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-muted-foreground flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editValues.name}
                onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                className="border-2 border-border p-1 font-medium bg-transparent text-sm h-auto font-mono"
              />
            ) : (
              <div className="font-medium text-sm">{expense.name}</div>
            )}
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-medium text-sm">$</span>
            {isEditing ? (
              <Input
                type="number"
                value={editValues.amount}
                onChange={(e) => setEditValues({...editValues, amount: Number(e.target.value)})}
                className="inline w-16 text-sm bg-input border-2 border-border font-mono"
              />
            ) : (
              <EditableValue
                value={expense.amount}
                onSave={(value) => onUpdate(expense.id, { amount: Number(value) })}
                type="number"
                className="inline w-16 text-sm bg-input border-2 border-border font-mono"
              />
            )}
          </div>
        </div>
        
        {/* Bottom row - Category, Date, Status, Actions */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <Select value={editValues.category} onValueChange={(value) => setEditValues({...editValues, category: value})}>
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
            ) : (
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
            
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-muted-foreground" />
              {isEditing ? (
                <Input 
                  type="date" 
                  value={formatDateForInput(editValues.specificDate)} 
                  onChange={(e) => setEditValues({...editValues, specificDate: e.target.value})} 
                  className="w-28 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                />
              ) : (
                <Input 
                  type="date" 
                  value={formatDateForInput(expense.specificDate)} 
                  onChange={(e) => onUpdate(expense.id, { specificDate: e.target.value })} 
                  className="w-28 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <StatusToggle
              status={expense.status || 'active'}
              onToggle={(newStatus) => onUpdate(expense.id, { status: newStatus })}
              options={['active', 'inactive']}
            />
            
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 h-6 w-6 border-2 border-border font-mono"
                >
                  <Save size={12} />
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 p-1 h-6 w-6 border-2 border-border font-mono"
                >
                  <X size={12} />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 h-6 w-6 border-2 border-border font-mono"
              >
                <Edit2 size={12} />
              </Button>
            )}
            
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
        
        {/* Date status indicator */}
        <div className="text-xs font-mono text-muted-foreground">
          {dateStatus === 'past' && '📅 Past expense'}
          {dateStatus === 'today' && '⭐ Due today'}
          {dateStatus === 'future' && '⏰ Scheduled'}
          {dateStatus === 'no-date' && '❓ No date set'}
        </div>
      </div>
    </div>
  );
};
