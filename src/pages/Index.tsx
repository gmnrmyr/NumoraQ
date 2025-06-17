
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  PieChart,
  BarChart3
} from "lucide-react";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { DataManagementSection } from "@/components/DataManagementSection";
import { MobileNav } from "@/components/MobileNav";
import { UserProfileSection } from "@/components/UserProfileSection";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { DevMenu } from "@/components/DevMenu";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { data, updateExchangeRate, updateProjectionMonths } = useFinancialData();

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
        <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
          {/* Header - Mobile optimized */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2 sm:gap-3">
              <DollarSign className="text-blue-600" size={24} />
              <span className="hidden sm:inline">Financial Dashboard</span>
              <span className="sm:hidden">FinDash</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">Complete financial overview and management</p>
          </div>

          {/* User Profile Section */}
          <UserProfileSection />

          {/* Data Management - Collapsible */}
          <DataManagementSection />

          {/* Exchange Rates Banner - Mobile optimized */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-around items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <DollarSign size={14} />
                  <span className="text-xs">BRL/USD:</span>
                  <EditableValue
                    value={data.exchangeRates.brlToUsd}
                    onSave={(value) => updateExchangeRate('brlToUsd', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <TrendingUp size={14} />
                  <span className="text-xs">BTC:</span>
                  <EditableValue
                    value={data.exchangeRates.btcPrice}
                    onSave={(value) => updateExchangeRate('btcPrice', Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs">Proj:</span>
                  <EditableValue
                    value={data.projectionMonths}
                    onSave={(value) => updateProjectionMonths(Number(value))}
                    type="number"
                    className="text-white bg-white/20 hover:bg-white/30 text-xs"
                  />
                  <span className="text-xs">m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Overview - Mobile grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-700 flex items-center gap-1 sm:gap-2">
                  <DollarSign size={14} />
                  <span className="hidden sm:inline">Available Now</span>
                  <span className="sm:hidden">Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-green-800">
                  {currencySymbol} {totalAvailable.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 flex items-center gap-1 sm:gap-2">
                  <TrendingUp size={14} />
                  <span className="hidden sm:inline">Monthly Income</span>
                  <span className="sm:hidden">Income</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-blue-800">
                  {currencySymbol} {(totalPassiveIncome + totalActiveIncome).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-red-700 flex items-center gap-1 sm:gap-2">
                  <TrendingDown size={14} />
                  <span className="hidden sm:inline">Monthly Expenses</span>
                  <span className="sm:hidden">Expenses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-red-800">
                  {currencySymbol} {totalRecurringExpenses.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-orange-700 flex items-center gap-1 sm:gap-2">
                  <AlertCircle size={14} />
                  <span className="hidden sm:inline">Active Debts</span>
                  <span className="sm:hidden">Debts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-orange-800">
                  {currencySymbol} {totalActiveDebt.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className={`col-span-2 lg:col-span-1 ${monthlyBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${monthlyBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  <BarChart3 size={14} />
                  <span className="hidden sm:inline">Monthly Balance</span>
                  <span className="sm:hidden">Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg sm:text-2xl font-bold ${monthlyBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {currencySymbol} {monthlyBalance.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projection Card - Mobile optimized */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2 text-sm sm:text-base">
                <PieChart size={16} />
                {data.projectionMonths}-Month Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-600">Income ({data.projectionMonths}m)</div>
                  <div className="text-sm sm:text-xl font-bold text-green-600">
                    {currencySymbol} {((totalPassiveIncome + totalActiveIncome) * data.projectionMonths).toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-600">Expenses ({data.projectionMonths}m)</div>
                  <div className="text-sm sm:text-xl font-bold text-red-600">
                    {currencySymbol} {(totalRecurringExpenses * data.projectionMonths + totalVariableExpenses).toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-600">Debts</div>
                  <div className="text-sm sm:text-xl font-bold text-orange-600">
                    {currencySymbol} {totalActiveDebt.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-600">Net Result</div>
                  <div className={`text-sm sm:text-xl font-bold ${yearProjection >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {currencySymbol} {yearProjection.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Tabs - Mobile optimized */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

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
        
        <DevMenu />
      </div>
      <Footer />
    </>
  );
};

export default Index;
