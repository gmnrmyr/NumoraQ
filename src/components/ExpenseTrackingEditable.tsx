import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";

const iconMap: { [key: string]: any } = {
  Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard
};

export const ExpenseTrackingEditable = () => {
  const { data, updateExpense, addExpense, removeExpense } = useFinancialData();
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: 'Moradia',
    type: 'recurring' as 'recurring' | 'variable',
    status: 'active' as 'active' | 'inactive',
    day: '',
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const recurringExpenses = data.expenses.filter(expense => expense.type === 'recurring');
  const variableExpenses = data.expenses.filter(expense => expense.type === 'variable');

  const totalRecurring = recurringExpenses
    .filter(expense => expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const totalVariable = variableExpenses
    .filter(expense => expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Moradia": "bg-blue-100 text-blue-800 border-blue-200",
      "Saúde": "bg-green-100 text-green-800 border-green-200",
      "Vícios": "bg-red-100 text-red-800 border-red-200",
      "Serviços": "bg-purple-100 text-purple-800 border-purple-200",
      "Imposto": "bg-orange-100 text-orange-800 border-orange-200",
      "Alimentação": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Higiene": "bg-teal-100 text-teal-800 border-teal-200",
      "Storage": "bg-gray-100 text-gray-800 border-gray-200",
      "Vacância": "bg-amber-100 text-amber-800 border-amber-200",
      "Reforma": "bg-pink-100 text-pink-800 border-pink-200",
      "Cartão": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "Moradia": Home,
      "Saúde": Stethoscope,
      "Vícios": Heart,
      "Serviços": Wifi,
      "Alimentação": ShoppingCart,
      "Higiene": ShoppingCart,
      "Storage": Home,
      "Imposto": Car,
      "Vacância": Home,
      "Reforma": Home,
      "Cartão": CreditCard
    };
    return icons[category] || Home;
  };

  const handleAddExpense = () => {
    if (newExpense.name.trim()) {
      const payload =
        newExpense.type === 'recurring'
        ? {
            name: newExpense.name,
            amount: newExpense.amount,
            category: newExpense.category,
            type: newExpense.type,
            status: newExpense.status,
            day: newExpense.day,
          }
        : {
            name: newExpense.name,
            amount: newExpense.amount,
            category: newExpense.category,
            type: newExpense.type,
            status: newExpense.status,
            // don't include day in variable
          };

      addExpense(payload as any);
      setNewExpense({
        name: '',
        amount: 0,
        category: 'Moradia',
        type: 'recurring',
        status: 'active',
        day: '',
      });
      setIsAddingExpense(false);
    }
  };

  const ExpenseCard = ({ expense, showCategory = true }: { expense: any, showCategory?: boolean }) => {
    const Icon = getCategoryIcon(expense.category);
    
    return (
      <div className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3 flex-1">
          <Icon size={16} className="text-gray-600" />
          <div className="flex-1">
            <Input
              value={expense.name}
              onChange={(e) => updateExpense(expense.id, { name: e.target.value })}
              className="border-none p-0 font-medium bg-transparent"
            />
            {showCategory && (
              <Select value={expense.category} onValueChange={(value) => updateExpense(expense.id, { category: value })}>
                <SelectTrigger className="w-32 h-6 text-xs border-none p-0 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Vícios">Vícios</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Imposto">Imposto</SelectItem>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Vacância">Vacância</SelectItem>
                  <SelectItem value="Reforma">Reforma</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            )}
            {/* Only for recurring expenses */}
            {expense.type === 'recurring' && (
              <div className="mt-1 flex items-center text-xs gap-1">
                <span>Day:</span>
                <Input 
                  type="number" 
                  min={1} 
                  max={31} 
                  value={expense.day || ''} 
                  onChange={(e) => updateExpense(expense.id, { day: e.target.value })} 
                  className="w-14 bg-slate-50 px-1 py-0 h-6 text-xs border border-slate-200"
                  placeholder="1-31"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showCategory && (
            <Badge className={getCategoryColor(expense.category)}>
              {expense.category}
            </Badge>
          )}
          <StatusToggle
            status={expense.status || 'active'}
            onToggle={(newStatus) => updateExpense(expense.id, { status: newStatus })}
            options={['active', 'inactive']}
          />
          <span className="font-medium">
            R$ <EditableValue
              value={expense.amount}
              onSave={(value) => updateExpense(expense.id, { amount: Number(value) })}
              type="number"
              className="inline"
            />
          </span>
          <Button
            onClick={() => removeExpense(expense.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recurring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring">Recurring Expenses</TabsTrigger>
          <TabsTrigger value="variable">Variable Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-800">Monthly Recurring Expenses</CardTitle>
                <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-1" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Expense name"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      />
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Moradia">Moradia</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Vícios">Vícios</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Imposto">Imposto</SelectItem>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Higiene">Higiene</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                          <SelectItem value="Vacância">Vacância</SelectItem>
                          <SelectItem value="Reforma">Reforma</SelectItem>
                          <SelectItem value="Cartão">Cartão</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newExpense.type} onValueChange={(value: 'recurring' | 'variable') => setNewExpense({ ...newExpense, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Recurring</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Only show due day when adding recurring expense */}
                      {newExpense.type === 'recurring' && (
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          placeholder="Due day (1-31)"
                          value={newExpense.day}
                          onChange={(e) => setNewExpense({ ...newExpense, day: e.target.value })}
                        />
                      )}
                      <Button onClick={handleAddExpense} className="w-full">
                        Add Expense
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-2xl font-bold text-red-700">
                R$ {totalRecurring.toLocaleString()}/month
              </div>
              <div className="text-xs text-red-600">
                {recurringExpenses.filter(e => e.status === 'inactive').length} expenses inactive
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recurringExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variable" className="space-y-4">
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-800">Variable Expenses</CardTitle>
                <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-1" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Expense name"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      />
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Moradia">Moradia</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Vícios">Vícios</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Imposto">Imposto</SelectItem>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Higiene">Higiene</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                          <SelectItem value="Vacância">Vacância</SelectItem>
                          <SelectItem value="Reforma">Reforma</SelectItem>
                          <SelectItem value="Cartão">Cartão</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newExpense.type} onValueChange={(value: 'recurring' | 'variable') => setNewExpense({ ...newExpense, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurring">Recurring</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddExpense} className="w-full">
                        Add Expense
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                R$ {totalVariable.toLocaleString()} total
              </div>
              <div className="text-xs text-orange-600">
                {variableExpenses.filter(e => e.status === 'inactive').length} expenses inactive
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {variableExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expense Summary */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Monthly Recurring (Active)</div>
              <div className="text-xl font-bold text-red-600">
                R$ {totalRecurring.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                R$ {(totalRecurring * 12).toLocaleString()}/year
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Variable Expenses (Active)</div>
              <div className="text-xl font-bold text-orange-600">
                R$ {totalVariable.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">One-time expenses</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
              <div className="text-sm text-slate-600">Total Impact (Active)</div>
              <div className="text-2xl font-bold text-red-600">
                R$ {(totalRecurring + totalVariable).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Combined active expenses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
