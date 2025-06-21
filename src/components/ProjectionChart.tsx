
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useProjectionCalculations } from "@/components/projection/hooks/useProjectionCalculations";
import { ProjectionMetrics } from "@/components/projection/ProjectionMetrics";
import { FinancialIndependencePanel } from "@/components/projection/FinancialIndependencePanel";
import { IncomeBreakdownPanel } from "@/components/projection/IncomeBreakdownPanel";
import { MonthlyBreakdownTable } from "@/components/projection/MonthlyBreakdownTable";
import { RiskAssessmentPanel } from "@/components/projection/RiskAssessmentPanel";
import { ProjectionInsights } from "@/components/projection/ProjectionInsights";

export const ProjectionChart = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('projectionChartCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('projectionChartCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const {
    projectionData,
    initialBalance,
    finalBalance,
    isPositiveProjection,
    totalGrowth,
    monthlyAverage,
    currencySymbol,
    fiRatio,
    monthsToFI,
    monthlyExpenses,
    passiveIncome
  } = useProjectionCalculations();

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
          {/* Key Metrics Overview */}
          <ProjectionMetrics
            initialBalance={initialBalance}
            finalBalance={finalBalance}
            totalGrowth={totalGrowth}
            monthlyAverage={monthlyAverage}
            currencySymbol={currencySymbol}
            isPositiveProjection={isPositiveProjection}
            projectionMonths={data.projectionMonths}
          />

          {/* Financial Independence and Income Breakdown Panels */}
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

          {/* Chart Section */}
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  label={{ 
                    value: 'Months', 
                    position: 'insideBottomRight', 
                    offset: -10,
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 12
                  }}
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Balance', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 12
                  }}
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid #333',
                    borderRadius: 0,
                    color: '#fff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12
                  }}
                  formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, 'Balance']}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke={isPositiveProjection ? "#00ff00" : "#ff0066"} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
                  activeDot={{ r: 5, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Detail Table */}
          <MonthlyBreakdownTable
            projectionData={projectionData}
            currencySymbol={currencySymbol}
          />

          {/* Risk Assessment Panel */}
          <RiskAssessmentPanel
            initialBalance={initialBalance}
            monthlyExpenses={monthlyExpenses}
            fiRatio={fiRatio}
            totalGrowth={totalGrowth}
            projectionMonths={data.projectionMonths}
            isPositiveProjection={isPositiveProjection}
          />

          {/* AI Insights */}
          <ProjectionInsights
            isPositiveProjection={isPositiveProjection}
            projectionMonths={data.projectionMonths}
            currencySymbol={currencySymbol}
            projectionData={projectionData}
            totalGrowth={totalGrowth}
            fiRatio={fiRatio}
          />
        </CardContent>
      )}
    </Card>
  );
};
