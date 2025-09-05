
import { useState } from 'react';

export const useAssetForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [assetType, setAssetType] = useState<'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet' | 'nft'>('manual');
  
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
    monthlyYield: 0,
    compoundEnabled: false,
    compoundAnnualRate: 0,
    nftContractAddress: '',
    nftCollectionName: ''
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
      monthlyYield: 0,
      compoundEnabled: false,
      compoundAnnualRate: 0,
      nftContractAddress: '',
      nftCollectionName: ''
    });
    setEditingAsset(null);
    setAssetType('manual');
  };

  const handleStockSelection = (symbol: string, name: string) => {
    setFormData(prev => ({ 
      ...prev, 
      stockSymbol: symbol,
      stockName: name,
      name: name || symbol
    }));
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    
    // Fix the NFT detection logic
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
    } else if (asset.isNFT) { // This was missing!
      setAssetType('nft');
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
      monthlyYield: asset.monthlyYield || 0,
      compoundEnabled: asset.compoundEnabled || false,
      compoundAnnualRate: asset.compoundAnnualRate || 0,
      nftContractAddress: asset.nftContractAddress || '',
      nftCollectionName: asset.nftCollectionName || ''
    });
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingAsset,
    assetType,
    setAssetType,
    formData,
    setFormData,
    resetForm,
    handleStockSelection,
    handleEdit
  };
};
