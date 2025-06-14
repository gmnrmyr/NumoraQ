
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Briefcase, 
  Target,
  Calendar,
  AlertCircle,
  PieChart,
  BarChart3,
  Wifi,
  WifiOff
} from "lucide-react";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { DataToolbar } from "@/components/DataToolbar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useLiveData } from "@/hooks/useLiveData";
import { EditableValue } from "@/components/ui/editable-value";
import { useEffect, useMemo, useRef } from "react";

const Index = () => {
  const { data, updateExchangeRate } = useFinancialData();
  const { rates, isLoading } = useLiveData();
  const prevRatesRef = useRef<any>();

  // Memoize rates to prevent unnecessary updates
  const memoizedRates = useMemo(() => rates, [
    rates?.brlToUsd,
    rates?.usdToBrl,
    rates?.btcPrice,
    rates?.ethPrice,
    rates?.lastUpdated?.getTime()
  ]);

  // Update exchange rates when live data is received (with proper dependency checking)
  useEffect(() => {
    if (memoizedRates && memoizedRates !== prevRatesRef.current) {
      console.log('Updating exchange rates with:', memoizedRates);
      updateExchangeRate('brlToUsd', memoizedRates.brlToUsd);
      updateExchangeRate('usdToBrl', memoizedRates.usdToBrl);
      updateExchangeRate('btcPrice', memoizedRates.btcPrice);
      updateExchangeRate('ethPrice', memoizedRates.ethPrice);
      prevRatesRef.current = memoizedRates;
    }
  }, [memoizedRates]);

  // Calculate totals from context data (only active assets)
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const totalAvailable = totalLiquid;
  
  const totalPassiveIncome = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalActiveIncome = data.activeIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalRecurringExpenses = data.expenses
    .filter(expense => expense.type === 'recurring' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalVariableExpenses = data.expenses
    .filter(expense => expense.type === 'variable' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Fix debt calculation - only count active debts
  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

  const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
  const yearProjection = (monthlyBalance * 12) - totalVariableExpenses + totalAvailable - totalActiveDebt;

  return (
    <div className="min-h-screen p-4 custom-scrollbar bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2">
            <h1 className="brutalist-title float-animation">Financial Dashboard</h1>
            <p className="text-muted-high-contrast text-lg">Complete financial overview and management system</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {isLoading ? (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Wifi className="w-4 h-4 text-success" />
              )}
              <span className="text-high-contrast">
                {memoizedRates ? `Updated ${memoizedRates.lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Data Management Toolbar */}
        <div className="brutalist-card rounded-lg p-4">
          <DataToolbar />
        </div>

        {/* Exchange Rates Banner */}
        <Card className="brutalist-card rounded-lg border-2 border-border shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-around items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <DollarSign size={16} className="text-foreground" />
                <span className="font-bold text-high-contrast">BRL/USD: R$ </span>
                <EditableValue
                  value={data.exchangeRates.brlToUsd}
                  onSave={(value) => updateExchangeRate('brlToUsd', value)}
                  type="number"
                  className="bg-card border-border text-high-contrast font-semibold"
                />
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <DollarSign size={16} className="text-foreground" />
                <span className="font-bold text-high-contrast">USD/BRL: R$ </span>
                <EditableValue
                  value={data.exchangeRates.usdToBrl}
                  onSave={(value) => updateExchangeRate('usdToBrl', value)}
                  type="number"
                  className="bg-card border-border text-high-contrast font-semibold"
                />
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <TrendingUp size={16} className="text-foreground" />
                <span className="font-bold text-high-contrast">BTC: R$ </span>
                <EditableValue
                  value={data.exchangeRates.btcPrice}
                  onSave={(value) => updateExchangeRate('btcPrice', value)}
                  className="bg-card border-border text-high-contrast font-semibold"
                />
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
                <TrendingUp size={16} className="text-foreground" />
                <span className="font-bold text-high-contrast">ETH: R$ </span>
                <EditableValue
                  value={data.exchangeRates.ethPrice}
                  onSave={(value) => updateExchangeRate('ethPrice', value)}
                  className="bg-card border-border text-high-contrast font-semibold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Overview - Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="brutalist-success rounded-lg float-animation">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-success flex items-center gap-2">
                <DollarSign size={16} />
                Available Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-success">
                R$ {totalAvailable.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-primary rounded-lg float-animation" style={{ animation: 'float 6s ease-in-out infinite 0.5s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                <TrendingUp size={16} />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">
                R$ {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
              </div>
              <div className="text-xs text-muted-high-contrast font-bold">
                Passive: R$ {totalPassiveIncome.toLocaleString()} | Active: R$ {totalActiveIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-error rounded-lg float-animation" style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                <TrendingDown size={16} />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-destructive">
                R$ {totalRecurringExpenses.toLocaleString()}
              </div>
              <div className="text-xs text-muted-high-contrast font-bold">
                Recurring monthly expenses
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-warning rounded-lg float-animation" style={{ animation: 'float 6s ease-in-out infinite 1.5s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-warning flex items-center gap-2">
                <AlertCircle size={16} />
                Active Debts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-warning">
                R$ {totalActiveDebt.toLocaleString()}
              </div>
              <div className="text-xs text-muted-high-contrast font-bold">
                {activeDebts.length} active debts
              </div>
            </CardContent>
          </Card>

          <Card className={`${monthlyBalance >= 0 ? 'brutalist-success' : 'brutalist-error'} rounded-lg float-animation`} style={{ animation: 'float 6s ease-in-out infinite 2s' }}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-bold flex items-center gap-2 ${monthlyBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                <BarChart3 size={16} />
                Monthly Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-black ${monthlyBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                R$ {monthlyBalance.toLocaleString()}
              </div>
              <div className={`text-xs text-muted-high-contrast font-bold`}>
                {monthlyBalance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 12-Month Projection */}
        <Card className="brutalist-card rounded-lg border-2 border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-high-contrast flex items-center gap-2 text-2xl font-black">
              <PieChart size={20} />
              12-Month Financial Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 brutalist-card rounded-lg">
                <div className="text-sm text-muted-high-contrast mb-2 font-bold">Total Income (12m)</div>
                <div className="text-xl font-black text-success">
                  R$ {((totalPassiveIncome + totalActiveIncome) * 12).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 brutalist-card rounded-lg">
                <div className="text-sm text-muted-high-contrast mb-2 font-bold">Total Expenses (12m)</div>
                <div className="text-xl font-black text-destructive">
                  R$ {(totalRecurringExpenses * 12 + totalVariableExpenses).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 brutalist-card rounded-lg">
                <div className="text-sm text-muted-high-contrast mb-2 font-bold">Active Debts</div>
                <div className="text-xl font-black text-warning">
                  R$ {totalActiveDebt.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 brutalist-card rounded-lg">
                <div className="text-sm text-muted-high-contrast mb-2 font-bold">Net Projection</div>
                <div className={`text-2xl font-black ${yearProjection >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  R$ {yearProjection.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="brutalist-card rounded-lg p-2 border-2 border-border shadow-lg">
            <TabsTrigger value="portfolio" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <Briefcase size={16} />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">Income</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <TrendingDown size={16} />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <Home size={16} />
              <span className="hidden sm:inline">Assets</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <Calendar size={16} />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="debt" className="flex items-center gap-2 px-4 py-3 rounded data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all text-high-contrast font-bold">
              <AlertCircle size={16} />
              <span className="hidden sm:inline">Debt</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <PortfolioOverview />
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <IncomeTracking />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <ExpenseTrackingEditable />
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <AssetManagementEditable />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <TaskManagementEditable />
            </div>
          </TabsContent>

          <TabsContent value="debt" className="space-y-6">
            <div className="brutalist-card rounded-lg border-2 border-border">
              <DebtTrackingEditable />
            </div>
          </TabsContent>
        </Tabs>

        <div className="brutalist-card rounded-lg border-2 border-border">
          <ProjectionChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
