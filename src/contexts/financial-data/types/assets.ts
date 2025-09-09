export interface LiquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
  trackingMode?: 'manual' | 'wallet' | 'price';
  isCrypto?: boolean;
  cryptoSymbol?: string;
  quantity?: number;
  isStock?: boolean;
  isReit?: boolean;
  stockSymbol?: string;
  stockName?: string;
  isPreciousMetal?: boolean;
  metalSymbol?: string;
  isWalletTracked?: boolean;
  walletAddress?: string;
  autoCompound?: boolean;
  monthlyYield?: number;
  // Generic compounding for liquid assets (APY-based, monthly compounding)
  compoundEnabled?: boolean;
  compoundAnnualRate?: number; // APY percent per year
  isNFT?: boolean;
  nftContractAddress?: string;
  nftCollectionName?: string;
}

export interface IlliquidAsset {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
  isActive: boolean;
  // Scheduling properties
  isScheduled?: boolean;
  scheduledDate?: string; // YYYY-MM-DD format
  scheduledValue?: number; // Value to be assigned when triggered
  linkedExpenseId?: string; // ID of the expense that triggers this asset
  isTriggered?: boolean; // Whether the asset has been triggered
  triggeredDate?: string; // When the asset was triggered
}

export interface Property {
  id: string;
  name: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  status: 'rented' | 'renovating' | 'planned';
  currentRent: number;
  expectedRent?: number;
  statusIcon: string;
  statusText: string;
  prediction: string;
  rentRange: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  status: 'yielding' | 'growth' | 'dividend';
  yield?: number;
  statusIcon: string;
  statusText: string;
}

// Aliases for backward compatibility
export type PropertyItem = Property;
