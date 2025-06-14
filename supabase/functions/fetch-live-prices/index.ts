
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

async function fetchExchangeRates(): Promise<PriceData> {
  try {
    // Fetch USD/BRL exchange rate from Exchange Rates API
    const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeData = await exchangeResponse.json();
    const usdToBrl = exchangeData.rates.BRL || 5.54;
    const brlToUsd = 1 / usdToBrl;

    // Fetch crypto prices from CoinGecko API
    const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,brl');
    const cryptoData = await cryptoResponse.json();
    
    const btcPriceUSD = cryptoData.bitcoin?.usd || 100000;
    const ethPriceUSD = cryptoData.ethereum?.usd || 2500;
    
    // Convert to BRL if needed (assuming user wants BRL prices)
    const btcPrice = btcPriceUSD * usdToBrl;
    const ethPrice = ethPriceUSD * usdToBrl;

    return {
      brlToUsd: Math.round(brlToUsd * 10000) / 10000,
      usdToBrl: Math.round(usdToBrl * 100) / 100,
      btcPrice: Math.round(btcPrice),
      ethPrice: Math.round(ethPrice),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    // Return fallback values
    return {
      brlToUsd: 0.18,
      usdToBrl: 5.54,
      btcPrice: 588300,
      ethPrice: 14000,
      lastUpdated: new Date().toISOString()
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const priceData = await fetchExchangeRates();
    
    return new Response(
      JSON.stringify(priceData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
