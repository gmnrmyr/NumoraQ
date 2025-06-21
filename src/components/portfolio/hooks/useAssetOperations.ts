
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";
import { useAssetCalculations } from './useAssetCalculations';

export const useAssetOperations = () => {
  const { updateLiquidAsset, addLiquidAsset, removeLiquidAsset } = useFinancialData();
  const {
    calculateCryptoValue,
    calculateStockValue,
    calculateMetalValue,
    calculateWalletValue,
    calculateNFTValue
  } = useAssetCalculations();

  const handleSubmit = async (
    assetType: string,
    formData: any,
    editingAsset: any
  ) => {
    if (!formData.name.trim() && assetType !== 'wallet' && assetType !== 'nft') {
      toast({
        title: "Error",
        description: "Please enter an asset name.",
        variant: "destructive"
      });
      return false;
    }

    let finalValue = formData.value;
    let finalName = formData.name;
    
    const baseAssetData = {
      name: finalName,
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
    else if (assetType === 'nft' && formData.nftContractAddress && formData.quantity > 0) {
      const nftResult = await calculateNFTValue(formData.nftContractAddress, formData.quantity);
      finalValue = nftResult.value;
      finalName = formData.nftCollectionName || nftResult.collectionName;
      
      const nftAssetData = {
        ...baseAssetData,
        name: finalName,
        value: finalValue,
        icon: 'Image',
        isNFT: true,
        nftContractAddress: formData.nftContractAddress,
        nftCollectionName: finalName,
        quantity: formData.quantity
      };

      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, nftAssetData);
      } else {
        addLiquidAsset(nftAssetData);
      }
    }
    else {
      if (editingAsset) {
        updateLiquidAsset(editingAsset.id, baseAssetData);
      } else {
        addLiquidAsset(baseAssetData);
      }
    }

    toast({
      title: editingAsset ? "Asset Updated" : "Asset Added",
      description: `${finalName} has been ${editingAsset ? 'updated' : 'added'} successfully.`
    });

    return true;
  };

  const handleDelete = (assetId: string) => {
    removeLiquidAsset(assetId);
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed successfully."
    });
  };

  return {
    handleSubmit,
    handleDelete
  };
};
