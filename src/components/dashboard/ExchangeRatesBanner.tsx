
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const ExchangeRatesBanner = () => {
  const { data: prices, isLoading } = useQuery({
    queryKey: ['live-prices'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-live-prices');
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  if (isLoading || !prices) {
    return (
      <div className="bg-muted/20 border-2 border-border p-3 sm:p-4">
        <div className="flex items-center justify-center">
          <div className="font-mono text-xs sm:text-sm text-muted-foreground">
            Loading live prices...
          </div>
        </div>
      </div>
    );
  }

  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: prices.bitcoin?.usd, change: prices.bitcoin?.usd_24h_change },
    { symbol: 'ETH', name: 'Ethereum', price: prices.ethereum?.usd, change: prices.ethereum?.usd_24h_change },
    { symbol: 'SOL', name: 'Solana', price: prices.solana?.usd, change: prices.solana?.usd_24h_change },
  ];

  return (
    <div className="bg-muted/20 border-2 border-border p-3 sm:p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <DollarSign size={16} className="text-accent" />
        <span className="font-mono text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">
          Live Crypto Prices
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {cryptoData.map((crypto) => (
          <div key={crypto.symbol} className="flex items-center justify-between p-2 sm:p-3 bg-card/50 border border-border">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  {crypto.symbol}
                </span>
                <span className="font-mono text-xs text-muted-foreground hidden sm:inline truncate">
                  {crypto.name}
                </span>
              </div>
              <span className="font-mono text-xs sm:text-sm font-semibold text-accent">
                ${crypto.price?.toLocaleString(undefined, { 
                  minimumFractionDigits: crypto.symbol === 'BTC' ? 0 : 2,
                  maximumFractionDigits: crypto.symbol === 'BTC' ? 0 : 2
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {crypto.change && crypto.change > 0 ? (
                <TrendingUp size={12} className="text-green-500" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={`font-mono text-xs font-semibold ${
                crypto.change && crypto.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {crypto.change ? `${crypto.change > 0 ? '+' : ''}${crypto.change.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
