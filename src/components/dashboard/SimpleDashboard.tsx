import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  CreditCard, 
  CheckSquare,
  SkipForward,
  ArrowRight,
  Home,
  PiggyBank,
  Target,
  Plus,
  LogIn,
  UserPlus
} from 'lucide-react';

export const SimpleDashboard: React.FC = () => {
  const { data, addExpense, addPassiveIncome, addActiveIncome, addLiquidAsset, addDebt, updateExpense, updatePassiveIncome, updateActiveIncome, updateLiquidAsset, updateDebt, removeExpense, removePassiveIncome, removeActiveIncome, removeLiquidAsset, removeDebt } = useFinancialData();
  const { t } = useTranslation();
  const { user, signInWithGoogle } = useAuth();
  
  // Check if user has existing data to determine onboarding behavior
  const hasExistingData = data && (
    (data.passiveIncome && data.passiveIncome.length > 0) ||
    (data.activeIncome && data.activeIncome.length > 0) ||
    (data.expenses && data.expenses.length > 0) ||
    (data.liquidAssets && data.liquidAssets.length > 0) ||
    (data.illiquidAssets && data.illiquidAssets.length > 0) ||
    (data.debts && data.debts.length > 0)
  );
  
  // Check if user has skipped onboarding
  const hasSkippedOnboarding = localStorage.getItem('skipSimpleOnboarding') === 'true';
  
  // Show onboarding unless user has skipped it
  const [showOnboarding, setShowOnboarding] = useState(!hasSkippedOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Trigger onboarding when component mounts (user switched to simple mode)
  useEffect(() => {
    if (!hasSkippedOnboarding) {
      setShowOnboarding(true);
      setOnboardingStep(0);
    }
  }, [hasSkippedOnboarding]);
  
  // Quick action dialog states
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [skipOnboarding, setSkipOnboarding] = useState(false);
  
  // Edit dialog states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'income' | 'expense' | 'asset' | 'debt' | null>(null);
  
  // Onboarding edit states
  const [onboardingEditItem, setOnboardingEditItem] = useState<any>(null);
  const [onboardingEditType, setOnboardingEditType] = useState<'income' | 'expense' | 'asset' | null>(null);

  // Calculate simple metrics with null checks - using correct data structure
  const totalLiquidAssets = data?.liquidAssets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;
  const totalIlliquidAssets = data?.illiquidAssets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;
  const totalAssets = totalLiquidAssets + totalIlliquidAssets;
  
  const totalPassiveIncome = data?.passiveIncome?.reduce((sum, income) => sum + (income.amount || 0), 0) || 0;
  const totalActiveIncome = data?.activeIncome?.reduce((sum, income) => sum + (income.amount || 0), 0) || 0;
  const totalIncome = totalPassiveIncome + totalActiveIncome;
  
  const totalExpenses = data?.expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
  const totalDebt = data?.debts?.reduce((sum, debt) => sum + (debt.amount || 0), 0) || 0;
  const netWorth = totalAssets - totalDebt;
  const monthlyCashFlow = totalIncome - totalExpenses;

  // Quick action handlers
  const handleAddIncome = () => {
    addActiveIncome({
      source: "New Income",
      amount: 0,
      frequency: 'monthly',
      status: 'active',
      icon: '💼',
      category: 'employment'
    });
    setShowAddIncome(false);
  };

  const handleAddExpense = () => {
    addExpense({
      name: "New Expense",
      amount: 0,
      type: 'recurring',
      status: 'active',
      category: 'housing'
    });
    setShowAddExpense(false);
  };

  const handleAddAsset = () => {
    addLiquidAsset({
      name: "New Asset",
      value: 0,
      type: 'manual',
      isActive: true,
      icon: '💵'
    });
    setShowAddAsset(false);
  };

  const handleAddDebt = () => {
    addDebt({
      creditor: "New Debt",
      amount: 0,
      dueDate: '',
      status: 'pending',
      icon: 'CreditCard',
      description: '',
      isActive: true
    });
    setShowAddDebt(false);
  };

  // Simple edit handlers
  const handleEditItem = (item: any, type: 'income' | 'expense' | 'asset' | 'debt') => {
    setEditingItem(item);
    setEditType(type);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editType) return;

    const updates = {
      ...editingItem,
      amount: parseFloat(editingItem.amount) || 0,
      value: parseFloat(editingItem.value) || 0
    };

    switch (editType) {
      case 'income':
        if (editingItem.source) {
          updatePassiveIncome(editingItem.id, updates);
        } else {
          updateActiveIncome(editingItem.id, updates);
        }
        break;
      case 'expense':
        updateExpense(editingItem.id, updates);
        break;
      case 'asset':
        updateLiquidAsset(editingItem.id, updates);
        break;
      case 'debt':
        updateDebt(editingItem.id, updates);
        break;
    }

    setEditingItem(null);
    setEditType(null);
  };

  const handleDeleteItem = () => {
    if (!editingItem || !editType) return;

    switch (editType) {
      case 'income':
        if (editingItem.source) {
          removePassiveIncome(editingItem.id);
        } else {
          removeActiveIncome(editingItem.id);
        }
        break;
      case 'expense':
        removeExpense(editingItem.id);
        break;
      case 'asset':
        removeLiquidAsset(editingItem.id);
        break;
      case 'debt':
        removeDebt(editingItem.id);
        break;
    }

    setEditingItem(null);
    setEditType(null);
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Onboarding edit handlers
  const handleOnboardingEdit = (item: any, type: 'income' | 'expense' | 'asset') => {
    setOnboardingEditItem(item);
    setOnboardingEditType(type);
  };

  const handleOnboardingSaveEdit = () => {
    if (!onboardingEditItem || !onboardingEditType) return;

    const updates = {
      ...onboardingEditItem,
      amount: parseFloat(onboardingEditItem.amount) || 0,
      value: parseFloat(onboardingEditItem.value) || 0
    };

    switch (onboardingEditType) {
      case 'income':
        if (onboardingEditItem.source) {
          updatePassiveIncome(onboardingEditItem.id, updates);
        } else {
          updateActiveIncome(onboardingEditItem.id, updates);
        }
        break;
      case 'expense':
        updateExpense(onboardingEditItem.id, updates);
        break;
      case 'asset':
        updateLiquidAsset(onboardingEditItem.id, updates);
        break;
    }

    setOnboardingEditItem(null);
    setOnboardingEditType(null);
  };

  const handleOnboardingAddItem = (type: 'income' | 'expense' | 'asset') => {
    switch (type) {
      case 'income':
        addActiveIncome({
          source: "New Income",
          amount: 0,
          frequency: 'monthly',
          status: 'active',
          icon: '💼',
          category: 'employment'
        });
        break;
      case 'expense':
        addExpense({
          name: "New Expense",
          amount: 0,
          type: 'recurring',
          status: 'active',
          category: 'housing'
        });
        break;
      case 'asset':
        addLiquidAsset({
          name: "New Asset",
          value: 0,
          type: 'manual',
          isActive: true,
          icon: '💵'
        });
        break;
    }
  };

  const onboardingSteps = [
    {
      title: hasExistingData ? "Welcome to Simple Mode!" : "Welcome to Simple Mode!",
      description: hasExistingData 
        ? "We found your existing financial data! Here's a simplified view of your finances."
        : "This is a simplified version of your financial dashboard. Perfect for beginners.",
      icon: Home,
      showData: false
    },
    {
      title: "Your Income",
      description: hasExistingData
        ? `Your current monthly income: $${totalIncome.toLocaleString()}. You can edit this data during onboarding.`
        : "Let's start with your income. Add your monthly income sources.",
      icon: TrendingUp,
      showData: true,
      dataType: 'income',
      dataValue: totalIncome,
      dataItems: [...(data?.passiveIncome || []), ...(data?.activeIncome || [])]
    },
    {
      title: "Your Expenses",
      description: hasExistingData
        ? `Your current monthly expenses: $${totalExpenses.toLocaleString()}. You can edit this data during onboarding.`
        : "Now let's track your expenses. Add your monthly expenses.",
      icon: TrendingDown,
      showData: true,
      dataType: 'expense',
      dataValue: totalExpenses,
      dataItems: data?.expenses || []
    },
    {
      title: "Your Assets",
      description: hasExistingData
        ? `Your current total assets: $${totalAssets.toLocaleString()}. You can edit this data during onboarding.`
        : "Let's add your assets. This includes cash, investments, and other valuable items.",
      icon: Briefcase,
      showData: true,
      dataType: 'asset',
      dataValue: totalAssets,
      dataItems: [...(data?.liquidAssets || []), ...(data?.illiquidAssets || [])]
    },
    {
      title: "Your Net Worth",
      description: hasExistingData
        ? `Your current net worth: $${netWorth.toLocaleString()}. This is your assets minus your debt.`
        : "Your net worth is your assets minus your debt. This gives you a complete financial picture.",
      icon: Target,
      showData: true,
      dataType: 'overview',
      dataValue: netWorth,
      dataItems: []
    },
    {
      title: "Ready to Start",
      description: hasExistingData
        ? "Your data is ready! You can always switch back to Advanced mode for more detailed features."
        : "You can always switch back to Advanced mode for more detailed features.",
      icon: ArrowRight,
      showData: false
    }
  ];

  const handleSkipOnboarding = () => {
    localStorage.setItem('skipSimpleOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding && onboardingStep < onboardingSteps.length) {
    const currentStep = onboardingSteps[onboardingStep];
    const Icon = currentStep.icon;

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Icon size={48} className="text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{currentStep.title}</CardTitle>
              <CardDescription className="text-lg">
                {currentStep.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interactive Data Section */}
              {currentStep.showData && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${currentStep.dataValue.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentStep.dataType === 'income' && 'Monthly Income'}
                      {currentStep.dataType === 'expense' && 'Monthly Expenses'}
                      {currentStep.dataType === 'asset' && 'Total Assets'}
                      {currentStep.dataType === 'overview' && 'Net Worth'}
                    </p>
                  </div>

                  {/* Data Items List */}
                  {currentStep.dataItems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Your {currentStep.dataType} items:</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {currentStep.dataItems.map((item: any, index: number) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                            onClick={() => handleOnboardingEdit(item, currentStep.dataType)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} className="text-primary" />
                              <div>
                                <p className="font-medium">{item.name || item.source}</p>
                                <p className="text-sm text-muted-foreground">
                                  {currentStep.dataType === 'income' && (item.source ? 'Passive Income' : 'Active Income')}
                                  {currentStep.dataType === 'expense' && item.category}
                                  {currentStep.dataType === 'asset' && 'Asset'}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-primary">
                              ${(item.amount || item.value || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Item Button */}
                  <div className="text-center">
                    <Button
                      onClick={() => handleOnboardingAddItem(currentStep.dataType)}
                      variant="outline"
                      className="brutalist-button"
                    >
                      <Plus size={16} className="mr-2" />
                      Add {currentStep.dataType === 'income' ? 'Income' : currentStep.dataType === 'expense' ? 'Expense' : 'Asset'}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    💡 You can edit these items by clicking on them. More detailed editing will be available after onboarding.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Step {onboardingStep + 1} of {onboardingSteps.length}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSkipOnboarding}
                  className="text-xs"
                >
                  <SkipForward size={14} className="mr-1" />
                  Skip Onboarding
                </Button>
              </div>
              
              {/* Skip checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip-onboarding"
                  checked={skipOnboarding}
                  onCheckedChange={(checked) => setSkipOnboarding(checked as boolean)}
                />
                <label htmlFor="skip-onboarding" className="text-sm text-muted-foreground">
                  Don't show onboarding again
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setOnboardingStep(prev => prev - 1)}
                  disabled={onboardingStep === 0}
                  variant="outline"
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (skipOnboarding) {
                      handleSkipOnboarding();
                    } else if (onboardingStep === onboardingSteps.length - 1) {
                      setShowOnboarding(false);
                    } else {
                      setOnboardingStep(prev => prev + 1);
                    }
                  }}
                  className="flex-1"
                >
                  {onboardingStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Edit Dialog */}
          {onboardingEditItem && onboardingEditType && (
            <Dialog open={!!onboardingEditItem} onOpenChange={() => setOnboardingEditItem(null)}>
              <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase">
                    Edit {onboardingEditType === 'income' ? 'Income' : onboardingEditType === 'expense' ? 'Expense' : 'Asset'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={onboardingEditItem.name || onboardingEditItem.source || ''}
                      onChange={(e) => setOnboardingEditItem({
                        ...onboardingEditItem,
                        name: e.target.value,
                        source: e.target.value
                      })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={onboardingEditItem.amount || onboardingEditItem.value || 0}
                      onChange={(e) => setOnboardingEditItem({
                        ...onboardingEditItem,
                        amount: parseFloat(e.target.value) || 0,
                        value: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleOnboardingSaveEdit}
                      className="flex-1 brutalist-button"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setOnboardingEditItem(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Simple Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview at a glance</p>
          {!user && (
            <Badge variant="outline" className="mx-auto">
              Demo Mode - Sign in to save your data
            </Badge>
          )}
        </div>

        {/* Authentication Buttons for Non-Logged Users */}
        {!user && (
          <Card className="border-2 border-border">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.signInToSave}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.createAccountToSync}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="brutalist-button flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    {t.login}
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/auth'}
                    className="brutalist-button flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    {t.createAccount}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics - Same as Advanced mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Briefcase size={16} />
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${netWorth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Assets: ${totalAssets.toLocaleString()} | Debt: ${totalDebt.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp size={16} />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(data?.passiveIncome?.length || 0) + (data?.activeIncome?.length || 0)} income sources
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown size={16} />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data?.expenses?.length || 0} expense items
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} />
                Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyCashFlow.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyCashFlow >= 0 ? 'Positive' : 'Negative'} monthly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Simple Sections - Like Advanced mode but simpler */}
        <div className="space-y-6">
          {/* Income Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Income
                </CardTitle>
                <Dialog open={showAddIncome} onOpenChange={setShowAddIncome}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="brutalist-button">
                      <Plus size={16} className="mr-1" />
                      Add Income
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                    <DialogHeader>
                      <DialogTitle className="font-mono uppercase">Add Income</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        A new income source will be added.
                      </p>
                      <Button onClick={handleAddIncome} className="w-full brutalist-button">
                        Add Income
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.passiveIncome?.map((income, index) => (
                  <div 
                    key={`passive-${index}`} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(income, 'income')}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-green-600" />
                      <div>
                        <p className="font-medium">{income.source}</p>
                        <p className="text-sm text-muted-foreground">Passive Income</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      ${income.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {data?.activeIncome?.map((income, index) => (
                  <div 
                    key={`active-${index}`} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(income, 'income')}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-green-600" />
                      <div>
                        <p className="font-medium">{income.source}</p>
                        <p className="text-sm text-muted-foreground">Active Income</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      ${income.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!data?.passiveIncome || data.passiveIncome.length === 0) && 
                 (!data?.activeIncome || data.activeIncome.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No income sources</p>
                    <p className="text-sm">Add your first income source</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown size={20} />
                  Expenses
                </CardTitle>
                <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="brutalist-button">
                      <Plus size={16} className="mr-1" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                    <DialogHeader>
                      <DialogTitle className="font-mono uppercase">Add Expense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        A new expense will be added.
                      </p>
                      <Button onClick={handleAddExpense} className="w-full brutalist-button">
                        Add Expense
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.expenses?.map((expense, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(expense, 'expense')}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingDown size={16} className="text-red-600" />
                      <div>
                        <p className="font-medium">{expense.name}</p>
                        <p className="text-sm text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-600">
                      ${expense.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!data?.expenses || data.expenses.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingDown size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No expenses</p>
                    <p className="text-sm">Add your first expense</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assets Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase size={20} />
                  Assets
                </CardTitle>
                <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="brutalist-button">
                      <Plus size={16} className="mr-1" />
                      Add Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                    <DialogHeader>
                      <DialogTitle className="font-mono uppercase">Add Asset</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        A new asset will be added.
                      </p>
                      <Button onClick={handleAddAsset} className="w-full brutalist-button">
                        Add Asset
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.liquidAssets?.map((asset, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(asset, 'asset')}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-blue-600" />
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">Liquid Asset</p>
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">
                      ${asset.value?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {data?.illiquidAssets?.map((asset, index) => (
                  <div 
                    key={`illiquid-${index}`} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(asset, 'asset')}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-purple-600" />
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">Illiquid Asset</p>
                      </div>
                    </div>
                    <span className="font-bold text-purple-600">
                      ${asset.value?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!data?.liquidAssets || data.liquidAssets.length === 0) && 
                 (!data?.illiquidAssets || data.illiquidAssets.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No assets</p>
                    <p className="text-sm">Add your first asset</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debt Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Debt
                </CardTitle>
                <Dialog open={showAddDebt} onOpenChange={setShowAddDebt}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="brutalist-button">
                      <Plus size={16} className="mr-1" />
                      Add Debt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                    <DialogHeader>
                      <DialogTitle className="font-mono uppercase">Add Debt</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        A new debt will be added.
                      </p>
                      <Button onClick={handleAddDebt} className="w-full brutalist-button">
                        Add Debt
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.debts?.map((debt, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditItem(debt, 'debt')}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-orange-600" />
                      <div>
                        <p className="font-medium">{debt.creditor}</p>
                        <p className="text-sm text-muted-foreground">Debt</p>
                      </div>
                    </div>
                    <span className="font-bold text-orange-600">
                      ${debt.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                {(!data?.debts || data.debts.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No debts</p>
                    <p className="text-sm">Add your first debt</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simple Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => {
        setEditingItem(null);
        setEditType(null);
      }}>
        <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase">
              Edit {editType === 'income' ? 'Income' : editType === 'expense' ? 'Expense' : editType === 'asset' ? 'Asset' : 'Debt'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingItem && (
              <>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingItem.source || editingItem.name || editingItem.creditor || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      source: e.target.value,
                      name: e.target.value,
                      creditor: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {editType === 'asset' ? 'Value' : 'Amount'}
                  </label>
                  <Input
                    type="number"
                    value={editingItem.value || editingItem.amount || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      value: e.target.value,
                      amount: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                {editType === 'expense' && (
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={editingItem.category || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        category: e.target.value
                      })}
                      className="mt-1"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleDeleteItem}
                    variant="destructive"
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 