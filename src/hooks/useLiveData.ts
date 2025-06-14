
import { useState, useEffect } from 'react';
import { liveDataService, LiveRates } from '@/services/liveDataService';

export const useLiveData = () => {
  const [rates, setRates] = useState<LiveRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRatesUpdate = (newRates: LiveRates) => {
      setRates(newRates);
      setIsLoading(false);
    };

    // Subscribe to live data updates
    liveDataService.subscribe(handleRatesUpdate);

    return () => {
      liveDataService.unsubscribe(handleRatesUpdate);
    };
  }, []);

  return { rates, isLoading };
};
