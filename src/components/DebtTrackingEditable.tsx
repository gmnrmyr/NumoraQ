
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";

export const DebtTrackingEditable = () => {
  const { data, updateDebt, addDebt, removeDebt } = useFinancialData();
  const { t } = useTranslation();
  const [newDebt, setNewDebt] = useState({
    creditor: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'partial' | 'paid',
    icon: 'CreditCard',
    description: '',
    isActive: true
  });
  const [isAddingDebt, setIsAddingDebt] = useState(false);

  const handleAddDebt = () => {
    if (newDebt.creditor.trim()) {
      addDebt(newDebt);
      setNewDebt({
        creditor: '',
        amount: 0,
        dueDate: '',
        status: 'pending',
        icon: 'CreditCard',
        description: '',
        isActive: true
      });
      setIsAddingDebt(false);
    }
  };

  // Fixed debt calculations - filter by isActive status
  const activeDebts = data.debts.filter(debt => debt.isActive !== false);
  const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const pendingDebt = activeDebts.filter(debt => debt.status === 'pending').reduce((sum, debt) => sum + debt.amount, 0);
  const paidDebt = activeDebts.filter(debt => debt.status === 'paid').reduce((sum, debt) => sum + debt.amount, 0);

  const getDebtIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'AlertTriangle': return AlertTriangle;
      default: return CreditCard;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Debt Summary */}
      <Card className="bg-card/95 backdrop-blur-md border-2 border-red-600 brutalist-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-red-400 text-sm sm:text-base font-mono uppercase flex items-center gap-2">
                <AlertTriangle size={20} />
                {t.debt || "DEBT TRACKING"} - {formatCurrency(totalDebt)}
              </CardTitle>
              <div className="grid grid-cols-2 gap-4 mt-2 text-xs font-mono">
                <div>
                  <span className="text-red-400/70">Pending: </span>
                  <span className="text-red-400 font-bold">{formatCurrency(pendingDebt)}</span>
                </div>
                <div>
                  <span className="text-green-400/70">Paid: </span>
                  <span className="text-green-400 font-bold">{formatCurrency(paidDebt)}</span>
                </div>
              </div>
            </div>
            <Dialog open={isAddingDebt} onOpenChange={setIsAddingDebt}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto brutalist-button">
                  <Plus size={16} className="mr-1" />
                  {t.add || "Add Debt"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase">{t.add || "Add New Debt"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder={t.creditor || "Creditor name"}
                    value={newDebt.creditor}
                    onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder={t.amount || "Amount"}
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Input
                    type="date"
                    placeholder={t.dueDate || "Due date"}
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                    className="brutalist-input"
                  />
                  <Input
                    placeholder={t.description || "Description"}
                    value={newDebt.description}
                    onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                    className="brutalist-input"
                  />
                  <Select value={newDebt.status} onValueChange={(value: any) => setNewDebt({ ...newDebt, status: value })}>
                    <SelectTrigger className="bg-input border-2 border-border">
                      <SelectValue placeholder={t.status || "Select status"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2 border-border z-50">
                      <SelectItem value="pending">{t.pending || "Pending"}</SelectItem>
                      <SelectItem value="partial">{t.partial || "Partial"}</SelectItem>
                      <SelectItem value="paid">{t.paid || "Paid"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddDebt} className="w-full brutalist-button">
                    {t.add || "Add Debt"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.debts.map((debt) => {
            const Icon = getDebtIcon(debt.icon);
            return (
              <div key={debt.id} className={`p-2 sm:p-3 bg-background/50 border-2 border-border brutalist-card ${!debt.isActive ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <EditableValue
                        value={debt.creditor}
                        onSave={(value) => updateDebt(debt.id, { creditor: String(value) })}
                        type="text"
                        className="font-medium bg-input border-2 border-border text-sm font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-medium text-sm text-red-400">{data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}</span>
                      <EditableValue
                        value={debt.amount}
                        onSave={(value) => updateDebt(debt.id, { amount: Number(value) })}
                        type="number"
                        className="inline w-20 text-sm bg-input border-2 border-border font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge className={getStatusColor(debt.status)}>
                        {debt.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground font-mono">{t.due || "Due"}:</span>
                        <EditableValue
                          value={debt.dueDate}
                          onSave={(value) => updateDebt(debt.id, { dueDate: String(value) })}
                          type="text"
                          className="w-20 text-xs bg-input border border-border font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusToggle
                        status={debt.status}
                        onToggle={(newStatus) => updateDebt(debt.id, { status: newStatus })}
                        options={['pending', 'partial', 'paid']}
                      />
                      <Button
                        onClick={() => removeDebt(debt.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {data.debts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-mono">
              No debts tracked yet. Add one to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
