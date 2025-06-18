import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Settings, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";

export const ProjectionChart = () => {
  const { data, updateProjectionMonths } = useFinancialData();
  const today = new Date();
  const projectionMonths = data.projectionMonths;
  
  // Calculate the projection end date
  const projectionEndDate = new Date(today);
  projectionEndDate.setMonth(projectionEndDate.getMonth() + projectionMonths);
  const projectionEndYear = projectionEndDate.getFullYear();
  const projectionEndMonth = projectionEndDate.toLocaleDateString('en-US', { month: 'long' });
  
  // Calculate values from actual data
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const availableNow = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const passiveIncomeMonthly = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const activeIncomeMonthly = data.activeIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalIncomeMonthly = passiveIncomeMonthly + activeIncomeMonthly;
  const totalIncomeProjection = totalIncomeMonthly * projectionMonths;
  
  const recurringExpensesMonthly = data.expenses
    .filter(expense => expense.type === 'recurring' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const recurringExpensesProjection = recurringExpensesMonthly * projectionMonths;
  
  const variableExpenses = data.expenses
    .filter(expense => expense.type === 'variable' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalExpensesProjection = recurringExpensesProjection + variableExpenses;
  
  // Include active debts in calculations
  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const netProjection = totalIncomeProjection - totalExpensesProjection - totalActiveDebt;
  const netProjectionWithPortfolio = netProjection + availableNow;

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

  const projectionData = {
    availableNow,
    passiveIncomeProjection: passiveIncomeMonthly * projectionMonths,
    activeIncomeProjection: activeIncomeMonthly * projectionMonths,
    totalIncomeProjection,
    recurringExpensesProjection,
    variableExpenses,
    totalExpensesProjection,
    totalActiveDebt,
    netProjection,
    netProjectionWithPortfolio
  };

  const monthlyBreakdown = {
    monthlyPassiveIncome: passiveIncomeMonthly,
    monthlyActiveIncome: activeIncomeMonthly,
    monthlyTotalIncome: totalIncomeMonthly,
    monthlyRecurringExpenses: recurringExpensesMonthly,
    monthlyBalance: totalIncomeMonthly - recurringExpensesMonthly
  };

  // Financial health indicators
  const passiveIncomeRatio = totalIncomeProjection > 0 ? (projectionData.passiveIncomeProjection / projectionData.totalIncomeProjection) * 100 : 0;
  const savingsRate = monthlyBreakdown.monthlyTotalIncome > 0 ? (monthlyBreakdown.monthlyBalance / monthlyBreakdown.monthlyTotalIncome) * 100 : 0;
  const debtToIncomeRatio = totalIncomeProjection > 0 ? (projectionData.totalActiveDebt / projectionData.totalIncomeProjection) * 100 : 0;

  // Financial health status
  const getFinancialHealthStatus = () => {
    if (monthlyBreakdown.monthlyBalance < 0) return { status: 'warning', text: 'Negative Cash Flow', color: 'text-red-400' };
    if (passiveIncomeRatio >= 50) return { status: 'excellent', text: 'Excellent', color: 'text-green-400' };
    if (savingsRate >= 20) return { status: 'good', text: 'Good', color: 'text-blue-400' };
    if (savingsRate >= 10) return { status: 'fair', text: 'Fair', color: 'text-yellow-400' };
    return { status: 'needs-improvement', text: 'Needs Improvement', color: 'text-orange-400' };
  };

  const healthStatus = getFinancialHealthStatus();

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent border-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-accent flex items-center gap-2 font-mono uppercase">
            <TrendingUp size={24} />
            <EditableValue
              value={projectionMonths}
              onSave={(value) => updateProjectionMonths(Number(value))}
              type="number"
              className="inline-block"
            />
            -Month Financial Projection
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings size={16} />
            <span className="font-mono">Editable period</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          Complete financial forecast from {today.toLocaleDateString()} to {projectionEndMonth} {projectionEndYear}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Financial Health Score */}
        <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-accent/30 brutalist-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-accent flex items-center gap-2 font-mono uppercase">
              {healthStatus.status === 'excellent' ? <CheckCircle size={16} /> : 
               healthStatus.status === 'warning' ? <AlertTriangle size={16} /> : <Target size={16} />}
              Financial Health Score
            </h3>
            <Badge className={`${healthStatus.color} bg-card/50 border-border font-mono`}>
              {healthStatus.text}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-mono">Passive Income Ratio</div>
              <div className="text-lg font-semibold text-foreground font-mono">{passiveIncomeRatio.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-mono">Savings Rate</div>
              <div className="text-lg font-semibold text-foreground font-mono">{savingsRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-mono">Debt-to-Income</div>
              <div className="text-lg font-semibold text-foreground font-mono">{debtToIncomeRatio.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-blue-500/30 brutalist-card">
          <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2 font-mono uppercase">
            <DollarSign size={16} />
            Starting Position
          </h3>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {currencySymbol} {projectionData.availableNow.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Available cash now</div>
        </div>

        {/* Income Projections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-green-500/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="font-medium text-green-400 font-mono uppercase">Passive Income</span>
            </div>
            <div className="text-xl font-bold text-green-400 font-mono">
              {currencySymbol} {projectionData.passiveIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyPassiveIncome).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-blue-500/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="font-medium text-blue-400 font-mono uppercase">Active Income</span>
            </div>
            <div className="text-xl font-bold text-blue-400 font-mono">
              {currencySymbol} {projectionData.activeIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyActiveIncome).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-accent/50 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-accent" />
              <span className="font-medium text-accent font-mono uppercase">Total Income</span>
            </div>
            <div className="text-xl font-bold text-accent font-mono">
              {currencySymbol} {projectionData.totalIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyTotalIncome).toLocaleString()}/month
            </div>
          </div>
        </div>

        {/* Expense Projections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-red-500/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-400" />
              <span className="font-medium text-red-400 font-mono uppercase">Recurring Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-400 font-mono">
              {currencySymbol} {projectionData.recurringExpensesProjection.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyRecurringExpenses).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-orange-500/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-orange-400" />
              <span className="font-medium text-orange-400 font-mono uppercase">Variable Expenses</span>
            </div>
            <div className="text-xl font-bold text-orange-400 font-mono">
              {currencySymbol} {projectionData.variableExpenses.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">One-time expenses</div>
          </div>
          
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-red-500/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-400" />
              <span className="font-medium text-red-400 font-mono uppercase">Active Debts</span>
            </div>
            <div className="text-xl font-bold text-red-400 font-mono">
              {currencySymbol} {projectionData.totalActiveDebt.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">{activeDebts.length} active debts</div>
          </div>
          
          <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-red-500/50 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-400" />
              <span className="font-medium text-red-400 font-mono uppercase">Total Obligations</span>
            </div>
            <div className="text-xl font-bold text-red-400 font-mono">
              {currencySymbol} {(projectionData.totalExpensesProjection + projectionData.totalActiveDebt).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Expenses + debts</div>
          </div>
        </div>

        {/* Net Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/30 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className={projectionData.netProjection >= 0 ? "text-accent" : "text-red-400"} />
              <span className={`font-medium ${projectionData.netProjection >= 0 ? "text-accent" : "text-red-400"} font-mono uppercase`}>
                {projectionMonths}-Month Net Result
              </span>
            </div>
            <div className={`text-2xl font-bold ${projectionData.netProjection >= 0 ? "text-accent" : "text-red-400"} font-mono`}>
              {currencySymbol} {projectionData.netProjection.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              Income minus expenses and debts
            </div>
          </div>
          
          <div className="p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/50 brutalist-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className={projectionData.netProjectionWithPortfolio >= 0 ? "text-accent" : "text-red-400"} />
              <span className={`font-medium ${projectionData.netProjectionWithPortfolio >= 0 ? "text-accent" : "text-red-400"} font-mono uppercase`}>Final Position</span>
            </div>
            <div className={`text-3xl font-bold ${projectionData.netProjectionWithPortfolio >= 0 ? "text-accent" : "text-red-400"} font-mono`}>
              {currencySymbol} {projectionData.netProjectionWithPortfolio.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              Net result + current available
            </div>
          </div>
        </div>

        {/* Monthly Cash Flow */}
        <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-blue-500/30 brutalist-card">
          <h3 className="font-semibold text-blue-400 mb-3 font-mono uppercase">Monthly Cash Flow Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground font-mono">Average Monthly Balance</div>
              <div className={`text-xl font-bold ${monthlyBreakdown.monthlyBalance >= 0 ? 'text-accent' : 'text-red-400'} font-mono`}>
                {currencySymbol} {Math.round(monthlyBreakdown.monthlyBalance).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-mono">Cash Flow Status</div>
              <Badge className={monthlyBreakdown.monthlyBalance >= 0 
                ? 'bg-card/50 text-accent border-accent font-mono' 
                : 'bg-card/50 text-red-400 border-red-400 font-mono'
              }>
                {monthlyBreakdown.monthlyBalance >= 0 ? 'Positive Cash Flow' : 'Negative Cash Flow'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Key Insights */}
        <div className="p-4 bg-card/50 backdrop-blur-sm border-2 border-yellow-500/30 brutalist-card">
          <h3 className="font-semibold text-yellow-400 mb-2 font-mono uppercase">📊 Key Insights & Recommendations</h3>
          <ul className="text-sm text-muted-foreground space-y-1 font-mono">
            <li>• Passive income represents {totalIncomeProjection > 0 ? ((projectionData.passiveIncomeProjection / projectionData.totalIncomeProjection) * 100).toFixed(0) : 0}% of total income {passiveIncomeRatio < 30 ? '(Consider increasing passive income sources)' : passiveIncomeRatio >= 50 ? '(Excellent passive income ratio!)' : ''}</li>
            <li>• Variable expenses are {(projectionData.totalExpensesProjection + projectionData.totalActiveDebt) > 0 ? ((projectionData.variableExpenses / (projectionData.totalExpensesProjection + projectionData.totalActiveDebt)) * 100).toFixed(0) : 0}% of total obligations</li>
            <li>• Active debts represent {(projectionData.totalExpensesProjection + projectionData.totalActiveDebt) > 0 ? ((projectionData.totalActiveDebt / (projectionData.totalExpensesProjection + projectionData.totalActiveDebt)) * 100).toFixed(0) : 0}% of total obligations {debtToIncomeRatio > 40 ? '(Consider debt reduction strategy)' : ''}</li>
            <li>• Monthly savings rate: {monthlyBreakdown.monthlyTotalIncome > 0 ? (monthlyBreakdown.monthlyBalance >= 0 ? '+' : '') + ((monthlyBreakdown.monthlyBalance / monthlyBreakdown.monthlyTotalIncome) * 100).toFixed(1) : '0.0'}% {savingsRate < 10 ? '(Recommended: 10-20%)' : savingsRate >= 20 ? '(Excellent savings rate!)' : ''}</li>
            {projectionData.netProjectionWithPortfolio > 0 && projectionData.availableNow > 0 && (
              <li>• Projected financial position improvement: +{((projectionData.netProjectionWithPortfolio / projectionData.availableNow - 1) * 100).toFixed(0)}%</li>
            )}
            {monthlyBreakdown.monthlyBalance > 0 && (
              <li>• Time to double current liquid assets: ~{Math.ceil(projectionData.availableNow / monthlyBreakdown.monthlyBalance / 12)} years at current savings rate</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
