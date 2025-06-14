
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Home, User, Heart, TrendingUp, Briefcase, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";

const iconMap: { [key: string]: any } = {
  Home,
  User,
  Heart,
  Briefcase
};

export const IncomeTracking = () => {
  const { 
    data, 
    updatePassiveIncome, 
    updateActiveIncome, 
    addPassiveIncome, 
    addActiveIncome,
    removePassiveIncome,
    removeActiveIncome
  } = useFinancialData();

  const totalPassive = data.passiveIncome.reduce((sum, income) => sum + income.amount, 0);
  const totalActive = data.activeIncome.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = totalPassive + totalActive;

  const handleAddPassiveIncome = () => {
    addPassiveIncome({
      source: "New Passive Income",
      amount: 0,
      status: 'pending',
      icon: 'TrendingUp'
    });
  };

  const handleAddActiveIncome = () => {
    addActiveIncome({
      source: "New Active Income",
      amount: 0,
      status: 'pending',
      icon: 'Briefcase'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Passive Income */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp size={20} />
              Passive Income
            </CardTitle>
            <Button
              onClick={handleAddPassiveIncome}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="text-2xl font-bold text-green-700">
            R$ {totalPassive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.passiveIncome.map((income) => {
            const Icon = iconMap[income.icon] || TrendingUp;
            const percentage = totalPassive > 0 ? (income.amount / totalPassive) * 100 : 0;
            
            return (
              <div key={income.id} className="space-y-2 p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-green-600" />
                    <EditableValue
                      value={income.source}
                      onSave={(value) => updatePassiveIncome(income.id, { source: value })}
                      className="font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => removePassiveIncome(income.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <StatusToggle
                      status={income.status}
                      onToggle={(newStatus) => updatePassiveIncome(income.id, { status: newStatus })}
                    />
                    <div className="text-right">
                      <div className="font-bold">
                        R$ <EditableValue
                          value={income.amount}
                          onSave={(value) => updatePassiveIncome(income.id, { amount: value })}
                          className="inline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {income.amount > 0 && (
                  <Progress value={percentage} className="h-2" />
                )}
                <div className="mt-2">
                  <EditableValue
                    value={income.note || ""}
                    onSave={(value) => updatePassiveIncome(income.id, { note: value || undefined })}
                    placeholder="Add note..."
                    className="text-xs text-amber-600 bg-amber-50 p-2 rounded w-full"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Income */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Briefcase size={20} />
              Active Income
            </CardTitle>
            <Button
              onClick={handleAddActiveIncome}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            R$ {totalActive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.activeIncome.map((income) => {
            const Icon = iconMap[income.icon] || Briefcase;
            const percentage = totalActive > 0 ? (income.amount / totalActive) * 100 : 0;
            
            return (
              <div key={income.id} className="space-y-2 p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-blue-600" />
                    <EditableValue
                      value={income.source}
                      onSave={(value) => updateActiveIncome(income.id, { source: value })}
                      className="font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => removeActiveIncome(income.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <StatusToggle
                      status={income.status}
                      onToggle={(newStatus) => updateActiveIncome(income.id, { status: newStatus })}
                    />
                    <div className="text-right">
                      <div className="font-bold">
                        R$ <EditableValue
                          value={income.amount}
                          onSave={(value) => updateActiveIncome(income.id, { amount: value })}
                          className="inline"
                        />
                      </div>
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
                R$ {(totalIncome * data.projectionMonths).toLocaleString()}/{data.projectionMonths}-month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
