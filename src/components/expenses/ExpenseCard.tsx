
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Check, X } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";
import { getCategoryIcon } from "./expenseUtils";
import { Switch } from "@/components/ui/switch";

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
  
  // Mobile-friendly editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(expense.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Update editing name when expense name changes
  useEffect(() => {
    if (!isEditingName) {
      setEditingName(expense.name);
    }
  }, [expense.name, isEditingName]);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);
  
  const handleSaveName = () => {
    if (editingName !== expense.name) {
      onUpdate(expense.id, { name: editingName });
    }
    setIsEditingName(false);
  };
  
  const handleCancelName = () => {
    setEditingName(expense.name);
    setIsEditingName(false);
  };
  
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelName();
    }
  };
  
  return (
    <div className={`p-2 sm:p-3 bg-card border-2 border-border brutalist-card font-mono ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-2">
        {/* Top row - Icon, Name, Amount */}
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-muted-foreground flex-shrink-0" />
          
          {/* Mobile-friendly expense name editing */}
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={nameInputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="flex-1 text-sm font-mono bg-input border-2 border-border"
                  placeholder="Enter expense name"
                />
                <Button
                  onClick={handleSaveName}
                  size="sm"
                  className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                >
                  <Check size={12} />
                </Button>
                <Button
                  onClick={handleCancelName}
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                >
                  <X size={12} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="text-sm font-medium cursor-pointer hover:bg-muted p-1 rounded transition-colors font-mono"
              >
                {expense.name || 'Click to edit'}
              </div>
            )}
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
        
        {/* Bottom row - Category, Date/Day, Status, Delete */}
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
            
            {/* Date input for variable expenses or recurrence controls for recurring */}
            {expense.type === 'variable' ? (
              <div className="flex items-center gap-1">
                <Calendar size={12} className="text-muted-foreground" />
                <Input 
                  type="date" 
                  value={expense.specificDate || ''} 
                  onChange={(e) => onUpdate(expense.id, { specificDate: e.target.value })} 
                  className="w-28 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Select value={expense.frequency || 'monthly'} onValueChange={(value) => onUpdate(expense.id, { frequency: value })}>
                  <SelectTrigger className="w-24 h-6 text-xs bg-input border-2 border-border font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 border-border z-50">
                    <SelectItem value="monthly" className="font-mono">Monthly</SelectItem>
                    <SelectItem value="yearly" className="font-mono">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {(!expense.frequency || expense.frequency === 'monthly') && (
                  <>
                    <span className="font-mono">{t.day}:</span>
                    <Input 
                      type="number" 
                      min={1} 
                      max={31} 
                      value={expense.day || ''} 
                      onChange={(e) => onUpdate(expense.id, { day: Number(e.target.value) })} 
                      className="w-12 h-6 text-xs bg-input border-2 border-border px-1 font-mono"
                      placeholder="1-31"
                    />
                  </>
                )}
                {expense.frequency === 'yearly' && (
                  <>
                    <span className="font-mono">Month:</span>
                    <Select value={String(expense.triggerMonth || 1)} onValueChange={(value) => onUpdate(expense.id, { triggerMonth: Number(value) })}>
                      <SelectTrigger className="w-24 h-6 text-xs bg-input border-2 border-border font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-2 border-border z-50">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <SelectItem key={i+1} value={String(i+1)} className="font-mono">{`M${i+1}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
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
        {expense.type === 'recurring' && (
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono">Schedule</span>
              <Switch checked={Boolean(expense.useSchedule)} onCheckedChange={(checked) => onUpdate(expense.id, { useSchedule: checked })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">Start</span>
              <Input type="month" value={(expense.startDate || '').slice(0,7)} onChange={(e) => onUpdate(expense.id, { startDate: e.target.value })} className="h-6 w-28 text-xs bg-input border-2 border-border px-1 font-mono" disabled={!expense.useSchedule} />
              <span className="font-mono">End</span>
              <Input type="month" value={(expense.endDate || '').slice(0,7)} onChange={(e) => onUpdate(expense.id, { endDate: e.target.value || undefined })} className="h-6 w-28 text-xs bg-input border-2 border-border px-1 font-mono" disabled={!expense.useSchedule} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
