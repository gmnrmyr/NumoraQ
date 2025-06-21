
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
}

// Popular stock symbols for autocomplete
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ' },
  
  // Brazilian stocks
  { symbol: 'PETR4.SA', name: 'Petróleo Brasileiro S.A.', exchange: 'BMF' },
  { symbol: 'VALE3.SA', name: 'Vale S.A.', exchange: 'BMF' },
  { symbol: 'ITUB4.SA', name: 'Itaú Unibanco Holding S.A.', exchange: 'BMF' },
  { symbol: 'BBDC4.SA', name: 'Banco Bradesco S.A.', exchange: 'BMF' },
  { symbol: 'ABEV3.SA', name: 'Ambev S.A.', exchange: 'BMF' },
  { symbol: 'MGLU3.SA', name: 'Magazine Luiza S.A.', exchange: 'BMF' },
  { symbol: 'WEGE3.SA', name: 'WEG S.A.', exchange: 'BMF' },
  { symbol: 'RENT3.SA', name: 'Localiza Rent a Car S.A.', exchange: 'BMF' },
];

export const searchStocks = (query: string): StockSearchResult[] => {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toLowerCase();
  return POPULAR_STOCKS
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.name.toLowerCase().includes(searchTerm)
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
  };
  
  return {
    symbol,
    price: mockPrices[symbol] || Math.random() * 200 + 50,
    name: getStockName(symbol),
    currency: symbol.includes('.SA') ? 'BRL' : 'USD'
  };
};

const getStockName = (symbol: string): string => {
  const stock = POPULAR_STOCKS.find(s => s.symbol === symbol);
  return stock?.name || symbol;
};
