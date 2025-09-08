
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
  private static readonly OPENSEA_BASE_URL = 'https://api.opensea.io';
  private static readonly SUPABASE_OPENSEA_PROXY_FUNCTION = 'opensea-proxy';
  
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
      const apiKey = (import.meta as any).env?.VITE_OPENSEA_API_KEY;
      if (!apiKey) {
        console.warn('VITE_OPENSEA_API_KEY is not set. OpenSea requests may be rate-limited or fail.');
      }

      // 1) Resolve collection slug and name by contract address
      const { slug, name } = await this.resolveOpenSeaCollectionByContract(contractAddress, apiKey);

      if (!slug) {
        throw new Error('Unable to resolve collection slug from OpenSea');
      }

      // 2) Fetch stats by collection slug (v2 first, then v1 fallback)
      const stats = await this.fetchOpenSeaCollectionStatsBySlug(slug, apiKey);

      const floorPrice = stats.floorPrice;
      const bestOffer = floorPrice * 0.8; // Estimate 80% of floor as best offer
      const collectionName = name || stats.collectionName || slug || 'Unknown Collection';
      
      return {
        floorPrice,
        bestOffer,
        totalValue: bestOffer * quantity,
        collectionName
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

  private static async resolveOpenSeaCollectionByContract(contractAddress: string, apiKey?: string): Promise<{ slug?: string; name?: string; }>
  {
    // If running in browser, use Supabase Edge proxy to avoid CORS
    if (typeof window !== 'undefined') {
      const { supabase } = await import('@/integrations/supabase/client');
      // v2 contract resolve
      try {
        const v2Url = `${this.OPENSEA_BASE_URL}/api/v2/chain/ethereum/contract/${contractAddress}`;
        console.log('Proxying OpenSea v2 contract resolve:', v2Url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url: v2Url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const slug = json?.collection?.slug || json?.slug;
          const name = json?.collection?.name || json?.name;
          if (slug) return { slug, name };
        }
      } catch (e) {
        console.warn('Proxy v2 contract resolve failed:', e);
      }

      // v1 asset_contract
      try {
        const v1Url = `${this.OPENSEA_BASE_URL}/api/v1/asset_contract/${contractAddress}`;
        console.log('Proxying OpenSea v1 asset_contract resolve:', v1Url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url: v1Url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const slug = json?.collection?.slug;
          const name = json?.collection?.name || json?.name;
          if (slug) return { slug, name };
        }
      } catch (e) {
        console.warn('Proxy v1 asset_contract resolve failed:', e);
      }

      // v2 collections search
      try {
        const url = `${this.OPENSEA_BASE_URL}/api/v2/collections?chain=ethereum&contract_address=${contractAddress}`;
        console.log('Proxying OpenSea v2 collections search:', url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const first = Array.isArray(json?.collections) ? json.collections[0] : undefined;
          const slug = first?.slug;
          const name = first?.name;
          if (slug) return { slug, name };
        }
      } catch (e) {
        console.warn('Proxy v2 collections search failed:', e);
      }

      // v1 assets
      try {
        const url = `${this.OPENSEA_BASE_URL}/api/v1/assets?asset_contract_address=${contractAddress}&order_direction=desc&limit=1&include_orders=false`;
        console.log('Proxying OpenSea v1 assets resolve:', url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const first = Array.isArray(json?.assets) ? json.assets[0] : undefined;
          const slug = first?.collection?.slug;
          const name = first?.collection?.name;
          if (slug) return { slug, name };
        }
      } catch (e) {
        console.warn('Proxy v1 assets resolve failed:', e);
      }

      return {};
    }

    // Node/server environment: direct fetch with API key
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (apiKey) headers['X-API-KEY'] = apiKey;

    // Try v2 chain/ethereum/contract/{address}
    try {
      const v2Url = `${this.OPENSEA_BASE_URL}/api/v2/chain/ethereum/contract/${contractAddress}`;
      console.log('OpenSea resolve v2 contract URL:', v2Url);
      const res = await fetch(v2Url, { headers });
      if (res.ok) {
        const json = await res.json();
        const slug = json?.collection?.slug || json?.slug;
        const name = json?.collection?.name || json?.name;
        if (slug) return { slug, name };
      } else {
        console.warn('OpenSea v2 contract resolve response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v2 contract resolve failed:', e);
    }

    // Fallback v1 asset_contract
    try {
      const v1Url = `${this.OPENSEA_BASE_URL}/api/v1/asset_contract/${contractAddress}`;
      console.log('OpenSea resolve v1 asset_contract URL:', v1Url);
      const res = await fetch(v1Url, { headers });
      if (res.ok) {
        const json = await res.json();
        const slug = json?.collection?.slug;
        const name = json?.collection?.name || json?.name;
        if (slug) return { slug, name };
      } else {
        console.warn('OpenSea v1 asset_contract resolve response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v1 contract resolve failed:', e);
    }

    // Last resort: search collections v2 with query param (if available)
    try {
      const url = `${this.OPENSEA_BASE_URL}/api/v2/collections?chain=ethereum&contract_address=${contractAddress}`;
      console.log('OpenSea resolve v2 collections search URL:', url);
      const res = await fetch(url, { headers });
      if (res.ok) {
        const json = await res.json();
        const first = Array.isArray(json?.collections) ? json.collections[0] : undefined;
        const slug = first?.slug;
        const name = first?.name;
        if (slug) return { slug, name };
      } else {
        console.warn('OpenSea v2 collections search response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v2 collections search failed:', e);
    }

    // Additional fallback: v1 assets (returns array with collection info)
    try {
      const url = `${this.OPENSEA_BASE_URL}/api/v1/assets?asset_contract_address=${contractAddress}&order_direction=desc&limit=1&include_orders=false`;
      console.log('OpenSea resolve v1 assets URL:', url);
      const res = await fetch(url, { headers });
      if (res.ok) {
        const json = await res.json();
        const first = Array.isArray(json?.assets) ? json.assets[0] : undefined;
        const slug = first?.collection?.slug;
        const name = first?.collection?.name;
        if (slug) return { slug, name };
      } else {
        console.warn('OpenSea v1 assets response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v1 assets resolve failed:', e);
    }

    return {};
  }

  private static async fetchOpenSeaCollectionStatsBySlug(slug: string, apiKey?: string): Promise<{ floorPrice: number; collectionName?: string; }>
  {
    // If running in browser, use Supabase Edge proxy to avoid CORS
    if (typeof window !== 'undefined') {
      const { supabase } = await import('@/integrations/supabase/client');
      // v2 stats
      try {
        const v2Url = `${this.OPENSEA_BASE_URL}/api/v2/collections/${slug}/stats`;
        console.log('Proxying OpenSea v2 stats:', v2Url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url: v2Url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const floorPrice = parseFloat((json?.total?.floor_price ?? json?.floor_price ?? '0').toString());
          const collectionName = json?.collection?.name || json?.name;
          return { floorPrice: isNaN(floorPrice) ? 0 : floorPrice, collectionName };
        }
      } catch (e) {
        console.warn('Proxy v2 stats failed:', e);
      }

      // v1 stats
      try {
        const v1Url = `${this.OPENSEA_BASE_URL}/api/v1/collection/${slug}/stats`;
        console.log('Proxying OpenSea v1 stats:', v1Url);
        const { data, error } = await (supabase as any).functions.invoke(this.SUPABASE_OPENSEA_PROXY_FUNCTION, { body: { url: v1Url } });
        if (!error && data) {
          const json = typeof data === 'string' ? JSON.parse(data) : data;
          const floorPrice = parseFloat((json?.stats?.floor_price ?? '0').toString());
          return { floorPrice: isNaN(floorPrice) ? 0 : floorPrice };
        }
      } catch (e) {
        console.warn('Proxy v1 stats failed:', e);
      }

      return { floorPrice: 0 };
    }

    // Node/server: direct fetch with API key
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (apiKey) headers['X-API-KEY'] = apiKey;

    // Try v2 stats
    try {
      const v2Url = `${this.OPENSEA_BASE_URL}/api/v2/collections/${slug}/stats`;
      console.log('OpenSea stats v2 URL:', v2Url);
      const res = await fetch(v2Url, { headers });
      if (res.ok) {
        const json = await res.json();
        // v2 often returns { total: { floor_price: number }, collection: { name } }
        const floorPrice = parseFloat((json?.total?.floor_price ?? json?.floor_price ?? '0').toString());
        const collectionName = json?.collection?.name || json?.name;
        return { floorPrice: isNaN(floorPrice) ? 0 : floorPrice, collectionName };
      } else {
        console.warn('OpenSea v2 stats response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v2 stats failed:', e);
    }

    // Fallback v1 stats
    try {
      const v1Url = `${this.OPENSEA_BASE_URL}/api/v1/collection/${slug}/stats`;
      console.log('OpenSea stats v1 URL:', v1Url);
      const res = await fetch(v1Url, { headers });
      if (res.ok) {
        const json = await res.json();
        // v1 returns { stats: { floor_price: number } }
        const floorPrice = parseFloat((json?.stats?.floor_price ?? '0').toString());
        return { floorPrice: isNaN(floorPrice) ? 0 : floorPrice };
      } else {
        console.warn('OpenSea v1 stats response not ok:', res.status, res.statusText);
      }
    } catch (e) {
      console.warn('OpenSea v1 stats failed:', e);
    }

    return { floorPrice: 0 };
  }
}
