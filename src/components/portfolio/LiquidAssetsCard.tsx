import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconSelector } from './IconSelector';
import { AssetTypeSelector } from './AssetTypeSelector';
import { AssetFormFields } from './AssetFormFields';
import { AssetListItem } from './AssetListItem';
import { DevelopmentTooltip } from './DevelopmentTooltip';
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { fetchStockPrice } from '@/services/stockService';
import { toast } from "@/hooks/use-toast";

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' }
];

export const LiquidAssetsCard = () => {
  const { data, updateLiquidAsset, addLiquidAsset, removeLiquidAsset } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [showInactive, setShowInactive] = useState(true);
  const [assetType, setAssetType] = useState<'manual' | 'crypto' | 'stock' | 'reit'>('manual');
  
  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    icon: 'Wallet',
    isActive: true,
    cryptoSymbol: '',
    stockSymbol: '',
    stockName: '',
    quantity: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      value: 0,
      icon: 'Wallet',
      isActive: true,
      cryptoSymbol: '',
      stockSymbol: '',
      stockName: '',
      quantity: 0
    });
    setEditingAsset(null);
    setAssetType('manual');
  };

  const calculateCryptoValue = (cryptoSymbol: string, quantity: number) => {
    const crypto = CRYPTO_OPTIONS.find(c => c.symbol === cryptoSymbol);
    if (!crypto) return 0;
    
    const price = data.exchangeRates[crypto.key as keyof typeof data.exchangeRates] as number;
    return price * quantity;
  };

  const calculateStockValue = async (stockSymbol: string, quantity: number) => {
    try {
      const stockData = await fetchStockPrice(stockSymbol);
      if (stockData) {
        return stockData.price * quantity;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating stock value:', error);
      return 0;
    }
  };

  const handleStockSelection = (symbol: string, name: string) => {
    setFormData(prev => ({ 
      ...prev, 
      stockSymbol: symbol,
      stockName: name,
      name: name || symbol
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an asset name.",
        variant: "destructive"
      });
      return;
    }

    let finalValue = formData.value;
    
    const baseAssetData = {
      name: formData.name,
      value: finalValue,
      icon: formData.icon,
      isActive: formData.isActive,
      color: 'text-foreground'
    };

    if (assetType === 'crypto' && formData.cryptoSymbol && formData.quantity > 0) {
      finalValue = calculateCryptoValue(formData.cryptoSymbol, formData.quantity);
      
      const cryptoAssetData = {
        ...baseAssetData,
        value: finalValue,
        isCrypto: true,
        cryptoSymbol: formData.cryptoSymbol,
        quantity: formData.quantity
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, cryptoAssetData);
      } else {
        addLiquidAsset(cryptoAssetData);
      }
    }
    else if ((assetType === 'stock' || assetType === 'reit') && formData.stockSymbol && formData.quantity > 0) {
      finalValue = await calculateStockValue(formData.stockSymbol, formData.quantity);
      
      const stockAssetData = {
        ...baseAssetData,
        value: finalValue,
        isStock: true,
        isReit: assetType === 'reit',
        stockSymbol: formData.stockSymbol,
        stockName: formData.stockName,
        quantity: formData.quantity
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, stockAssetData);
      } else {
        addLiquidAsset(stockAssetData);
      }
    }
    else {
      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, baseAssetData);
      } else {
        addLiquidAsset(baseAssetData);
      }
    }

    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingAsset ? "Asset Updated" : "Asset Added",
      description: `${formData.name} has been ${editingAsset ? 'updated' : 'added'} successfully.`
    });
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    if (asset.isCrypto) {
      setAssetType('crypto');
    } else if (asset.isReit) {
      setAssetType('reit');
    } else if (asset.isStock) {
      setAssetType('stock');
    } else {
      setAssetType('manual');
    }
    
    setFormData({
      name: asset.name,
      value: asset.value,
      icon: asset.icon,
      isActive: asset.isActive,
      cryptoSymbol: asset.cryptoSymbol || '',
      stockSymbol: asset.stockSymbol || '',
      stockName: asset.stockName || '',
      quantity: asset.quantity || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (assetId: string) => {
    removeLiquidAsset(assetId);
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed successfully."
    });
  };

  const handleToggleActive = (assetId: string) => {
    const asset = data.liquidAssets.find(a => a.id === assetId);
    if (asset) {
      updateLiquidAsset(assetId, { isActive: !asset.isActive });
    }
  };

  const handleIconChange = (assetId: string, icon: string) => {
    updateLiquidAsset(assetId, { icon });
  };

  // Recalculate crypto values when exchange rates change
  React.useEffect(() => {
    data.liquidAssets.forEach(asset => {
      if (asset.isCrypto && asset.cryptoSymbol && asset.quantity) {
        const newValue = calculateCryptoValue(asset.cryptoSymbol, asset.quantity);
        if (Math.abs(newValue - asset.value) > 0.01) {
          updateLiquidAsset(asset.id, { value: newValue });
        }
      }
    });
  }, [data.exchangeRates.btcPrice, data.exchangeRates.ethPrice]);

  // Periodically update stock prices
  React.useEffect(() => {
    const updateStockPrices = async () => {
      const stockAssets = data.liquidAssets.filter(asset => asset.isStock);
      
      for (const asset of stockAssets) {
        if (asset.stockSymbol && asset.quantity) {
          try {
            const newValue = await calculateStockValue(asset.stockSymbol, asset.quantity);
            if (Math.abs(newValue - asset.value) > 0.01) {
              updateLiquidAsset(asset.id, { value: newValue });
            }
          } catch (error) {
            console.error(`Error updating stock price for ${asset.stockSymbol}:`, error);
          }
        }
      }
    };

    // Update stock prices every 5 minutes
    const interval = setInterval(updateStockPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [data.liquidAssets]);

  const activeAssets = data.liquidAssets.filter(asset => asset.isActive);
  const inactiveAssets = data.liquidAssets.filter(asset => !asset.isActive);
  const displayAssets = showInactive ? data.liquidAssets : activeAssets;
  const totalValue = activeAssets.reduce((sum, asset) => sum + asset.value, 0);
  const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';

  return (
    <div className="space-y-4">
      <DevelopmentTooltip />
      
      <Card className="brutalist-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CardTitle className="text-sm sm:text-base font-mono uppercase text-accent truncate">
                LIQUID ASSETS
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs whitespace-nowrap flex-shrink-0">
                {currency} {totalValue.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInactive(!showInactive)}
                className="brutalist-button text-xs"
              >
                {showInactive ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="hidden sm:inline ml-1">
                  {showInactive ? 'Hide Inactive' : 'Show All'}
                </span>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button text-xs">
                    <Plus size={14} className="mr-1" />
                    <span className="hidden sm:inline">Add Asset</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase text-accent">
                      {editingAsset ? 'Edit Asset' : 'Add Liquid Asset'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <AssetTypeSelector 
                      value={assetType} 
                      onChange={setAssetType} 
                    />
                    
                    <AssetFormFields
                      assetType={assetType}
                      formData={formData}
                      setFormData={setFormData}
                      onStockSelection={handleStockSelection}
                      currency={currency}
                    />

                    <div>
                      <Label className="font-mono text-xs uppercase">Icon</Label>
                      <IconSelector
                        value={formData.icon}
                        onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                        placeholder="Choose an icon"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive" className="font-mono text-xs uppercase">Active</Label>
                    </div>
                    
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full brutalist-button"
                    >
                      {editingAsset ? 'Update Asset' : 'Add Asset'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono text-sm">
              No {showInactive ? '' : 'active '}liquid assets found.
              <br />
              <span className="text-xs">Add your first asset to get started!</span>
            </div>
          ) : (
            displayAssets.map((asset: any) => (
              <AssetListItem
                key={asset.id}
                asset={asset}
                currency={currency}
                onToggleActive={handleToggleActive}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onIconChange={handleIconChange}
              />
            ))
          )}
          
          {inactiveAssets.length > 0 && !showInactive && (
            <div className="text-center text-xs text-muted-foreground font-mono pt-2">
              {inactiveAssets.length} inactive asset(s) hidden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
