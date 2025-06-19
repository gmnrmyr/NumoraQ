import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ExchangeRatesBanner = () => {
  const { data, updateExchangeRate, updateProjectionMonths } = useFinancialData();
  const { t } = useTranslation();
  const isLiveDataEnabled = true; // Example value, replace with actual logic
  const timeAgo = '1 hour ago'; // Example value, replace with actual logic

  return (
    <Card className="bg-accent/10 border-accent border-2 backdrop-blur-sm">
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 justify-center">
            <DollarSign size={12} className="text-accent" />
            <span className="text-foreground font-mono">BRL/USD:</span>
            <EditableValue
              value={data.exchangeRates.brlToUsd}
              onSave={(value) => updateExchangeRate('brlToUsd', Number(value))}
              type="number"
              className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-16"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <TrendingUp size={12} className="text-accent" />
            <span className="text-foreground font-mono">BTC:</span>
            <EditableValue
              value={data.exchangeRates.btcPrice}
              onSave={(value) => updateExchangeRate('btcPrice', Number(value))}
              type="number"
              className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-20"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <TrendingUp size={12} className="text-accent" />
            <span className="text-foreground font-mono">ETH:</span>
            <EditableValue
              value={data.exchangeRates.ethPrice}
              onSave={(value) => updateExchangeRate('ethPrice', Number(value))}
              type="number"
              className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-16"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span className="text-foreground font-mono">{t.projection.substring(0, 4)}:</span>
            <EditableValue
              value={data.projectionMonths}
              onSave={(value) => updateProjectionMonths(Number(value))}
              type="number"
              className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-8"
            />
            <span className="text-foreground font-mono">m</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isLiveDataEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs font-mono text-muted-foreground">
                  Live: {isLiveDataEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
              
              {data.exchangeRates.lastUpdated && (
                <div className="text-xs font-mono text-muted-foreground">
                  Updated: {timeAgo}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
