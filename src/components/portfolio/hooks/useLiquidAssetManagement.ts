
import { useState } from 'react';
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { fetchStockPrice, fetchMetalPrice, fetchWalletValue } from '@/services/stockService';
import { toast } from "@/hooks/use-toast";

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' }
];

export const useLiquidAssetManagement = () => {
  const { data, updateLiquidAsset, addLiquidAsset, removeLiquidAsset } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [assetType, setAssetType] = useState<'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet'>('manual');
  
  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    icon: 'Wallet',
    isActive: true,
    cryptoSymbol: '',
    stockSymbol: '',
    stockName: '',
    quantity: 0,
    metalSymbol: '',
    walletAddress: '',
    autoCompound: false,
    monthlyYield: 0
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
      quantity: 0,
      metalSymbol: '',
      walletAddress: '',
      autoCompound: false,
      monthlyYield: 0
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

  const calculateMetalValue = async (metalSymbol: string, quantity: number) => {
    try {
      const metalData = await fetchMetalPrice(metalSymbol);
      if (metalData) {
        return metalData.price * quantity;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating metal value:', error);
      return 0;
    }
  };

  const calculateWalletValue = async (walletAddress: string) => {
    try {
      return await fetchWalletValue(walletAddress);
    } catch (error) {
      console.error('Error calculating wallet value:', error);
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
    if (!formData.name.trim() && assetType !== 'wallet') {
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
        quantity: formData.quantity,
        autoCompound: assetType === 'reit' ? formData.autoCompound : false,
        monthlyYield: assetType === 'reit' && formData.autoCompound ? formData.monthlyYield : 0
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, stockAssetData);
      } else {
        addLiquidAsset(stockAssetData);
      }
    }
    else if (assetType === 'metal' && formData.metalSymbol && formData.quantity > 0) {
      finalValue = await calculateMetalValue(formData.metalSymbol, formData.quantity);
      
      const metalAssetData = {
        ...baseAssetData,
        value: finalValue,
        isPreciousMetal: true,
        metalSymbol: formData.metalSymbol,
        quantity: formData.quantity
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, metalAssetData);
      } else {
        addLiquidAsset(metalAssetData);
      }
    }
    else if (assetType === 'wallet' && formData.walletAddress) {
      finalValue = await calculateWalletValue(formData.walletAddress);
      
      const walletAssetData = {
        ...baseAssetData,
        value: finalValue,
        isWalletTracked: true,
        walletAddress: formData.walletAddress
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, walletAssetData);
      } else {
        addLiquidAsset(walletAssetData);
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
    } else if (asset.isPreciousMetal) {
      setAssetType('metal');
    } else if (asset.isWalletTracked) {
      setAssetType('wallet');
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
      quantity: asset.quantity || 0,
      metalSymbol: asset.metalSymbol || '',
      walletAddress: asset.walletAddress || '',
      autoCompound: asset.autoCompound || false,
      monthlyYield: asset.monthlyYield || 0
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

  return {
    data,
    isDialogOpen,
    setIsDialogOpen,
    editingAsset,
    assetType,
    setAssetType,
    formData,
    setFormData,
    resetForm,
    handleStockSelection,
    handleSubmit,
    handleEdit,
    handleDelete,
    updateLiquidAsset,
    calculateCryptoValue
  };
};
