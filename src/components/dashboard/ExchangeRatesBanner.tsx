
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { EditableValue } from "@/components/ui/editable-value";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const ExchangeRatesBanner = () => {
  const { data, updateExchangeRate, updateProjectionMonths } = useFinancialData();
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 justify-center">
            <DollarSign size={12} />
            <span>BRL/USD:</span>
            <EditableValue
              value={data.exchangeRates.brlToUsd}
              onSave={(value) => updateExchangeRate('brlToUsd', Number(value))}
              type="number"
              className="text-white bg-white/20 hover:bg-white/30 text-xs w-16"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <TrendingUp size={12} />
            <span>BTC:</span>
            <EditableValue
              value={data.exchangeRates.btcPrice}
              onSave={(value) => updateExchangeRate('btcPrice', Number(value))}
              type="number"
              className="text-white bg-white/20 hover:bg-white/30 text-xs w-20"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <TrendingUp size={12} />
            <span>ETH:</span>
            <EditableValue
              value={data.exchangeRates.ethPrice}
              onSave={(value) => updateExchangeRate('ethPrice', Number(value))}
              type="number"
              className="text-white bg-white/20 hover:bg-white/30 text-xs w-16"
            />
          </div>
          <div className="flex items-center gap-1 justify-center">
            <span>{t.projection.substring(0, 4)}:</span>
            <EditableValue
              value={data.projectionMonths}
              onSave={(value) => updateProjectionMonths(Number(value))}
              type="number"
              className="text-white bg-white/20 hover:bg-white/30 text-xs w-8"
            />
            <span>m</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
