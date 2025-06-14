
import { useState, useEffect } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { supabase } from '@/integrations/supabase/client';

interface LivePriceData {
  brlToUsd: number;
  usdToBrl: number;
  btcPrice: number;
  ethPrice: number;
  lastUpdated: string;
}

export const useLivePrices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, updateExchangeRate } = useFinancialData();

  const fetchLivePrices = async () => {
    if (!data.userProfile || !data.userProfile.name) {
      // Don't fetch for anonymous users
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: priceData, error: functionError } = await supabase.functions.invoke('fetch-live-prices');
      
      if (functionError) throw functionError;
      
      if (priceData) {
        // Update exchange rates in the context
        updateExchangeRate('brlToUsd', priceData.brlToUsd);
        updateExchangeRate('usdToBrl', priceData.usdToBrl);
        updateExchangeRate('btcPrice', priceData.btcPrice);
        updateExchangeRate('ethPrice', priceData.ethPrice);
        updateExchangeRate('lastUpdated', priceData.lastUpdated);
        
        console.log('Live prices updated:', priceData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live prices');
      console.error('Error fetching live prices:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLivePrices,
    loading,
    error,
    isLiveDataEnabled: data.userProfile?.name !== '' // Enable for logged in users
  };
};
