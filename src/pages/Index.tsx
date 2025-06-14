
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BarChart3
} from "lucide-react";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTracking } from "@/components/ExpenseTracking";
import { AssetManagement } from "@/components/AssetManagement";
import { TaskManagement } from "@/components/TaskManagement";
import { DebtTracking } from "@/components/DebtTracking";
import { ProjectionChart } from "@/components/ProjectionChart";

const Index = () => {
  // Exchange rates and crypto prices
  const exchangeRates = {
    brlToUsd: 0.18,
    usdToBrl: 5.54,
    btcPrice: 588300,
    ethPrice: 14000
  };

  // Key financial metrics
  const totalAvailable = 38100;
  const totalPassiveIncome = 10118;
  const totalActiveIncome = 2400;
  const totalRecurringExpenses = 10585;
  const totalVariableExpenses = 45900;
  const yearProjection = 53496;

  const monthlyBalance = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Financial Dashboard</h1>
          <p className="text-slate-600">Complete financial overview and management system</p>
        </div>

        {/* Exchange Rates Banner */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-around items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                <span>BRL/USD: R$ {exchangeRates.brlToUsd}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                <span>USD/BRL: R$ {exchangeRates.usdToBrl}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>BTC: R$ {exchangeRates.btcPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>ETH: R$ {exchangeRates.ethPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <DollarSign size={16} />
                Available Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                R$ {totalAvailable.toLocaleString()}
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
                R$ {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">
                Passive: R$ {totalPassiveIncome.toLocaleString()} | Active: R$ {totalActiveIncome.toLocaleString()}
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
                R$ {totalRecurringExpenses.toLocaleString()}
              </div>
              <div className="text-xs text-red-600">
                Recurring monthly expenses
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
                R$ {monthlyBalance.toLocaleString()}
              </div>
              <div className={`text-xs ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyBalance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 12-Month Projection */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <PieChart size={20} />
              12-Month Financial Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-600">Total Income (12m)</div>
                <div className="text-xl font-bold text-green-600">R$ 188.316</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Total Expenses (12m)</div>
                <div className="text-xl font-bold text-red-600">R$ 172.920</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Net Projection</div>
                <div className="text-2xl font-bold text-purple-600">R$ {yearProjection.toLocaleString()}</div>
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
            <ExpenseTracking />
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <AssetManagement />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TaskManagement />
          </TabsContent>

          <TabsContent value="debt" className="space-y-6">
            <DebtTracking />
          </TabsContent>
        </Tabs>

        <ProjectionChart />
      </div>
    </div>
  );
};

export default Index;
