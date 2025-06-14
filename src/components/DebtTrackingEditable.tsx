
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, User, Home, DollarSign, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";

const iconMap: { [key: string]: any } = {
  User, Home, AlertTriangle, DollarSign
};

export const DebtTrackingEditable = () => {
  const { data, updateDebt, addDebt, removeDebt } = useFinancialData();
  const [newDebt, setNewDebt] = useState({
    creditor: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'partial' | 'paid',
    icon: 'User',
    description: '',
    isActive: true
  });
  const [isAddingDebt, setIsAddingDebt] = useState(false);

  // Only count active debts in totals
  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'partial': return 'Partial';
      case 'paid': return 'Paid';
      default: return 'Unknown';
    }
  };

  const handleAddDebt = () => {
    if (newDebt.creditor.trim()) {
      addDebt(newDebt);
      setNewDebt({
        creditor: '',
        amount: 0,
        dueDate: '',
        status: 'pending',
        icon: 'User',
        description: '',
        isActive: true
      });
      setIsAddingDebt(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Debt Overview */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle size={20} />
            Debt Overview
            <Dialog open={isAddingDebt} onOpenChange={setIsAddingDebt}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto">
                  <Plus size={16} className="mr-1" />
                  Add Debt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Debt</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Creditor name"
                    value={newDebt.creditor}
                    onChange={(e) => setNewDebt({ ...newDebt, creditor: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    placeholder="Due date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    value={newDebt.description}
                    onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                  />
                  <Button onClick={handleAddDebt} className="w-full">
                    Add Debt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Outstanding Debt</div>
              <div className="text-3xl font-bold text-red-600">
                R$ {totalDebt.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                ({data.debts.length - activeDebts.length} inactive)
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Active Creditors</div>
              <div className="text-3xl font-bold text-orange-600">{activeDebts.length}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Status</div>
              <Badge className="bg-red-100 text-red-800 border-red-200 text-lg px-3 py-1">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Debts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.debts.map((debt) => {
          const Icon = iconMap[debt.icon] || User;
          
          return (
            <Card key={debt.id} className={`bg-white shadow-lg border-l-4 ${debt.isActive ? 'border-red-500' : 'border-gray-300 opacity-60'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon size={20} className={debt.isActive ? "text-red-600" : "text-gray-400"} />
                    <Input
                      value={debt.creditor}
                      onChange={(e) => updateDebt(debt.id, { creditor: e.target.value })}
                      className="border-none p-0 font-semibold bg-transparent"
                    />
                  </CardTitle>
                  <Button
                    onClick={() => removeDebt(debt.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <StatusToggle
                    status={debt.status}
                    onToggle={(newStatus) => updateDebt(debt.id, { status: newStatus })}
                    options={['pending', 'partial', 'paid']}
                  />
                  <Button
                    onClick={() => updateDebt(debt.id, { isActive: !debt.isActive })}
                    variant="outline"
                    size="sm"
                    className={debt.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}
                  >
                    {debt.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Amount Owed</span>
                    <span className="text-xl font-bold text-red-600">
                      R$ <EditableValue
                        value={debt.amount}
                        onSave={(value) => updateDebt(debt.id, { amount: Number(value) })}
                        type="number"
                        className="inline"
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Due Date</span>
                    <Input
                      value={debt.dueDate}
                      onChange={(e) => updateDebt(debt.id, { dueDate: e.target.value })}
                      className="w-24 h-6 text-xs text-right"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <Input
                    value={debt.description}
                    onChange={(e) => updateDebt(debt.id, { description: e.target.value })}
                    placeholder="Description"
                    className="border-none p-0 text-sm bg-transparent"
                  />
                </div>

                {debt.isActive && totalDebt > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-slate-500">
                      Percentage of total debt: {((debt.amount / totalDebt) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
