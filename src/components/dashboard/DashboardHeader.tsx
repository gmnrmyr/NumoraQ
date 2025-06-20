
import React from 'react';
import { PlusCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  onAddAsset: () => void;
}

export const DashboardHeader = ({ onAddExpense, onAddIncome, onAddAsset }: DashboardHeaderProps) => {
  const { data } = useFinancialData();
  
  // Calculate totals
  const totalLiquid = data.liquidAssets
    .filter(asset => asset.isActive)
    .reduce((sum, asset) => sum + asset.value, 0);
  
  const totalIlliquid = data.illiquidAssets
    .filter(asset => asset.isActive)
    .reduce((sum, asset) => sum + asset.value, 0);
  
  const totalAssets = totalLiquid + totalIlliquid;
  const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-mono text-accent uppercase tracking-wider">
          FINANCIAL DASHBOARD
        </h1>
        <p className="text-muted-foreground font-mono uppercase text-sm tracking-wide">
          PORTFOLIO MANAGEMENT // WEALTH TRACKING // FUTURE PLANNING
        </p>
      </div>

      {/* Quick Stats */}
      <Card className="brutalist-card bg-accent/5 border-accent">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-lg sm:text-xl font-bold text-accent font-mono">
                {currency} {totalAssets.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase">
                Total Assets
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg sm:text-xl font-bold text-accent font-mono">
                {currency} {totalLiquid.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase">
                Liquid Assets
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg sm:text-xl font-bold text-accent font-mono">
                {data.projectionMonths}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase">
                Projection Months
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={onAddIncome}
          className="brutalist-button flex items-center gap-2 h-12"
          variant="outline"
        >
          <TrendingUp size={16} />
          <span className="font-mono text-xs uppercase">Add Income</span>
        </Button>
        <Button
          onClick={onAddExpense}
          className="brutalist-button flex items-center gap-2 h-12"
          variant="outline"
        >
          <DollarSign size={16} />
          <span className="font-mono text-xs uppercase">Add Expense</span>
        </Button>
        <Button
          onClick={onAddAsset}
          className="brutalist-button flex items-center gap-2 h-12"
          variant="outline"
        >
          <PlusCircle size={16} />
          <span className="font-mono text-xs uppercase">Add Asset</span>
        </Button>
      </div>
    </div>
  );
};
