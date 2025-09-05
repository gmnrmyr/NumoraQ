import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Home, User, Heart, TrendingUp, Briefcase, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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

  // Fix: Calculate totals based on active status
  const totalPassive = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalActive = data.activeIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);
  
  const totalIncome = totalPassive + totalActive;

  const handleAddPassiveIncome = () => {
    addPassiveIncome({
      source: "New Passive Income",
      amount: 0,
      status: 'active',
      icon: 'TrendingUp'
    });
  };

  const handleAddActiveIncome = () => {
    addActiveIncome({
      source: "New Active Income",
      amount: 0,
      status: 'active',
      icon: 'Briefcase'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Passive Income */}
      <Card className="bg-card/95 backdrop-blur-md border-2 border-green-600 brutalist-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-400 flex items-center gap-2 font-mono uppercase">
              <TrendingUp size={20} />
              Passive Income
            </CardTitle>
            <Button
              onClick={handleAddPassiveIncome}
              size="sm"
              className="bg-green-600 hover:bg-green-700 brutalist-button"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="text-2xl font-bold text-green-400 font-mono">
            $ {totalPassive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.passiveIncome.map((income) => {
            const Icon = iconMap[income.icon] || TrendingUp;
            const percentage = totalPassive > 0 ? (income.amount / totalPassive) * 100 : 0;
            
            return (
              <div key={income.id} className="space-y-2 p-3 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-green-400" />
                    <EditableValue
                      value={income.source}
                      onSave={(value) => updatePassiveIncome(income.id, { source: String(value) })}
                      type="text"
                      className="font-medium bg-input border-2 border-border font-mono"
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
                      <div className="font-bold text-green-400 font-mono">
                        $ <EditableValue
                          value={income.amount}
                          onSave={(value) => updatePassiveIncome(income.id, { amount: Number(value) })}
                          type="number"
                          className="inline bg-input border-2 border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {income.amount > 0 && (
                  <Progress value={percentage} className="h-2 bg-muted" />
                )}
                {/* Scheduling Controls */}
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-foreground">Schedule</span>
                      <Switch
                        checked={Boolean((income as any).useSchedule)}
                        onCheckedChange={(checked) => updatePassiveIncome(income.id, { useSchedule: checked } as any)}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-foreground">Start</span>
                      <Input
                        type="month"
                        value={((income as any).startDate || '').slice(0,7)}
                        onChange={(e) => updatePassiveIncome(income.id, { startDate: e.target.value } as any)}
                        className="h-7 w-28 bg-input border-2 border-border px-2"
                        disabled={!((income as any).useSchedule)}
                      />
                      <span className="text-muted-foreground">End</span>
                      <Input
                        type="month"
                        value={((income as any).endDate || '').slice(0,7)}
                        onChange={(e) => updatePassiveIncome(income.id, { endDate: e.target.value || undefined } as any)}
                        className="h-7 w-28 bg-input border-2 border-border px-2"
                        disabled={!((income as any).useSchedule)}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    When scheduled, this income is included in projections between start and end months (end optional).
                  </div>
                </div>

                {/* Compounding Controls */}
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-foreground">Compounding</span>
                      <Switch
                        checked={Boolean((income as any).compoundEnabled)}
                        onCheckedChange={(checked) => updatePassiveIncome(income.id, { compoundEnabled: checked } as any)}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-foreground">APY %</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={String((income as any).compoundAnnualRate ?? '')}
                        onChange={(e) => updatePassiveIncome(income.id, { compoundAnnualRate: e.target.value === '' ? undefined : Number(e.target.value) } as any)}
                        className="h-7 w-20 bg-input border-2 border-border px-2"
                        disabled={!((income as any).compoundEnabled)}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                    Monthly compounding from APY: growth is added to monthly income; principal assumed as the current amount.
                  </div>
                </div>
                <div className="mt-2">
                  <EditableValue
                    value={income.note || ""}
                    onSave={(value) => updatePassiveIncome(income.id, { note: String(value) || undefined })}
                    type="text"
                    placeholder="Add note..."
                    className="text-xs text-accent bg-background border-2 border-border p-2 rounded w-full font-mono"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Income */}
      <Card className="bg-card/95 backdrop-blur-md border-2 border-blue-600 brutalist-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-400 flex items-center gap-2 font-mono uppercase">
              <Briefcase size={20} />
              Active Income
            </CardTitle>
            <Button
              onClick={handleAddActiveIncome}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 brutalist-button"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            $ {totalActive.toLocaleString()}/month
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.activeIncome.map((income) => {
            const Icon = iconMap[income.icon] || Briefcase;
            const percentage = totalActive > 0 ? (income.amount / totalActive) * 100 : 0;
            
            return (
              <div key={income.id} className="space-y-2 p-3 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-blue-400" />
                    <EditableValue
                      value={income.source}
                      onSave={(value) => updateActiveIncome(income.id, { source: String(value) })}
                      type="text"
                      className="font-medium bg-input border-2 border-border font-mono"
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
                      <div className="font-bold text-blue-400 font-mono">
                        $ <EditableValue
                          value={income.amount}
                          onSave={(value) => updateActiveIncome(income.id, { amount: Number(value) })}
                          type="number"
                          className="inline bg-input border-2 border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2 bg-muted" />
                <div className="mt-2">
                  <EditableValue
                    value={(income as any).note || ""}
                    onSave={(value) => updateActiveIncome(income.id, { note: String(value) || undefined } as any)}
                    type="text"
                    placeholder="Add note..."
                    className="text-xs text-accent bg-background border-2 border-border p-2 rounded w-full font-mono"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Income Summary */}
      <Card className="lg:col-span-2 bg-card/95 backdrop-blur-md border-2 border-accent brutalist-card">
        <CardHeader>
          <CardTitle className="text-accent font-mono uppercase">Income Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Passive Income</div>
              <div className="text-xl font-bold text-green-400 font-mono">
                $ {totalPassive.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {totalIncome > 0 ? ((totalPassive / totalIncome) * 100).toFixed(1) : 0}% of total
              </div>
            </div>
            <div className="text-center p-4 bg-background/50 border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Active Income</div>
              <div className="text-xl font-bold text-blue-400 font-mono">
                $ {totalActive.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {totalIncome > 0 ? ((totalActive / totalIncome) * 100).toFixed(1) : 0}% of total
              </div>
            </div>
            <div className="text-center p-4 bg-background/50 border-2 border-accent brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Total Monthly Income</div>
              <div className="text-2xl font-bold text-accent font-mono">
                $ {totalIncome.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                $ {(totalIncome * data.projectionMonths).toLocaleString()}/{data.projectionMonths}-month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
