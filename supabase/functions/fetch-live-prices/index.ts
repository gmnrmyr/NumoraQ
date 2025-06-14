
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PriceData {
  brlToUsd: number;
  usdToBrl: number;
  btcPrice: number;
  ethPrice: number;
  lastUpdated: string;
}

async function fetchExchangeRates(currency: string = 'BRL'): Promise<PriceData> {
  try {
    console.log(`Fetching prices for currency: ${currency}`);
    
    // Fetch USD/BRL exchange rate from Exchange Rates API
    const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeData = await exchangeResponse.json();
    const usdToBrl = exchangeData.rates.BRL || 5.54;
    const brlToUsd = 1 / usdToBrl;

    // Fetch crypto prices from CoinGecko API
    const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const cryptoData = await cryptoResponse.json();
    
    const btcPriceUSD = cryptoData.bitcoin?.usd || 100000;
    const ethPriceUSD = cryptoData.ethereum?.usd || 2500;
    
    // Convert crypto prices based on user's currency preference
    let btcPrice, ethPrice;
    if (currency === 'USD') {
      btcPrice = Math.round(btcPriceUSD);
      ethPrice = Math.round(ethPriceUSD);
    } else if (currency === 'BRL') {
      btcPrice = Math.round(btcPriceUSD * usdToBrl);
      ethPrice = Math.round(ethPriceUSD * usdToBrl);
    } else if (currency === 'EUR') {
      const eurRate = exchangeData.rates.EUR || 0.85;
      btcPrice = Math.round(btcPriceUSD * eurRate);
      ethPrice = Math.round(ethPriceUSD * eurRate);
    } else {
      // Default to USD
      btcPrice = Math.round(btcPriceUSD);
      ethPrice = Math.round(ethPriceUSD);
    }

    console.log(`Converted prices for ${currency}: BTC=${btcPrice}, ETH=${ethPrice}`);

    return {
      brlToUsd: Math.round(brlToUsd * 10000) / 10000,
      usdToBrl: Math.round(usdToBrl * 100) / 100,
      btcPrice,
      ethPrice,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    // Return fallback values based on currency
    const fallbackPrices = {
      BRL: { btc: 588300, eth: 14000 },
      USD: { btc: 100000, eth: 2500 },
      EUR: { btc: 85000, eth: 2125 }
    };
    
    const prices = fallbackPrices[currency as keyof typeof fallbackPrices] || fallbackPrices.USD;
    
    return {
      brlToUsd: 0.18,
      usdToBrl: 5.54,
      btcPrice: prices.btc,
      ethPrice: prices.eth,
      lastUpdated: new Date().toISOString()
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const currency = url.searchParams.get('currency') || 'BRL';
    
    console.log(`Processing request for currency: ${currency}`);
    
    const priceData = await fetchExchangeRates(currency);
    
    return new Response(
      JSON.stringify(priceData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
