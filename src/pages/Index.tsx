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
  User
} from "lucide-react";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { DataToolbar } from "@/components/DataToolbar";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { DevMenu } from "@/components/DevMenu";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { data, updateExchangeRate, updateUserProfile, updateProjectionMonths } = useFinancialData();

  // Helper function to get currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

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
  const yearProjection = (monthlyBalance * data.projectionMonths) - totalVariableExpenses + totalAvailable - totalActiveDebt;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-4">
        <div className="max-w-7xl mx-auto space-y-6 px-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
              <DollarSign className="text-blue-600" size={32} />
              Financial Dashboard
            </h1>
            <p className="text-slate-600">Complete financial overview and management system</p>
          </div>

          {/* Data Management Toolbar */}
          <DataToolbar />

          {/* Exchange Rates Banner */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex flex-wrap justify-around items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>BRL/USD: </span>
                  <EditableValue
                    value={data.exchangeRates.brlToUsd}
                    onSave={(value) => updateExchangeRate('brlToUsd', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>USD/BRL: R$ </span>
                  <EditableValue
                    value={data.exchangeRates.usdToBrl}
                    onSave={(value) => updateExchangeRate('usdToBrl', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>BTC: {currencySymbol} </span>
                  <EditableValue
                    value={data.exchangeRates.btcPrice}
                    onSave={(value) => updateExchangeRate('btcPrice', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>ETH: {currencySymbol} </span>
                  <EditableValue
                    value={data.exchangeRates.ethPrice}
                    onSave={(value) => updateExchangeRate('ethPrice', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Projection: </span>
                  <EditableValue
                    value={data.projectionMonths}
                    onSave={(value) => updateProjectionMonths(Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30"
                  />
                  <span> months</span>
                </div>
                {data.exchangeRates.lastUpdated && (
                  <div className="flex items-center gap-2 text-xs opacity-75">
                    <span>Updated: {new Date(data.exchangeRates.lastUpdated).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Overview - updated to use dynamic currency symbol */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <DollarSign size={16} />
                  Available Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">
                  {currencySymbol} {totalAvailable.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">
                  {currencySymbol} {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">
                  Passive: {currencySymbol} {totalPassiveIncome.toLocaleString()} | Active: {currencySymbol} {totalActiveIncome.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <TrendingDown size={16} />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">
                  {currencySymbol} {totalRecurringExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-red-600">
                  Recurring monthly expenses
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Active Debts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800">
                  {currencySymbol} {totalActiveDebt.toLocaleString()}
                </div>
                <div className="text-xs text-orange-600">
                  {activeDebts.length} active debts
                </div>
              </CardContent>
            </Card>

            <Card className={`${monthlyBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium flex items-center gap-2 ${monthlyBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  <BarChart3 size={16} />
                  Monthly Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {currencySymbol} {monthlyBalance.toLocaleString()}
                </div>
                <div className={`text-xs ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {monthlyBalance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 12-Month Projection - updated currency symbols */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <PieChart size={20} />
                {data.projectionMonths}-Month Financial Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-slate-600">Total Income ({data.projectionMonths}m)</div>
                  <div className="text-xl font-bold text-green-600">
                    {currencySymbol} {((totalPassiveIncome + totalActiveIncome) * data.projectionMonths).toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Total Expenses ({data.projectionMonths}m)</div>
                  <div className="text-xl font-bold text-red-600">
                    {currencySymbol} {(totalRecurringExpenses * data.projectionMonths + totalVariableExpenses).toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Active Debts</div>
                  <div className="text-xl font-bold text-orange-600">
                    {currencySymbol} {totalActiveDebt.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Net Projection</div>
                  <div className={`text-2xl font-bold ${yearProjection >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {currencySymbol} {yearProjection.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
              <TabsTrigger value="portfolio" className="flex items-center gap-2 px-3 py-2">
                <Briefcase size={16} />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2 px-3 py-2">
                <TrendingUp size={16} />
                <span className="hidden sm:inline">Income</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2 px-3 py-2">
                <TrendingDown size={16} />
                <span className="hidden sm:inline">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-2 px-3 py-2">
                <Home size={16} />
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2 px-3 py-2">
                <Calendar size={16} />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="debt" className="flex items-center gap-2 px-3 py-2">
                <AlertCircle size={16} />
                <span className="hidden sm:inline">Debt</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioOverview />
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <IncomeTracking />
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <ExpenseTrackingEditable />
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <AssetManagementEditable />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <TaskManagementEditable />
            </TabsContent>

            <TabsContent value="debt" className="space-y-6">
              <DebtTrackingEditable />
            </TabsContent>
          </Tabs>

          <ProjectionChart />
        </div>
        
        {/* Add DevMenu at the end */}
        <DevMenu />
      </div>
      <Footer />
    </>
  );
};

export default Index;
