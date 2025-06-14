
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Home, DollarSign } from "lucide-react";

export const DebtTracking = () => {
  const debts = [
    {
      creditor: "Goodstorage Avaria",
      amount: 1200,
      dueDate: "INDEF",
      status: "pending",
      icon: Home,
      description: "Storage damage compensation"
    },
    {
      creditor: "Devo Mãe (Cond, Conv, etc...)",
      amount: 2000,
      dueDate: "INDEF",
      status: "pending",
      icon: User,
      description: "Family loan - various expenses"
    },
    {
      creditor: "Devo Fernando",
      amount: 5000,
      dueDate: "INDEF",
      status: "pending",
      icon: User,
      description: "Personal loan"
    }
  ];

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'partial': return 'Partial';
      case 'paid': return 'Paid';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Debt Overview */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle size={20} />
            Debt Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Outstanding Debt</div>
              <div className="text-3xl font-bold text-red-600">
                R$ {totalDebt.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Number of Creditors</div>
              <div className="text-3xl font-bold text-orange-600">{debts.length}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Status</div>
              <Badge className="bg-red-100 text-red-800 border-red-200 text-lg px-3 py-1">
                All Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Debts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {debts.map((debt, index) => {
          const Icon = debt.icon;
          
          return (
            <Card key={index} className="bg-white shadow-lg border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon size={20} className="text-red-600" />
                  <span className="truncate">{debt.creditor}</span>
                </CardTitle>
                <Badge className={getStatusColor(debt.status)}>
                  {getStatusText(debt.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Amount Owed</span>
                    <span className="text-xl font-bold text-red-600">
                      R$ {debt.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Due Date</span>
                    <Badge variant="outline" className="text-orange-600">
                      {debt.dueDate}
                    </Badge>
                  </div>
                </div>

                {debt.description && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-700">{debt.description}</div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-slate-500">
                    Percentage of total debt: {((debt.amount / totalDebt) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Strategy */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <DollarSign size={20} />
            Payment Strategy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-medium text-slate-800 mb-2">Debt Avalanche Method</h4>
              <p className="text-sm text-slate-600 mb-2">Pay minimums on all debts, focus extra payments on highest interest rate first.</p>
              <div className="text-xs text-blue-600">
                Note: Interest rates not specified for these debts
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-medium text-slate-800 mb-2">Debt Snowball Method</h4>
              <p className="text-sm text-slate-600 mb-2">Pay minimums on all debts, focus extra payments on smallest balance first.</p>
              <div className="text-xs text-green-600">
                Start with: Goodstorage (R$ 1.200)
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">💡 Recommendation</h4>
            <p className="text-sm text-amber-700">
              Since all debts have indefinite due dates, consider negotiating payment plans or settlements. 
              The family debt (Mãe) might be the most flexible for renegotiation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Debt to Income Ratio */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Debt Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Available Cash vs Debt</div>
              <div className="text-lg font-bold text-slate-700">
                R$ 38.100 available
              </div>
              <div className="text-lg font-bold text-red-600">
                R$ {totalDebt.toLocaleString()} owed
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Debt represents {((totalDebt / 38100) * 100).toFixed(0)}% of available cash
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Monthly Income vs Debt</div>
              <div className="text-lg font-bold text-green-600">
                R$ 12.518/month income
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Could pay off all debt in {Math.ceil(totalDebt / 12518)} months if dedicated entirely
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
