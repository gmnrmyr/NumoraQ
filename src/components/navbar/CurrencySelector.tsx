
import React from 'react';
import { DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DollarSign } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLivePrices } from '@/hooks/useLivePrices';

interface CurrencySelectorProps {
  onClose?: () => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { data, updateUserProfile } = useFinancialData();
  const { user } = useAuth();
  const { fetchLivePrices, isLiveDataEnabled } = useLivePrices();

  const handleCurrencyChange = async (newCurrency: 'BRL' | 'USD' | 'EUR') => {
    console.log('Currency changed to:', newCurrency);
    updateUserProfile({
      defaultCurrency: newCurrency
    });
    if (user && isLiveDataEnabled) {
      console.log('Fetching prices for new currency:', newCurrency);
      await fetchLivePrices(newCurrency);
    }
    onClose?.();
  };

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'BRL':
        return { symbol: 'R$', flag: '🇧🇷' };
      case 'USD':
        return { symbol: '$', flag: '🇺🇸' };
      case 'EUR':
        return { symbol: '€', flag: '🇪🇺' };
      default:
        return { symbol: currency, flag: '' };
    }
  };

  const currencyDisplay = getCurrencyDisplay(data.userProfile.defaultCurrency);

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2 font-mono uppercase">
        <DollarSign size={12} />
        {t.defaultCurrency}: {currencyDisplay.flag} {currencyDisplay.symbol}
      </DropdownMenuLabel>
      <DropdownMenuItem 
        onClick={() => handleCurrencyChange('BRL')} 
        className="hover:bg-accent hover:text-accent-foreground font-mono"
      >
        🇧🇷 Real (BRL)
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => handleCurrencyChange('USD')} 
        className="hover:bg-accent hover:text-accent-foreground font-mono"
      >
        🇺🇸 Dollar (USD)
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => handleCurrencyChange('EUR')} 
        className="hover:bg-accent hover:text-accent-foreground font-mono"
      >
        🇪🇺 Euro (EUR)
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border" />
    </>
  );
};
