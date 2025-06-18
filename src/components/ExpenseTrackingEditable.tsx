
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard, Plus, Trash2, Plane, User } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";

const iconMap: { [key: string]: any } = {
  Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard, Plane, User
};

export const ExpenseTrackingEditable = () => {
  const { data, updateExpense, addExpense, removeExpense } = useFinancialData();
  const { t } = useTranslation();
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: 'housing',
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
      "housing": "bg-blue-100 text-blue-800 border-blue-200",
      "health": "bg-green-100 text-green-800 border-green-200",
      "food": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "transportation": "bg-purple-100 text-purple-800 border-purple-200",
      "entertainment": "bg-pink-100 text-pink-800 border-pink-200",
      "utilities": "bg-orange-100 text-orange-800 border-orange-200",
      "personal": "bg-teal-100 text-teal-800 border-teal-200",
      "travel": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "trips": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "other": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      "housing": Home,
      "health": Stethoscope,
      "food": ShoppingCart,
      "transportation": Car,
      "entertainment": Heart,
      "utilities": Wifi,
      "personal": User,
      "travel": Plane,
      "trips": Plane,
      "other": CreditCard
    };
    return icons[category] || Home;
  };

  const categoryOptions = [
    { value: 'housing', label: t.housing },
    { value: 'health', label: t.health },
    { value: 'food', label: t.food },
    { value: 'transportation', label: t.transportation },
    { value: 'entertainment', label: t.entertainment },
    { value: 'utilities', label: t.utilities },
    { value: 'personal', label: t.personal },
    { value: 'travel', label: t.travel },
    { value: 'trips', label: t.trips },
    { value: 'other', label: t.other }
  ];

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
          };

      addExpense(payload as any);
      setNewExpense({
        name: '',
        amount: 0,
        category: 'housing',
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
      <div className={`p-2 sm:p-3 bg-white rounded-lg shadow-sm border ${!expense.status || expense.status === 'inactive' ? 'opacity-60' : ''}`}>
        <div className="flex flex-col gap-2">
          {/* Top row - Icon, Name, Amount */}
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Input
                value={expense.name}
                onChange={(e) => updateExpense(expense.id, { name: e.target.value })}
                className="border-none p-0 font-medium bg-transparent text-sm h-auto"
              />
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="font-medium text-sm">$</span>
              <EditableValue
                value={expense.amount}
                onSave={(value) => updateExpense(expense.id, { amount: Number(value) })}
                type="number"
                className="inline w-16 text-sm"
              />
            </div>
          </div>
          
          {/* Bottom row - Category, Day, Status, Delete */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-1">
              {showCategory && (
                <Select value={expense.category} onValueChange={(value) => updateExpense(expense.id, { category: value })}>
                  <SelectTrigger className="w-20 h-6 text-xs border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {expense.type === 'recurring' && (
                <div className="flex items-center gap-1">
                  <span>{t.day}:</span>
                  <Input 
                    type="number" 
                    min={1} 
                    max={31} 
                    value={expense.day || ''} 
                    onChange={(e) => updateExpense(expense.id, { day: e.target.value })} 
                    className="w-12 h-6 text-xs border-slate-200 px-1"
                    placeholder="1-31"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <StatusToggle
                status={expense.status || 'active'}
                onToggle={(newStatus) => updateExpense(expense.id, { status: newStatus })}
                options={['active', 'inactive']}
              />
              <Button
                onClick={() => removeExpense(expense.id)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="recurring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring" className="text-xs sm:text-sm">{t.recurringExpenses}</TabsTrigger>
          <TabsTrigger value="variable" className="text-xs sm:text-sm">{t.variableExpenses}</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-red-800 text-sm sm:text-base">{t.recurringExpenses}</CardTitle>
                  <div className="text-lg sm:text-2xl font-bold text-red-700">
                    $ {totalRecurring.toLocaleString()}/{t.monthly.toLowerCase()}
                  </div>
                  <div className="text-xs text-red-600">
                    {recurringExpenses.filter(e => e.status === 'inactive').length} {t.inactiveExpenses}
                  </div>
                </div>
                <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Plus size={16} className="mr-1" />
                      {t.addExpense}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-white z-50">
                    <DialogHeader>
                      <DialogTitle>{t.addNewExpense}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder={t.expenseName}
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder={t.amount}
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      />
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categoryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newExpense.type} onValueChange={(value: 'recurring' | 'variable') => setNewExpense({ ...newExpense, type: value })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={t.selectType} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="recurring">{t.recurring}</SelectItem>
                          <SelectItem value="variable">{t.variable}</SelectItem>
                        </SelectContent>
                      </Select>
                      {newExpense.type === 'recurring' && (
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          placeholder={t.dueDayPlaceholder}
                          value={newExpense.day}
                          onChange={(e) => setNewExpense({ ...newExpense, day: e.target.value })}
                        />
                      )}
                      <Button onClick={handleAddExpense} className="w-full">
                        {t.addExpense}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-orange-800 text-sm sm:text-base">{t.variableExpenses}</CardTitle>
                  <div className="text-lg sm:text-2xl font-bold text-orange-700">
                    $ {totalVariable.toLocaleString()} {t.totalExpenses}
                  </div>
                  <div className="text-xs text-orange-600">
                    {variableExpenses.filter(e => e.status === 'inactive').length} {t.inactiveExpenses}
                  </div>
                </div>
                <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Plus size={16} className="mr-1" />
                      {t.addExpense}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-white z-50">
                    <DialogHeader>
                      <DialogTitle>{t.addNewExpense}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder={t.expenseName}
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder={t.amount}
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      />
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categoryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newExpense.type} onValueChange={(value: 'recurring' | 'variable') => setNewExpense({ ...newExpense, type: value })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={t.selectType} />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="recurring">{t.recurring}</SelectItem>
                          <SelectItem value="variable">{t.variable}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddExpense} className="w-full">
                        {t.addExpense}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
          <CardTitle className="text-slate-800 text-sm sm:text-base">{t.expenseSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="text-xs sm:text-sm text-slate-600">{t.monthly} {t.recurring} ({t.active})</div>
              <div className="text-lg sm:text-xl font-bold text-red-600">
                $ {totalRecurring.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                $ {(totalRecurring * 12).toLocaleString()}/{t.yearly.toLowerCase()}
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <div className="text-xs sm:text-sm text-slate-600">{t.variableExpenses} ({t.active})</div>
              <div className="text-lg sm:text-xl font-bold text-orange-600">
                $ {totalVariable.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">{t.oneTimeExpenses}</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
              <div className="text-xs sm:text-sm text-slate-600">{t.totalImpact} ({t.active})</div>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                $ {(totalRecurring + totalVariable).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">{t.combinedActiveExpenses}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
