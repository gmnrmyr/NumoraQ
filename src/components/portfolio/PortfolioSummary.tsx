import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/contexts/financial-data/dataTypes';

interface PortfolioSummaryProps {
  showWalletTracker?: boolean;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ showWalletTracker = false }) => {
  const { data } = useFinancialData();

  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPortfolio = totalLiquid + totalIlliquid;

  return (
    <div className="space-y-6">
      <Card className="lg:col-span-2 bg-card border-accent border-2 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground font-mono uppercase">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Total Liquid (Active)</div>
              <div className="text-xl font-bold text-accent font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {totalPortfolio > 0 ? ((totalLiquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-background border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Total Illiquid (Active)</div>
              <div className="text-xl font-bold text-foreground font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalIlliquid.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {totalPortfolio > 0 ? ((totalIlliquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-background border-2 border-accent brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Total Portfolio (Active)</div>
              <div className="text-2xl font-bold text-accent font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalPortfolio.toLocaleString()}
              </div>
              <Badge variant="outline" className="mt-1 border-accent text-accent font-mono">Active Assets Only</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tracker Integration */}
      {showWalletTracker && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-mono uppercase text-accent">
              Blockchain Wallets
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              Track your crypto portfolios across multiple blockchains
            </p>
          </div>
          <WalletTracker />
        </div>
      )}
    </div>
  );
};
