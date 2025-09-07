
import React from 'react';
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { fetchStockPrice, fetchMetalPrice, fetchWalletValue } from '@/services/stockService';

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' },
  { symbol: 'SOL', name: 'Solana', key: 'solPrice' }
];

export const useLivePriceUpdates = () => {
  const { data, updateLiquidAsset } = useFinancialData();

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

  // Update crypto price recalculation effects
  React.useEffect(() => {
    data.liquidAssets.forEach(asset => {
      if (asset.isCrypto && asset.cryptoSymbol && asset.quantity) {
        const newValue = calculateCryptoValue(asset.cryptoSymbol, asset.quantity);
        if (Math.abs(newValue - asset.value) > 0.01) {
          updateLiquidAsset(asset.id, { value: newValue });
        }
      }
    });
  }, [data.exchangeRates.btcPrice, data.exchangeRates.ethPrice, data.exchangeRates.solPrice]);

  // Periodically update all live-priced assets
  React.useEffect(() => {
    const updateLivePrices = async () => {
      const assetsToUpdate = data.liquidAssets.filter(asset => 
        asset.isStock || asset.isPreciousMetal || asset.isWalletTracked
      );
      
      for (const asset of assetsToUpdate) {
        try {
          let newValue = 0;
          
          if (asset.isStock && asset.stockSymbol && asset.quantity) {
            newValue = await calculateStockValue(asset.stockSymbol, asset.quantity);
          } else if (asset.isPreciousMetal && asset.metalSymbol && asset.quantity) {
            newValue = await calculateMetalValue(asset.metalSymbol, asset.quantity);
          } else if (asset.isWalletTracked && asset.walletAddress) {
            newValue = await calculateWalletValue(asset.walletAddress);
          }
          
          if (newValue > 0 && Math.abs(newValue - asset.value) > 0.01) {
            updateLiquidAsset(asset.id, { value: newValue });
          }
        } catch (error) {
          console.error(`Error updating asset price for ${asset.name}:`, error);
        }
      }
    };

    // Update live prices every 5 minutes
    const interval = setInterval(updateLivePrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [data.liquidAssets]);
};
