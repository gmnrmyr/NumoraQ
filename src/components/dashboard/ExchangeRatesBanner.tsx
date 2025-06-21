
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Settings, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { EditableValue } from "@/components/ui/editable-value";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useLivePrices } from "@/hooks/useLivePrices";

export const ExchangeRatesBanner = () => {
  const { data, updateExchangeRate, updateProjectionMonths, updateUserProfile } = useFinancialData();
  const { t } = useTranslation();
  const { timeSinceLastUpdate, isLiveDataEnabled } = useLivePrices();
  const [liveEnabled, setLiveEnabled] = useState(data.userProfile?.liveDataEnabled ?? true);

  const handleLiveToggle = (enabled: boolean) => {
    setLiveEnabled(enabled);
    updateUserProfile({ liveDataEnabled: enabled });
  };

  return (
    <Card className="bg-accent/10 border-accent border-2 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono uppercase text-accent flex items-center gap-2">
          <Zap size={16} />
          Live Prices & Projection Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
        <div className="space-y-3">
          {/* Live Prices Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Market Data</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={liveEnabled}
                  onCheckedChange={handleLiveToggle}
                  className="scale-75"
                />
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${liveEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-xs font-mono text-muted-foreground">
                    Live: {liveEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1 justify-center">
                <DollarSign size={12} className="text-accent" />
                <span className="text-foreground font-mono">BRL/USD:</span>
                <EditableValue
                  value={data.exchangeRates.brlToUsd}
                  onSave={(value) => updateExchangeRate('brlToUsd', Number(value))}
                  type="number"
                  disabled={liveEnabled}
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
                  disabled={liveEnabled}
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
                  disabled={liveEnabled}
                  className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-16"
                />
              </div>
            </div>

            {data.exchangeRates.lastUpdated && (
              <div className="text-xs font-mono text-muted-foreground text-center">
                Updated: {timeSinceLastUpdate || 'just now'}
              </div>
            )}
          </div>

          {/* Projection Settings Section */}
          <div className="border-t border-border/50 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Projection Period</span>
              <div className="flex items-center gap-1">
                <Settings size={12} className="text-accent" />
                <span className="text-foreground font-mono">{t.projection.substring(0, 4)}:</span>
                <EditableValue
                  value={data.projectionMonths}
                  onSave={(value) => updateProjectionMonths(Number(value))}
                  type="number"
                  className="text-foreground bg-background/50 hover:bg-background/70 border-border text-xs w-8"
                />
                <span className="text-foreground font-mono">months</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
