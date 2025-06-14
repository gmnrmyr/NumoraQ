
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from "@/contexts/FinancialDataContext";

export const PortfolioSummary = () => {
  const { data } = useFinancialData();

  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPortfolio = totalLiquid + totalIlliquid;

  return (
    <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-slate-600">Total Liquid (Active)</div>
            <div className="text-xl font-bold text-green-600">
              {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              {totalPortfolio > 0 ? ((totalLiquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-slate-600">Total Illiquid (Active)</div>
            <div className="text-xl font-bold text-slate-600">
              {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalIlliquid.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              {totalPortfolio > 0 ? ((totalIlliquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
            </div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-blue-200">
            <div className="text-sm text-slate-600">Total Portfolio (Active)</div>
            <div className="text-2xl font-bold text-blue-600">
              {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalPortfolio.toLocaleString()}
            </div>
            <Badge variant="outline" className="mt-1">Active Assets Only</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
