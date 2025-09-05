
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, ChevronDown, ChevronUp } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useProjectionCalculations } from "@/components/projection/hooks/useProjectionCalculations";

export const ProjectionCard = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionCardCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('projectionCardCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

  // Use unified projection logic for consistency with the chart
  const { projectionData } = useProjectionCalculations();
  const projectedRevenue = projectionData.slice(1).reduce((sum, m: any) => sum + (m.monthlyIncome || 0), 0);
  const projectedExpenses = projectionData.slice(1).reduce((sum, m: any) => sum + (m.monthlyExpenses || 0), 0);
  const netResult = projectedRevenue - projectedExpenses;
  const totalCompoundedPassive = projectionData.slice(1).reduce((sum, m: any) => sum + (m.compoundedPassive || 0), 0);
  const totalCompoundedAssets = projectionData.slice(1).reduce((sum, m: any) => sum + (m.compoundedAssets || 0), 0);
  const totalCompounded = totalCompoundedPassive + totalCompoundedAssets;

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <PieChart size={16} className="text-accent" />
            {data.projectionMonths}-month {t.projection || 'projection'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-accent hover:text-accent/80 p-1"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">Revenue ({data.projectionMonths}m)</div>
              <div className="text-xs sm:text-sm md:text-xl font-bold text-accent truncate font-mono">
                {currencySymbol} {projectedRevenue.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">Expenses ({data.projectionMonths}m)</div>
              <div className="text-xs sm:text-sm md:text-xl font-bold text-red-400 truncate font-mono">
                {currencySymbol} {projectedExpenses.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">Debt</div>
              <div className="text-xs sm:text-sm md:text-xl font-bold text-orange-400 truncate font-mono">
                {currencySymbol} {data.debts.filter(d => d.isActive).reduce((s, d) => s + d.amount, 0).toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase">Compound Gains ({data.projectionMonths}m)</div>
              <div className={`text-xs sm:text-sm md:text-xl font-bold truncate font-mono ${totalCompounded >= 0 ? 'text-accent' : 'text-red-400'}`}>
                {currencySymbol} {totalCompounded.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-1">
                Passive: {currencySymbol}{totalCompoundedPassive.toLocaleString()} · Assets: {currencySymbol}{totalCompoundedAssets.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
