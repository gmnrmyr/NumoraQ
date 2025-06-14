
export interface LiveRates {
  usdToBrl: number;
  brlToUsd: number;
  btcPrice: number;
  ethPrice: number;
  lastUpdated: Date;
}

class LiveDataService {
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: ((rates: LiveRates) => void)[] = [];

  async fetchRates(): Promise<LiveRates> {
    try {
      // Fetch USD/BRL from a free API
      const forexResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const forexData = await forexResponse.json();
      const usdToBrl = forexData.rates.BRL || 5.2;
      
      // Fetch crypto prices from CoinGecko (free API)
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=brl'
      );
      const cryptoData = await cryptoResponse.json();
      
      const btcPrice = cryptoData.bitcoin?.brl || 300000;
      const ethPrice = cryptoData.ethereum?.brl || 15000;

      return {
        usdToBrl,
        brlToUsd: 1 / usdToBrl,
        btcPrice,
        ethPrice,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.warn('Failed to fetch live rates, using fallback values:', error);
      return {
        usdToBrl: 5.2,
        brlToUsd: 0.19,
        btcPrice: 300000,
        ethPrice: 15000,
        lastUpdated: new Date()
      };
    }
  }

  subscribe(callback: (rates: LiveRates) => void) {
    this.listeners.push(callback);
    
    // Start fetching if this is the first subscriber
    if (this.listeners.length === 1) {
      this.startFetching();
    }
  }

  unsubscribe(callback: (rates: LiveRates) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
    
    // Stop fetching if no more subscribers
    if (this.listeners.length === 0) {
      this.stopFetching();
    }
  }

  private async startFetching() {
    // Fetch immediately
    const rates = await this.fetchRates();
    this.listeners.forEach(listener => listener(rates));

    // Then fetch every 5 minutes
    this.updateInterval = setInterval(async () => {
      const rates = await this.fetchRates();
      this.listeners.forEach(listener => listener(rates));
    }, 5 * 60 * 1000); // 5 minutes
  }

  private stopFetching() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const liveDataService = new LiveDataService();
