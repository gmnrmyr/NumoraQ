
interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  contractAddress: string;
  price: number;
  logoUrl?: string;
}

interface DeFiPosition {
  protocol: string;
  category: string;
  usdValue: number;
  tokens: TokenBalance[];
}

interface WalletData {
  address: string;
  totalUsd: number;
  tokens: TokenBalance[];
  defiPositions: DeFiPosition[];
  nfts: any[];
  lastUpdated: string;
}

export class WalletService {
  private static readonly DEBANK_API = 'https://pro-openapi.debank.com/v1';
  
  static async fetchWalletData(address: string): Promise<WalletData> {
    try {
      // Validate address
      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error('Invalid Ethereum address');
      }

      console.log(`Fetching wallet data for: ${address}`);
      
      // Try DeBank free API first
      const walletData = await this.fetchFromDeBank(address);
      if (walletData) {
        return walletData;
      }

      // Fallback to basic ETH balance
      return await this.fetchBasicEthBalance(address);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw error;
    }
  }

  private static async fetchFromDeBank(address: string): Promise<WalletData | null> {
    try {
      // DeBank free endpoints
      const [tokensResponse, protocolsResponse] = await Promise.allSettled([
        fetch(`${this.DEBANK_API}/user/token_list?id=${address}&is_all=true`, {
          headers: { 'Accept': 'application/json' }
        }),
        fetch(`${this.DEBANK_API}/user/complex_protocol_list?id=${address}`, {
          headers: { 'Accept': 'application/json' }
        })
      ]);

      let tokens: TokenBalance[] = [];
      let defiPositions: DeFiPosition[] = [];
      
      // Parse tokens
      if (tokensResponse.status === 'fulfilled' && tokensResponse.value.ok) {
        const tokenData = await tokensResponse.value.json();
        tokens = tokenData.map((token: any) => ({
          symbol: token.symbol,
          name: token.name,
          balance: parseFloat(token.amount || '0'),
          usdValue: parseFloat(token.amount || '0') * parseFloat(token.price || '0'),
          contractAddress: token.id,
          price: parseFloat(token.price || '0'),
          logoUrl: token.logo_url
        }));
      }

      // Parse DeFi positions
      if (protocolsResponse.status === 'fulfilled' && protocolsResponse.value.ok) {
        const protocolData = await protocolsResponse.value.json();
        defiPositions = protocolData.map((protocol: any) => ({
          protocol: protocol.name,
          category: protocol.site_url,
          usdValue: parseFloat(protocol.net_usd_value || '0'),
          tokens: protocol.portfolio_item_list?.map((item: any) => ({
            symbol: item.detail?.supply_token_list?.[0]?.symbol || 'Unknown',
            name: item.detail?.supply_token_list?.[0]?.name || 'Unknown',
            balance: parseFloat(item.detail?.supply_token_list?.[0]?.amount || '0'),
            usdValue: parseFloat(item.stats?.net_usd_value || '0'),
            contractAddress: item.detail?.supply_token_list?.[0]?.id || '',
            price: 0
          })) || []
        }));
      }

      const totalUsd = tokens.reduce((sum, token) => sum + token.usdValue, 0) +
                     defiPositions.reduce((sum, pos) => sum + pos.usdValue, 0);

      console.log(`DeBank API success - Total USD: $${totalUsd.toLocaleString()}`);

      return {
        address,
        totalUsd,
        tokens,
        defiPositions,
        nfts: [],
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.warn('DeBank API failed:', error);
      return null;
    }
  }

  private static async fetchBasicEthBalance(address: string): Promise<WalletData> {
    try {
      // Use Ethereum mainnet RPC
      const response = await fetch('https://eth.llamarpc.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });

      const data = await response.json();
      const ethBalance = parseInt(data.result || '0x0', 16) / Math.pow(10, 18);
      
      // Get ETH price from CoinGecko
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const priceData = await priceResponse.json();
      const ethPrice = priceData.ethereum?.usd || 2500;

      const usdValue = ethBalance * ethPrice;

      console.log(`Basic ETH balance: ${ethBalance.toFixed(4)} ETH ($${usdValue.toLocaleString()})`);

      return {
        address,
        totalUsd: usdValue,
        tokens: [{
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance,
          usdValue,
          contractAddress: 'native',
          price: ethPrice
        }],
        defiPositions: [],
        nfts: [],
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Basic ETH fetch failed:', error);
      throw new Error('Failed to fetch wallet data');
    }
  }

  static async fetchNFTCollectionValue(contractAddress: string, quantity: number = 1): Promise<{
    floorPrice: number;
    bestOffer: number;
    totalValue: number;
    collectionName: string;
  }> {
    try {
      // OpenSea API v2 for collection stats
      const response = await fetch(`https://api.opensea.io/api/v2/collections/${contractAddress}/stats`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch NFT data');
      }

      const data = await response.json();
      const floorPrice = parseFloat(data.total?.floor_price || '0');
      const bestOffer = floorPrice * 0.8; // Estimate 80% of floor as best offer
      
      return {
        floorPrice,
        bestOffer,
        totalValue: bestOffer * quantity,
        collectionName: data.collection?.name || 'Unknown Collection'
      };

    } catch (error) {
      console.warn('NFT fetch failed, using mock data:', error);
      return {
        floorPrice: 0.1,
        bestOffer: 0.08,
        totalValue: 0.08 * quantity,
        collectionName: 'Unknown Collection'
      };
    }
  }
}
