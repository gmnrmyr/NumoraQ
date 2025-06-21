export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface StockInfo {
  symbol: string;
  name: string;
  type: 'stock' | 'reit' | 'metal';
  exchange: string;
}

const STOCK_DATA: StockInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', type: 'stock', exchange: 'NASDAQ' },
  { symbol: 'CRM', name: 'Salesforce, Inc.', type: 'stock', exchange: 'NYSE' },
  { symbol: 'UBER', name: 'Uber Technologies, Inc.', type: 'stock', exchange: 'NYSE' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'reit', exchange: 'NYSE' },
  { symbol: 'SCHH', name: 'Schwab US REIT ETF', type: 'reit', exchange: 'NYSE' },
  { symbol: 'IYR', name: 'iShares US Real Estate ETF', type: 'reit', exchange: 'NYSE' },
  { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR Fund', type: 'reit', exchange: 'NYSE' },
  { symbol: 'HGLG11.SA', name: 'CSHG Logística - FII', type: 'reit', exchange: 'BM&FBOVESPA' },
  { symbol: 'XPML11.SA', name: 'XP Malls FII', type: 'reit', exchange: 'BM&FBOVESPA' },
  { symbol: 'BCFF11.SA', name: 'BTG Pactual Fundo de Fundos', type: 'reit', exchange: 'BM&FBOVESPA' },
  { symbol: 'KNRI11.SA', name: 'Kinea Renda Imobiliária', type: 'reit', exchange: 'BM&FBOVESPA' },
  { symbol: 'MXRF11.SA', name: 'Maxi Renda FII', type: 'reit', exchange: 'BM&FBOVESPA' }
];

// Add precious metals data
const PRECIOUS_METALS = [
  { symbol: 'XAU', name: 'Gold', type: 'metal', exchange: 'COMEX' },
  { symbol: 'XAG', name: 'Silver', type: 'metal', exchange: 'COMEX' },
  { symbol: 'XPT', name: 'Platinum', type: 'metal', exchange: 'NYMEX' },
  { symbol: 'XPD', name: 'Palladium', type: 'metal', exchange: 'NYMEX' }
];

const STOCKS = [...STOCK_DATA, ...PRECIOUS_METALS];

export const searchStocks = (query: string, assetType: 'stock' | 'reit' | 'metal' = 'stock'): StockInfo[] => {
  const searchTerm = query.toUpperCase();
  return STOCKS.filter(stock =>
    (assetType === 'stock' ? stock.type === 'stock' : stock.type === assetType) &&
    (stock.symbol.includes(searchTerm) || stock.name.toUpperCase().includes(searchTerm))
  );
};

export const fetchStockPrice = async (symbol: string): Promise<StockData | null> => {
  try {
    // Check if it's a precious metal
    const metal = PRECIOUS_METALS.find(m => m.symbol === symbol);
    if (metal) {
      return fetchMetalPrice(symbol);
    }

    // Mock stock price for demonstration
    const mockPrices: { [key: string]: number } = {
      'AAPL': 175.50,
      'NVDA': 450.25,
      'MSFT': 380.75,
      'GOOGL': 140.25,
      'AMZN': 145.80,
      'TSLA': 250.30,
      'META': 320.15,
      'NFLX': 445.90,
      'CRM': 210.40,
      'UBER': 62.35,
      'VNQ': 85.20,
      'SCHH': 24.15,
      'IYR': 78.90,
      'XLRE': 38.45,
      'HGLG11.SA': 165.50,
      'XPML11.SA': 95.80,
      'BCFF11.SA': 85.40,
      'KNRI11.SA': 140.25,
      'MXRF11.SA': 10.25
    };

    const price = mockPrices[symbol] || Math.random() * 200 + 50;
    
    return {
      symbol,
      price,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return null;
  }
};

export const fetchMetalPrice = async (symbol: string): Promise<StockData | null> => {
  try {
    // Mock precious metal prices (per oz in USD)
    const mockMetalPrices: { [key: string]: number } = {
      'XAU': 1950.25, // Gold
      'XAG': 24.85,   // Silver
      'XPT': 975.40,  // Platinum
      'XPD': 1285.60  // Palladium
    };

    const price = mockMetalPrices[symbol] || 1000;
    
    return {
      symbol,
      price,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 2,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching metal price:', error);
    return null;
  }
};

export const fetchWalletValue = async (walletAddress: string): Promise<number> => {
  try {
    // Mock wallet value for demonstration
    // In production, this would call DeBank API, CoinMarketCap, or similar
    const mockValue = Math.random() * 50000 + 1000;
    
    console.log(`Fetching wallet value for ${walletAddress}: $${mockValue.toFixed(2)}`);
    
    return mockValue;
  } catch (error) {
    console.error('Error fetching wallet value:', error);
    return 0;
  }
};
