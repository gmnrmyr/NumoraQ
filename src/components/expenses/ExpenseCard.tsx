
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ExpenseCardProps {
  expense: any;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onUpdate,
  onRemove,
  categoryOptions
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: expense.name,
    amount: expense.amount,
    category: expense.category,
    specificDate: expense.specificDate || ''
  });

  const handleSave = () => {
    onUpdate(expense.id, {
      ...editData,
      specificDate: editData.specificDate || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      specificDate: expense.specificDate || ''
    });
    setIsEditing(false);
  };

  const toggleStatus = () => {
    onUpdate(expense.id, {
      status: expense.status === 'active' ? 'inactive' : 'active'
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-border bg-muted/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="font-mono text-xs uppercase">Name</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border font-mono"
              />
            </div>
            <div>
              <Label className="font-mono text-xs uppercase">Amount</Label>
              <Input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className="bg-input border-border font-mono"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="font-mono text-xs uppercase">Category</Label>
              <Select 
                value={editData.category} 
                onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-input border-border font-mono">
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
            
            {expense.type === 'variable' && (
              <div>
                <Label className="font-mono text-xs uppercase">Specific Date (Optional)</Label>
                <Input
                  type="date"
                  value={editData.specificDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, specificDate: e.target.value }))}
                  className="bg-input border-border font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="brutalist-button">
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="brutalist-button">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-muted border-2 border-border ${
      expense.status === 'inactive' ? 'opacity-50' : ''
    }`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-mono font-bold text-sm truncate">
              {expense.name}
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {expense.category}
            </Badge>
            {expense.type === 'variable' && expense.specificDate && (
              <Badge variant="secondary" className="text-xs font-mono flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(expense.specificDate)}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <DollarSign size={12} />
            ${expense.amount.toLocaleString()}
            {expense.type === 'recurring' && ' /month'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <Switch
          checked={expense.status === 'active'}
          onCheckedChange={toggleStatus}
          className="scale-75"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="brutalist-button p-1 h-8 w-8"
        >
          <Edit size={12} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(expense.id)}
          className="brutalist-button p-1 h-8 w-8 hover:bg-red-50 hover:border-red-200"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
};
