
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DollarSign, Check } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const CurrencySelector = () => {
  const { data, updateUserProfile } = useFinancialData();
  
  const currencies = [
    { code: 'USD' as const, name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'BRL' as const, name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' }
  ];

  const currentCurrency = currencies.find(curr => curr.code === data.userProfile.defaultCurrency);

  const handleCurrencyChange = (currencyCode: 'USD' | 'BRL') => {
    updateUserProfile({ defaultCurrency: currencyCode });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button text-slate-50 bg-emerald-900 hover:bg-emerald-800 w-full justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={16} />
            <span className="font-mono">Currency</span>
          </div>
          {currentCurrency && (
            <span className="text-sm font-mono">
              {currentCurrency.flag} {currentCurrency.code}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-2 border-border z-50">
        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2 font-mono uppercase">
          <DollarSign size={12} />
          Default Currency
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground font-mono"
          >
            <div className="flex items-center gap-2">
              <span>{currency.flag}</span>
              <span>{currency.name}</span>
              <span className="text-muted-foreground">({currency.symbol})</span>
            </div>
            {data.userProfile.defaultCurrency === currency.code && (
              <Check size={16} className="text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
