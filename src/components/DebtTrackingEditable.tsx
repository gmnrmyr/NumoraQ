
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Plus, Trash2, AlertTriangle, TrendingDown } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";

export const DebtTrackingEditable = () => {
  const { data, updateDebt, addDebt, removeDebt } = useFinancialData();
  const { t } = useTranslation();
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'credit_card' as 'credit_card' | 'loan' | 'mortgage' | 'other',
    status: 'active' as 'active' | 'inactive'
  });
  const [isAddingDebt, setIsAddingDebt] = useState(false);

  const handleAddDebt = () => {
    if (newDebt.name.trim()) {
      addDebt(newDebt);
      setNewDebt({
        name: '',
        balance: 0,
        interestRate: 0,
        minimumPayment: 0,
        type: 'credit_card',
        status: 'active'
      });
      setIsAddingDebt(false);
    }
  };

  const totalDebt = data.debts.filter(debt => debt.status === 'active').reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = data.debts.filter(debt => debt.status === 'active').reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card': return CreditCard;
      case 'loan': return TrendingDown;
      case 'mortgage': return AlertTriangle;
      default: return CreditCard;
    }
  };

  const getDebtTypeColor = (type: string) => {
    switch (type) {
      case 'credit_card': return 'bg-red-100 text-red-800 border-red-200';
      case 'loan': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mortgage': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
                {t.debtTracking || "DEBT TRACKING"}
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-red-400 font-mono">
                $ {totalDebt.toLocaleString()}
              </div>
              <div className="text-xs text-red-400/70 font-mono">
                $ {totalMinPayments.toLocaleString()}/{t.monthly?.toLowerCase() || "monthly"} {t.minimumPayments?.toLowerCase() || "minimum payments"}
              </div>
            </div>
            <Dialog open={isAddingDebt} onOpenChange={setIsAddingDebt}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto brutalist-button">
                  <Plus size={16} className="mr-1" />
                  {t.addDebt || "Add Debt"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase">{t.addNewDebt || "Add New Debt"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder={t.debtName || "Debt name"}
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder={t.balance || "Balance"}
                    value={newDebt.balance}
                    onChange={(e) => setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t.interestRate || "Interest rate (%)"}
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder={t.minimumPayment || "Minimum payment"}
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Select value={newDebt.type} onValueChange={(value: any) => setNewDebt({ ...newDebt, type: value })}>
                    <SelectTrigger className="bg-input border-2 border-border">
                      <SelectValue placeholder={t.selectType || "Select type"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2 border-border z-50">
                      <SelectItem value="credit_card">{t.creditCard || "Credit Card"}</SelectItem>
                      <SelectItem value="loan">{t.loan || "Loan"}</SelectItem>
                      <SelectItem value="mortgage">{t.mortgage || "Mortgage"}</SelectItem>
                      <SelectItem value="other">{t.other || "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddDebt} className="w-full brutalist-button">
                    {t.addDebt || "Add Debt"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.debts.map((debt) => {
            const Icon = getDebtTypeIcon(debt.type);
            return (
              <div key={debt.id} className={`p-2 sm:p-3 bg-background/50 border-2 border-border brutalist-card ${debt.status === 'inactive' ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <EditableValue
                        value={debt.name}
                        onSave={(value) => updateDebt(debt.id, { name: String(value) })}
                        type="text"
                        className="font-medium bg-input border-2 border-border text-sm font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-medium text-sm text-red-400">$</span>
                      <EditableValue
                        value={debt.balance}
                        onSave={(value) => updateDebt(debt.id, { balance: Number(value) })}
                        type="number"
                        className="inline w-20 text-sm bg-input border-2 border-border font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge className={getDebtTypeColor(debt.type)}>
                        {debt.type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground font-mono">{t.rate || "Rate"}:</span>
                        <EditableValue
                          value={debt.interestRate}
                          onSave={(value) => updateDebt(debt.id, { interestRate: Number(value) })}
                          type="number"
                          className="w-12 text-xs bg-input border border-border font-mono"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground font-mono">{t.minPay || "Min"}:</span>
                        <EditableValue
                          value={debt.minimumPayment}
                          onSave={(value) => updateDebt(debt.id, { minimumPayment: Number(value) })}
                          type="number"
                          className="w-16 text-xs bg-input border border-border font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusToggle
                        status={debt.status}
                        onToggle={(newStatus) => updateDebt(debt.id, { status: newStatus })}
                        options={['active', 'inactive']}
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
        </CardContent>
      </Card>
    </div>
  );
};
