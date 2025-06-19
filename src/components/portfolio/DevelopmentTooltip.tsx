
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Construction } from 'lucide-react';

export const DevelopmentTooltip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    const dismissed = localStorage.getItem('devTooltipDismissed');
    return dismissed !== 'true';
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('devTooltipDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <Card className="bg-blue-50 border-2 border-blue-200 dark:bg-blue-950 dark:border-blue-800 mb-4">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <Construction size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-mono font-bold text-blue-800 dark:text-blue-200 mb-1">
                🚧 Coming Soon
              </div>
              <div className="text-blue-700 dark:text-blue-300 font-mono text-xs leading-relaxed">
                Auto-fetch wallet values (BTC, EVM, Solana) and NFT floor prices via OpenSea. 
                BTC/ETH asset valuation also in development. Continue adding assets manually for now!
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <X size={12} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
