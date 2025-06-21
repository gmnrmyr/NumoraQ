
interface StockData {
  symbol: string;
  price: number;
  name: string;
  currency: string;
}

interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: 'stock' | 'reit';
}

// Popular stock symbols for autocomplete
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', type: 'stock' as const },
  
  // Brazilian stocks
  { symbol: 'PETR4.SA', name: 'Petróleo Brasileiro S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'VALE3.SA', name: 'Vale S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'ITUB4.SA', name: 'Itaú Unibanco Holding S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'BBDC4.SA', name: 'Banco Bradesco S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'ABEV3.SA', name: 'Ambev S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'MGLU3.SA', name: 'Magazine Luiza S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'WEGE3.SA', name: 'WEG S.A.', exchange: 'BMF', type: 'stock' as const },
  { symbol: 'RENT3.SA', name: 'Localiza Rent a Car S.A.', exchange: 'BMF', type: 'stock' as const },
];

// Popular REITs and FIIs
const POPULAR_REITS = [
  // US REITs
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'SCHH', name: 'Schwab US REIT ETF', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'IYR', name: 'iShares US Real Estate ETF', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR Fund', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'SPG', name: 'Simon Property Group Inc.', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'PLD', name: 'Prologis Inc.', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'AMT', name: 'American Tower Corporation', exchange: 'NYSE', type: 'reit' as const },
  { symbol: 'CCI', name: 'Crown Castle Inc.', exchange: 'NYSE', type: 'reit' as const },
  
  // Brazilian FIIs (Real Estate Investment Funds)
  { symbol: 'HGLG11.SA', name: 'CSHG Logística FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'BTLG11.SA', name: 'BTG Pactual Logística FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'XPLG11.SA', name: 'XP Log FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'KNCR11.SA', name: 'Kinea Rendimentos Imobiliários FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'MXRF11.SA', name: 'Maxi Renda FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'BCFF11.SA', name: 'Bradesco Fundos FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'VISC11.SA', name: 'Vinci Shopping Centers FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'XPML11.SA', name: 'XP Malls FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'VTEB11.SA', name: 'Votorantim FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'HGRE11.SA', name: 'CSHG Real Estate FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'ALZR11.SA', name: 'Alianza Trust FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'GGRC11.SA', name: 'General Shopping e Outlets FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'KNRI11.SA', name: 'Kinea Renda Imobiliária FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'HSML11.SA', name: 'HSI Malls FII', exchange: 'BMF', type: 'reit' as const },
  { symbol: 'HCTR11.SA', name: 'Hectare CE FII', exchange: 'BMF', type: 'reit' as const },
];

export const searchStocks = (query: string, assetType?: 'stock' | 'reit'): StockSearchResult[] => {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toLowerCase();
  const searchPool = assetType === 'reit' ? POPULAR_REITS : 
                    assetType === 'stock' ? POPULAR_STOCKS : 
                    [...POPULAR_STOCKS, ...POPULAR_REITS];
  
  return searchPool
    .filter(item => 
      item.symbol.toLowerCase().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm)
    )
    .slice(0, 8); // Limit to 8 results
};

export const fetchStockPrice = async (symbol: string): Promise<StockData | null> => {
  try {
    // Using Alpha Vantage API (free tier)
    // In production, you'd want to use a proper API key
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`
    );
    
    if (!response.ok) {
      console.warn(`Failed to fetch stock price for ${symbol}`);
      return getMockStockPrice(symbol);
    }
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    if (!quote || !quote['05. price']) {
      console.warn(`No price data for ${symbol}`);
      return getMockStockPrice(symbol);
    }
    
    return {
      symbol,
      price: parseFloat(quote['05. price']),
      name: getStockName(symbol),
      currency: 'USD'
    };
  } catch (error) {
    console.warn(`Error fetching stock price for ${symbol}:`, error);
    return getMockStockPrice(symbol);
  }
};

const getMockStockPrice = (symbol: string): StockData => {
  // Mock prices for demonstration
  const mockPrices: Record<string, number> = {
    'AAPL': 175.50,
    'NVDA': 465.20,
    'MSFT': 378.90,
    'GOOGL': 142.30,
    'AMZN': 155.80,
    'TSLA': 248.40,
    'META': 325.60,
    'NFLX': 445.20,
    'PETR4.SA': 38.50,
    'VALE3.SA': 65.20,
    'ITUB4.SA': 32.10,
    'BBDC4.SA': 28.90,
    // US REITs
    'VNQ': 89.50,
    'SCHH': 24.80,
    'IYR': 87.30,
    'XLRE': 42.60,
    'SPG': 125.40,
    'PLD': 135.20,
    'AMT': 198.70,
    'CCI': 184.50,
    // Brazilian FIIs
    'HGLG11.SA': 165.80,
    'BTLG11.SA': 98.50,
    'XPLG11.SA': 112.30,
    'KNCR11.SA': 9.85,
    'MXRF11.SA': 10.20,
    'BCFF11.SA': 95.60,
    'VISC11.SA': 89.40,
    'XPML11.SA': 96.70,
    'VTEB11.SA': 88.90,
    'HGRE11.SA': 128.50,
  };
  
  return {
    symbol,
    price: mockPrices[symbol] || Math.random() * 200 + 50,
    name: getStockName(symbol),
    currency: symbol.includes('.SA') ? 'BRL' : 'USD'
  };
};

const getStockName = (symbol: string): string => {
  const allAssets = [...POPULAR_STOCKS, ...POPULAR_REITS];
  const asset = allAssets.find(s => s.symbol === symbol);
  return asset?.name || symbol;
};
