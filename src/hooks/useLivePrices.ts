
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLivePrices = useCallback(async () => {
    if (!data.userProfile || !data.userProfile.name || fetchingRef.current) {
      // Don't fetch for anonymous users or if already fetching
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching live prices...');
      const { data: priceData, error: functionError } = await supabase.functions.invoke('fetch-live-prices');
      
      if (functionError) throw functionError;
      
      if (priceData) {
        // Update each exchange rate individually with proper typing
        updateExchangeRate('brlToUsd', priceData.brlToUsd);
        updateExchangeRate('usdToBrl', priceData.usdToBrl);
        updateExchangeRate('btcPrice', priceData.btcPrice);
        updateExchangeRate('ethPrice', priceData.ethPrice);
        updateExchangeRate('lastUpdated', priceData.lastUpdated);
        
        console.log('Live prices updated successfully:', priceData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live prices');
      console.error('Error fetching live prices:', err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [data.userProfile, updateExchangeRate]);

  // Clear existing interval when user changes or component updates
  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Set up auto-fetch interval for authenticated users
  useEffect(() => {
    clearExistingInterval();

    if (data.userProfile?.name) {
      // Initial fetch
      fetchLivePrices();
      
      // Set up interval for subsequent fetches
      intervalRef.current = setInterval(() => {
        fetchLivePrices();
      }, 5 * 60 * 1000); // Every 5 minutes
    }

    return () => {
      clearExistingInterval();
    };
  }, [data.userProfile?.name, fetchLivePrices, clearExistingInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearExistingInterval();
      fetchingRef.current = false;
    };
  }, [clearExistingInterval]);

  return {
    fetchLivePrices,
    loading,
    error,
    isLiveDataEnabled: data.userProfile?.name !== '' // Enable for logged in users
  };
};
