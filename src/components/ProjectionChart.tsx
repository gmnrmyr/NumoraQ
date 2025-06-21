
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useProjectionCalculations } from "./projection/hooks/useProjectionCalculations";
import { ProjectionMetrics } from "./projection/ProjectionMetrics";
import { FinancialIndependencePanel } from "./projection/FinancialIndependencePanel";
import { IncomeBreakdownPanel } from "./projection/IncomeBreakdownPanel";
import { ProjectionChart as Chart } from "./projection/ProjectionChart";
import { MonthlyBreakdownTable } from "./projection/MonthlyBreakdownTable";
import { RiskAssessmentPanel } from "./projection/RiskAssessmentPanel";
import { ProjectionInsights } from "./projection/ProjectionInsights";

export const ProjectionChart = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionChartCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const {
    projectionData,
    initialBalance,
    finalBalance,
    isPositiveProjection,
    totalGrowth,
    monthlyAverage,
    fiRatio,
    monthsToFI,
    monthlyExpenses
  } = useProjectionCalculations();

  useEffect(() => {
    localStorage.setItem('projectionChartCollapsed', JSON.stringify(isCollapsed));
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

  return (
    <Card className="bg-card border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base font-mono uppercase">
            <TrendingUp size={16} className="text-accent" />
            Advanced Financial Projection - {data.projectionMonths} Months
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
          <ProjectionMetrics
            initialBalance={initialBalance}
            finalBalance={finalBalance}
            totalGrowth={totalGrowth}
            monthlyAverage={monthlyAverage}
            isPositiveProjection={isPositiveProjection}
            currencySymbol={currencySymbol}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <FinancialIndependencePanel
              fiRatio={fiRatio}
              monthsToFI={monthsToFI}
            />
            <IncomeBreakdownPanel
              projectionData={projectionData}
              currencySymbol={currencySymbol}
            />
          </div>

          <Chart
            projectionData={projectionData}
            isPositiveProjection={isPositiveProjection}
            currencySymbol={currencySymbol}
          />

          <MonthlyBreakdownTable
            projectionData={projectionData}
            currencySymbol={currencySymbol}
          />

          <RiskAssessmentPanel
            initialBalance={initialBalance}
            monthlyExpenses={monthlyExpenses}
            fiRatio={fiRatio}
            isPositiveProjection={isPositiveProjection}
            totalGrowth={totalGrowth}
            projectionMonths={data.projectionMonths}
          />

          <ProjectionInsights
            isPositiveProjection={isPositiveProjection}
            projectionMonths={data.projectionMonths}
            totalGrowth={totalGrowth}
            monthlyNetChange={projectionData[1]?.netChange || 0}
            fiRatio={fiRatio}
            currencySymbol={currencySymbol}
          />
        </CardContent>
      )}
    </Card>
  );
};
