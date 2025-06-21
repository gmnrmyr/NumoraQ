
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { StockSelector } from './StockSelector';
import { PreciousMetalSelector } from './PreciousMetalSelector';
import { WalletAddressInput } from './WalletAddressInput';
import { Bitcoin, Coins } from "lucide-react";

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' }
];

interface AssetFormFieldsProps {
  assetType: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet';
  formData: any;
  setFormData: (data: any) => void;
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
  const handleMetalSelection = (symbol: string, name: string) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      metalSymbol: symbol,
      name: name
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono text-xs uppercase">Asset Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter asset name"
          className="bg-input border-2 border-border font-mono"
        />
      </div>

      {assetType === 'crypto' && (
        <>
          <div>
            <Label className="font-mono text-xs uppercase">Cryptocurrency</Label>
            <div className="grid grid-cols-2 gap-2">
              {CRYPTO_OPTIONS.map((crypto) => (
                <button
                  key={crypto.symbol}
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ 
                    ...prev, 
                    cryptoSymbol: crypto.symbol,
                    name: crypto.name
                  }))}
                  className={`p-3 border-2 font-mono text-sm flex items-center gap-2 ${
                    formData.cryptoSymbol === crypto.symbol
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-input hover:border-accent/50'
                  }`}
                >
                  <Bitcoin size={16} />
                  {crypto.symbol}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-mono text-xs uppercase">Quantity</Label>
            <Input
              type="number"
              step="0.00000001"
              value={formData.quantity}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00000000"
              className="bg-input border-2 border-border font-mono"
            />
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
              placeholder={assetType === 'reit' ? "Search REITs/FIIs (e.g., HGLG11, VNQ)" : "Search stocks (e.g., AAPL, NVDA)"}
              assetType={assetType}
            />
          </div>
          <div>
            <Label className="font-mono text-xs uppercase">
              {assetType === 'reit' ? 'Quotas' : 'Shares'}
            </Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="bg-input border-2 border-border font-mono"
            />
          </div>
          {assetType === 'reit' && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoCompound"
                  checked={formData.autoCompound || false}
                  onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, autoCompound: checked }))}
                />
                <Label htmlFor="autoCompound" className="font-mono text-xs uppercase">
                  Auto-Compound Monthly
                </Label>
              </div>
              {formData.autoCompound && (
                <div>
                  <Label className="font-mono text-xs uppercase">Monthly Yield (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.monthlyYield || 0}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, monthlyYield: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.50"
                    className="bg-input border-2 border-border font-mono"
                  />
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    Estimated monthly dividend yield percentage
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {assetType === 'metal' && (
        <>
          <div>
            <Label className="font-mono text-xs uppercase">Precious Metal</Label>
            <PreciousMetalSelector
              value={formData.metalSymbol}
              onChange={handleMetalSelection}
            />
          </div>
          <div>
            <Label className="font-mono text-xs uppercase">Quantity (oz)</Label>
            <Input
              type="number"
              step="0.001"
              value={formData.quantity}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              placeholder="0.000"
              className="bg-input border-2 border-border font-mono"
            />
          </div>
        </>
      )}

      {assetType === 'wallet' && (
        <>
          <WalletAddressInput
            value={formData.walletAddress || ''}
            onChange={(address) => setFormData((prev: any) => ({ 
              ...prev, 
              walletAddress: address,
              name: address ? `Wallet ${address.slice(0, 6)}...${address.slice(-4)}` : ''
            }))}
          />
          <div className="text-xs text-muted-foreground font-mono">
            We'll automatically fetch and track the total USD value of tokens in this wallet
          </div>
        </>
      )}

      {assetType === 'manual' && (
        <div>
          <Label className="font-mono text-xs uppercase">Value ({currency})</Label>
          <Input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
            placeholder="0"
            className="bg-input border-2 border-border font-mono"
          />
        </div>
      )}
    </div>
  );
};
