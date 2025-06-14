
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, User, Heart, TrendingUp, Briefcase } from "lucide-react";

export const IncomeTracking = () => {
  const passiveIncome = [
    { source: "Locação Macuco", amount: 6000, status: "pending", icon: Home, note: "Not rented yet, simulated" },
    { source: "Locação Laurindo", amount: 1600, status: "active", icon: Home },
    { source: "Aposentadoria Mãe", amount: 1518, status: "active", icon: User },
    { source: "Locação Ataliba", amount: 1300, status: "active", icon: Home },
    { source: "Apoio da IRA", amount: 1000, status: "active", icon: Heart },
    { source: "Aposentadoria Pai", amount: 0, status: "pending", icon: User }
  ];

  const activeIncome = [
    { source: "Freelas Pai", amount: 600, status: "active", icon: Briefcase },
    { source: "CLT GUI (Gestor Seller)", amount: 1800, status: "active", icon: Briefcase },
    { source: "Freelas GUI", amount: 600, status: "active", icon: Briefcase }
  ];

  const totalPassive = passiveIncome.reduce((sum, income) => sum + income.amount, 0);
  const totalActive = activeIncome.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = totalPassive + totalActive;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      default: return 'Inactive';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Passive Income */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <TrendingUp size={20} />
            Passive Income
          </CardTitle>
          <div className="text-2xl font-bold text-green-700">
            R$ {totalPassive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {passiveIncome.map((income, index) => {
            const Icon = income.icon;
            const percentage = totalPassive > 0 ? (income.amount / totalPassive) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2 p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-green-600" />
                    <span className="font-medium">{income.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(income.status)}>
                      {getStatusText(income.status)}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold">R$ {income.amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                {income.amount > 0 && (
                  <Progress value={percentage} className="h-2" />
                )}
                {income.note && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    {income.note}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Income */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Briefcase size={20} />
            Active Income
          </CardTitle>
          <div className="text-2xl font-bold text-blue-700">
            R$ {totalActive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeIncome.map((income, index) => {
            const Icon = income.icon;
            const percentage = totalActive > 0 ? (income.amount / totalActive) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2 p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-blue-600" />
                    <span className="font-medium">{income.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(income.status)}>
                      {getStatusText(income.status)}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold">R$ {income.amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Income Summary */}
      <Card className="lg:col-span-2 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Income Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Passive Income</div>
              <div className="text-xl font-bold text-green-600">
                R$ {totalPassive.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalIncome > 0 ? ((totalPassive / totalIncome) * 100).toFixed(1) : 0}% of total
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Active Income</div>
              <div className="text-xl font-bold text-blue-600">
                R$ {totalActive.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalIncome > 0 ? ((totalActive / totalIncome) * 100).toFixed(1) : 0}% of total
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-purple-200">
              <div className="text-sm text-slate-600">Total Monthly Income</div>
              <div className="text-2xl font-bold text-purple-600">
                R$ {totalIncome.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                R$ {(totalIncome * 12).toLocaleString()}/year
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
