
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockSelector } from './StockSelector';
import { useFinancialData } from "@/contexts/FinancialDataContext";

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' }
];

interface AssetFormFieldsProps {
  assetType: 'manual' | 'crypto' | 'stock' | 'reit';
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  onStockSelection: (symbol: string, name: string) => void;
  currency: string;
}

export const AssetFormFields = ({ 
  assetType, 
  formData, 
  setFormData, 
  onStockSelection, 
  currency 
}: AssetFormFieldsProps) => {
  const { data } = useFinancialData();

  const calculateCryptoValue = (cryptoSymbol: string, quantity: number) => {
    const crypto = CRYPTO_OPTIONS.find(c => c.symbol === cryptoSymbol);
    if (!crypto) return 0;
    
    const price = data.exchangeRates[crypto.key as keyof typeof data.exchangeRates] as number;
    return price * quantity;
  };

  return (
    <>
      <div>
        <Label htmlFor="name" className="font-mono text-xs uppercase">Asset Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-input border-2 border-border font-mono"
          placeholder={
            assetType === 'crypto' ? "e.g., My Bitcoin" : 
            assetType === 'stock' ? "e.g., Apple Stock" : 
            assetType === 'reit' ? "e.g., Real Estate Fund" :
            "e.g., Cash, Savings Account"
          }
        />
      </div>

      {assetType === 'crypto' && (
        <>
          <div>
            <Label className="font-mono text-xs uppercase">Cryptocurrency</Label>
            <Select 
              value={formData.cryptoSymbol} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cryptoSymbol: value }))}
            >
              <SelectTrigger className="bg-input border-2 border-border font-mono">
                <SelectValue placeholder="Select crypto" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_OPTIONS.map(crypto => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity" className="font-mono text-xs uppercase">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.00000001"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              className="bg-input border-2 border-border font-mono"
              placeholder="0.0"
            />
            {formData.cryptoSymbol && formData.quantity > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Value: {currency} {calculateCryptoValue(formData.cryptoSymbol, formData.quantity).toLocaleString()}
              </div>
            )}
          </div>
        </>
      )}

      {(assetType === 'stock' || assetType === 'reit') && (
        <>
          <div>
            <Label className="font-mono text-xs uppercase">
              {assetType === 'reit' ? 'REIT/FII Symbol' : 'Stock Symbol'}
            </Label>
            <StockSelector
              value={formData.stockSymbol}
              onChange={onStockSelection}
              placeholder={
                assetType === 'reit' 
                  ? "Search REITs/FIIs (e.g., HGLG11, VNQ, VTEB11)" 
                  : "Search stocks (e.g., AAPL, NVDA, PETR4.SA)"
              }
              assetType={assetType}
            />
          </div>

          <div>
            <Label htmlFor="stockQuantity" className="font-mono text-xs uppercase">
              {assetType === 'reit' ? 'Shares/Quotas' : 'Shares'}
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              className="bg-input border-2 border-border font-mono"
              placeholder="0"
            />
            {formData.stockSymbol && formData.quantity > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Estimated value will be calculated with live prices
              </div>
            )}
          </div>
        </>
      )}

      {assetType === 'manual' && (
        <div>
          <Label htmlFor="value" className="font-mono text-xs uppercase">Value ({currency})</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
            className="bg-input border-2 border-border font-mono"
            placeholder="0"
          />
        </div>
      )}
    </>
  );
};
