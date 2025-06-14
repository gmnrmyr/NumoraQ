
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

export const ProjectionChart = () => {
  const currentYear = new Date().getFullYear();
  
  const projectionData = {
    availableNow: 38100,
    passiveIncome12m: 121416,
    activeIncome12m: 28800,
    totalIncome12m: 188316,
    recurringExpenses12m: 127020,
    variableExpenses: 45900,
    totalExpenses12m: 172920,
    netProjection: 15396,
    netProjectionWithPortfolio: 53496
  };

  const monthlyBreakdown = {
    monthlyPassiveIncome: projectionData.passiveIncome12m / 12,
    monthlyActiveIncome: projectionData.activeIncome12m / 12,
    monthlyTotalIncome: projectionData.totalIncome12m / 12,
    monthlyRecurringExpenses: projectionData.recurringExpenses12m / 12,
    monthlyBalance: (projectionData.totalIncome12m - projectionData.recurringExpenses12m) / 12
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800 flex items-center gap-2">
          <TrendingUp size={24} />
          12-Month Financial Projection ({currentYear})
        </CardTitle>
        <div className="text-sm text-slate-600">
          Complete financial forecast including all income sources and expenses
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Position */}
        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <DollarSign size={16} />
            Starting Position
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            R$ {projectionData.availableNow.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Available cash now</div>
        </div>

        {/* Income Projections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="font-medium text-green-800">Passive Income</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              R$ {projectionData.passiveIncome12m.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              R$ {Math.round(monthlyBreakdown.monthlyPassiveIncome).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="font-medium text-blue-800">Active Income</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              R$ {projectionData.activeIncome12m.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              R$ {Math.round(monthlyBreakdown.monthlyActiveIncome).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="font-medium text-green-800">Total Income</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              R$ {projectionData.totalIncome12m.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              R$ {Math.round(monthlyBreakdown.monthlyTotalIncome).toLocaleString()}/month
            </div>
          </div>
        </div>

        {/* Expense Projections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-600" />
              <span className="font-medium text-red-800">Recurring Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              R$ {projectionData.recurringExpenses12m.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              R$ {Math.round(monthlyBreakdown.monthlyRecurringExpenses).toLocaleString()}/month
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-orange-600" />
              <span className="font-medium text-orange-800">Variable Expenses</span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              R$ {projectionData.variableExpenses.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">One-time expenses</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-red-600" />
              <span className="font-medium text-red-800">Total Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              R$ {projectionData.totalExpenses12m.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Complete 12-month cost</div>
          </div>
        </div>

        {/* Net Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-green-600" />
              <span className="font-medium text-green-800">12-Month Net Result</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              R$ {projectionData.netProjection.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              Income minus all expenses
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-purple-100 to-green-100 rounded-lg shadow-sm border-2 border-purple-300">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-purple-600" />
              <span className="font-medium text-purple-800">Final Position</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              R$ {projectionData.netProjectionWithPortfolio.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              Net result + current available
            </div>
          </div>
        </div>

        {/* Monthly Cash Flow */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Monthly Cash Flow Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-600">Average Monthly Balance</div>
              <div className={`text-xl font-bold ${monthlyBreakdown.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {Math.round(monthlyBreakdown.monthlyBalance).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Cash Flow Status</div>
              <Badge className={monthlyBreakdown.monthlyBalance >= 0 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
              }>
                {monthlyBreakdown.monthlyBalance >= 0 ? 'Positive Cash Flow' : 'Negative Cash Flow'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">📊 Key Insights</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Passive income represents {((projectionData.passiveIncome12m / projectionData.totalIncome12m) * 100).toFixed(0)}% of total income</li>
            <li>• Variable expenses are {((projectionData.variableExpenses / projectionData.totalExpenses12m) * 100).toFixed(0)}% of total expenses</li>
            <li>• Monthly savings rate: {monthlyBreakdown.monthlyBalance >= 0 ? '+' : ''}{((monthlyBreakdown.monthlyBalance / monthlyBreakdown.monthlyTotalIncome) * 100).toFixed(1)}%</li>
            <li>• Projected financial position improvement: +{((projectionData.netProjectionWithPortfolio / projectionData.availableNow - 1) * 100).toFixed(0)}%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
