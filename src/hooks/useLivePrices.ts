
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
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const { data, updateExchangeRate } = useFinancialData();
  const fetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLivePrices = useCallback(async () => {
    if (!data.userProfile || !data.userProfile.name || fetchingRef.current) {
      console.log('Skipping fetch: no user profile or already fetching');
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching live prices for currency:', data.userProfile.defaultCurrency);
      
      const { data: priceData, error: functionError } = await supabase.functions.invoke('fetch-live-prices', {
        body: { currency: data.userProfile.defaultCurrency }
      });
      
      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      if (priceData) {
        // Update exchange rates
        updateExchangeRate('brlToUsd', priceData.brlToUsd);
        updateExchangeRate('usdToBrl', priceData.usdToBrl);
        updateExchangeRate('btcPrice', priceData.btcPrice);
        updateExchangeRate('ethPrice', priceData.ethPrice);
        updateExchangeRate('lastUpdated', priceData.lastUpdated);
        
        setLastFetchTime(new Date());
        console.log('Live prices updated successfully:', priceData);
      }
    } catch (err: any) {
      console.error('Error fetching live prices:', err);
      setError(err.message || 'Failed to fetch live prices');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [data.userProfile?.name, data.userProfile?.defaultCurrency, updateExchangeRate]);

  // Clear existing interval when user changes or component updates
  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Cleared existing price fetch interval');
    }
  }, []);

  // Set up auto-fetch interval for authenticated users
  useEffect(() => {
    clearExistingInterval();

    if (data.userProfile?.name) {
      console.log('Setting up price fetch interval for authenticated user');
      
      // Initial fetch
      fetchLivePrices();
      
      // Set up interval for subsequent fetches every 5 minutes
      intervalRef.current = setInterval(() => {
        console.log('Interval fetch triggered');
        fetchLivePrices();
      }, 5 * 60 * 1000);
    } else {
      console.log('No authenticated user, skipping price fetch setup');
    }

    return () => {
      clearExistingInterval();
    };
  }, [data.userProfile?.name, data.userProfile?.defaultCurrency, fetchLivePrices, clearExistingInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearExistingInterval();
      fetchingRef.current = false;
    };
  }, [clearExistingInterval]);

  // Calculate time since last update
  const getTimeSinceLastUpdate = useCallback(() => {
    if (!data.exchangeRates.lastUpdated) return null;
    
    const lastUpdate = new Date(data.exchangeRates.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1 minute ago';
    return `${diffMinutes} minutes ago`;
  }, [data.exchangeRates.lastUpdated]);

  return {
    fetchLivePrices,
    loading,
    error,
    lastFetchTime,
    timeSinceLastUpdate: getTimeSinceLastUpdate(),
    isLiveDataEnabled: !!data.userProfile?.name // Enable for logged in users
  };
};
