
import { fetchStockPrice, fetchMetalPrice, fetchWalletValue } from '@/services/stockService';
import { WalletService } from '@/services/walletService';
import { useFinancialData } from "@/contexts/FinancialDataContext";

const CRYPTO_OPTIONS = [
  { symbol: 'BTC', name: 'Bitcoin', key: 'btcPrice' },
  { symbol: 'ETH', name: 'Ethereum', key: 'ethPrice' }
];

export const useAssetCalculations = () => {
  const { data } = useFinancialData();

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

  const calculateNFTValue = async (contractAddress: string, quantity: number) => {
    try {
      const nftData = await WalletService.fetchNFTCollectionValue(contractAddress, quantity);
      return {
        value: nftData.totalValue,
        collectionName: nftData.collectionName
      };
    } catch (error) {
      console.error('Error calculating NFT value:', error);
      return {
        value: 0,
        collectionName: 'Unknown Collection'
      };
    }
  };

  return {
    calculateCryptoValue,
    calculateStockValue,
    calculateMetalValue,
    calculateWalletValue,
    calculateNFTValue
  };
};
