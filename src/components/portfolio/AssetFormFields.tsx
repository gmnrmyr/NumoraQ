import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StockSelector } from './StockSelector';
import { PreciousMetalSelector } from './PreciousMetalSelector';
import { WalletAddressInput } from './WalletAddressInput';
import { NFTCollectionInput } from './NFTCollectionInput';

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' }
];

interface AssetFormFieldsProps {
  assetType: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet' | 'nft';
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
  const renderTypeSpecificFields = () => {
    switch (assetType) {
      case 'crypto':
        return (
          <>
            <div>
              <Label className="font-mono text-xs uppercase">Cryptocurrency</Label>
              <select
                value={formData.cryptoSymbol}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, cryptoSymbol: e.target.value }))}
                className="w-full p-2 border-2 border-border bg-input font-mono"
              >
                <option value="">Select Crypto</option>
                {CRYPTO_OPTIONS.map(crypto => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="font-mono text-xs uppercase">Quantity</Label>
              <Input
                type="number"
                step="0.00000001"
                value={formData.quantity || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="0.1"
                className="font-mono"
              />
            </div>
          </>
        );

      case 'stock':
      case 'reit':
        return (
          <>
            <StockSelector
              value={formData.stockSymbol}
              onChange={onStockSelection}
              isReit={assetType === 'reit'}
            />
            <div>
              <Label className="font-mono text-xs uppercase">
                {assetType === 'reit' ? 'Quotas' : 'Shares'}
              </Label>
              <Input
                type="number"
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="100"
                className="font-mono"
              />
            </div>
            {assetType === 'reit' && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoCompound"
                    checked={formData.autoCompound}
                    onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, autoCompound: checked }))}
                  />
                  <Label htmlFor="autoCompound" className="font-mono text-xs uppercase">Auto-Compound</Label>
                </div>
                {formData.autoCompound && (
                  <div>
                    <Label className="font-mono text-xs uppercase">Monthly Yield (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={formData.monthlyYield || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, monthlyYield: Number(e.target.value) }))}
                      placeholder="0.5"
                      className="font-mono"
                    />
                  </div>
                )}
              </>
            )}
          </>
        );

      case 'metal':
        return (
          <>
            <PreciousMetalSelector
              value={formData.metalSymbol}
              onChange={(symbol) => setFormData((prev: any) => ({ ...prev, metalSymbol: symbol }))}
            />
            <div>
              <Label className="font-mono text-xs uppercase">Quantity (oz)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="1.0"
                className="font-mono"
              />
            </div>
          </>
        );

      case 'wallet':
        return (
          <WalletAddressInput
            value={formData.walletAddress}
            onChange={(address) => setFormData((prev: any) => ({ ...prev, walletAddress: address }))}
          />
        );

      case 'nft':
        return (
          <NFTCollectionInput
            contractAddress={formData.nftContractAddress || ''}
            onContractAddressChange={(address) => setFormData((prev: any) => ({ ...prev, nftContractAddress: address }))}
            collectionName={formData.nftCollectionName || ''}
            onCollectionNameChange={(name) => setFormData((prev: any) => ({ ...prev, nftCollectionName: name }))}
            quantity={formData.quantity || 1}
            onQuantityChange={(quantity) => setFormData((prev: any) => ({ ...prev, quantity }))}
          />
        );

      default:
        return (
          <div>
            <Label className="font-mono text-xs uppercase">Value ({currency})</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.value || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, value: Number(e.target.value) }))}
              placeholder="1000"
              className="font-mono"
            />
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="compoundEnabled"
                  checked={formData.compoundEnabled}
                  onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, compoundEnabled: checked }))}
                />
                <Label htmlFor="compoundEnabled" className="font-mono text-xs uppercase">Compound (APY)</Label>
              </div>
              {formData.compoundEnabled && (
                <div>
                  <Label className="font-mono text-xs uppercase">APY (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.compoundAnnualRate || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, compoundAnnualRate: Number(e.target.value) }))}
                    placeholder="6.0"
                    className="font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {assetType !== 'nft' && (
        <div>
          <Label className="font-mono text-xs uppercase">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            placeholder="Asset Name"
            className="font-mono"
          />
        </div>
      )}

      {/* Currency selector for manual entry */}
      {assetType === 'manual' && (
        <div>
          <Label className="font-mono text-xs uppercase">Currency</Label>
          <select
            value={formData.currency || 'BRL'}
            onChange={e => setFormData((prev: any) => ({ ...prev, currency: e.target.value }))}
            className="w-full p-2 border-2 border-border bg-input font-mono"
          >
            <option value="BRL">BRL (R$)</option>
            <option value="USD">USD ($)</option>
            <option value="BTC">BTC (₿)</option>
            <option value="ETH">ETH (Ξ)</option>
          </select>
        </div>
      )}

      {renderTypeSpecificFields()}
    </div>
  );
};
