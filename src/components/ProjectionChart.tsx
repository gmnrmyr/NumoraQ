
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Settings, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { EditableValue } from "@/components/ui/editable-value";

export const ProjectionChart = () => {
  const { data, updateProjectionMonths } = useFinancialData();
  const { t } = useTranslation();
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
  
  const activeDebts = data.debts.filter(debt => debt.isActive);
  const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
  
  const netProjection = totalIncomeProjection - totalExpensesProjection - totalActiveDebt;
  const netProjectionWithPortfolio = netProjection + availableNow;

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

  const passiveIncomeRatio = totalIncomeProjection > 0 ? (projectionData.passiveIncomeProjection / projectionData.totalIncomeProjection) * 100 : 0;
  const savingsRate = monthlyBreakdown.monthlyTotalIncome > 0 ? (monthlyBreakdown.monthlyBalance / monthlyBreakdown.monthlyTotalIncome) * 100 : 0;
  const debtToIncomeRatio = totalIncomeProjection > 0 ? (projectionData.totalActiveDebt / projectionData.totalIncomeProjection) * 100 : 0;

  const getFinancialHealthStatus = () => {
    if (monthlyBreakdown.monthlyBalance < 0) return { status: 'warning', text: t('health.warning'), color: 'text-red-600' };
    if (passiveIncomeRatio >= 50) return { status: 'excellent', text: t('health.excellent'), color: 'text-green-600' };
    if (savingsRate >= 20) return { status: 'good', text: t('health.good'), color: 'text-blue-600' };
    if (savingsRate >= 10) return { status: 'fair', text: t('health.fair'), color: 'text-yellow-600' };
    return { status: 'needs-improvement', text: t('health.needs_improvement'), color: 'text-orange-600' };
  };

  const healthStatus = getFinancialHealthStatus();

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border-purple-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <TrendingUp size={24} />
            <EditableValue
              value={projectionMonths}
              onSave={(value) => updateProjectionMonths(Number(value))}
              type="number"
              className="inline-block"
            />
            {t('projection.title')}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Settings size={16} />
            <span>{t('projection.editable_period')}</span>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          {t('projection.forecast_from')} {today.toLocaleDateString()} {t('projection.to')} {projectionEndMonth} {projectionEndYear}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Financial Health Score */}
        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-800 flex items-center gap-2">
              {healthStatus.status === 'excellent' ? <CheckCircle size={16} /> : 
               healthStatus.status === 'warning' ? <AlertTriangle size={16} /> : <Target size={16} />}
              {t('projection.financial_health')}
            </h3>
            <Badge className={`${healthStatus.color} bg-opacity-10 border-opacity-20`}>
              {healthStatus.text}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{t('health.passive_income_ratio')}</div>
              <div className="text-lg font-semibold">{passiveIncomeRatio.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{t('health.savings_rate')}</div>
              <div className="text-lg font-semibold">{savingsRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{t('health.debt_to_income')}</div>
              <div className="text-lg font-semibold">{debtToIncomeRatio.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <DollarSign size={16} />
            {t('projection.starting_position')}
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {currencySymbol} {projectionData.availableNow.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">{t('projection.available_cash')}</div>
        </div>

        {/* Income Projections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="font-medium text-green-800">{t('projection.passive_income')}</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {currencySymbol} {projectionData.passiveIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyPassiveIncome).toLocaleString()}{t('common.per_month')}
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="font-medium text-blue-800">{t('projection.active_income')}</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {currencySymbol} {projectionData.activeIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyActiveIncome).toLocaleString()}{t('common.per_month')}
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="font-medium text-green-800">{t('projection.total_income')}</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {currencySymbol} {projectionData.totalIncomeProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyTotalIncome).toLocaleString()}{t('common.per_month')}
            </div>
          </div>
        </div>

        {/* Expense Projections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-600" />
              <span className="font-medium text-red-800">{t('projection.recurring_expenses')}</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {currencySymbol} {projectionData.recurringExpensesProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {currencySymbol} {Math.round(monthlyBreakdown.monthlyRecurringExpenses).toLocaleString()}{t('common.per_month')}
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-orange-600" />
              <span className="font-medium text-orange-800">{t('projection.variable_expenses')}</span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {currencySymbol} {projectionData.variableExpenses.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">{t('projection.one_time_expenses')}</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-600" />
              <span className="font-medium text-red-800">{t('projection.active_debts')}</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {currencySymbol} {projectionData.totalActiveDebt.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">{activeDebts.length} {t('common.active_debts_count')}</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-600" />
              <span className="font-medium text-red-800">{t('projection.total_obligations')}</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              {currencySymbol} {(projectionData.totalExpensesProjection + projectionData.totalActiveDebt).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">{t('projection.expenses_debts')}</div>
          </div>
        </div>

        {/* Net Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className={projectionData.netProjection >= 0 ? "text-green-600" : "text-red-600"} />
              <span className={`font-medium ${projectionData.netProjection >= 0 ? "text-green-800" : "text-red-800"}`}>
                {projectionMonths}-{t('projection.net_result')}
              </span>
            </div>
            <div className={`text-2xl font-bold ${projectionData.netProjection >= 0 ? "text-green-600" : "text-red-600"}`}>
              {currencySymbol} {projectionData.netProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {t('projection.income_minus_expenses')}
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-purple-100 to-green-100 rounded-lg shadow-sm border-2 border-purple-300">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className={projectionData.netProjectionWithPortfolio >= 0 ? "text-purple-600" : "text-red-600"} />
              <span className={`font-medium ${projectionData.netProjectionWithPortfolio >= 0 ? "text-purple-800" : "text-red-800"}`}>{t('projection.final_position')}</span>
            </div>
            <div className={`text-3xl font-bold ${projectionData.netProjectionWithPortfolio >= 0 ? "text-purple-600" : "text-red-600"}`}>
              {currencySymbol} {projectionData.netProjectionWithPortfolio.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {t('projection.net_result_current')}
            </div>
          </div>
        </div>

        {/* Monthly Cash Flow */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">{t('projection.monthly_cash_flow')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-600">{t('projection.average_monthly_balance')}</div>
              <div className={`text-xl font-bold ${monthlyBreakdown.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol} {Math.round(monthlyBreakdown.monthlyBalance).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600">{t('projection.cash_flow_status')}</div>
              <Badge className={monthlyBreakdown.month


Balance >= 0 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
              }>
                {monthlyBreakdown.monthlyBalance >= 0 ? t('dashboard.positive_cash_flow') : t('dashboard.negative_cash_flow')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Key Insights */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">📊 {t('projection.key_insights')}</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• {t('income.passive')} income represents {totalIncomeProjection > 0 ? ((projectionData.passiveIncomeProjection / projectionData.totalIncomeProjection) * 100).toFixed(0) : 0}% of total income {passiveIncomeRatio < 30 ? '(Consider increasing passive income sources)' : passiveIncomeRatio >= 50 ? '(Excellent passive income ratio!)' : ''}</li>
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
