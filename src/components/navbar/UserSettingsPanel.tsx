import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, DollarSign, User, UserPlus, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLivePrices } from '@/hooks/useLivePrices';
import { LanguageSelector } from '@/components/LanguageSelector';
export const UserSettingsPanel = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    data,
    updateUserProfile,
    resetData,
    importFromJSON
  } = useFinancialData();
  const {
    language,
    t
  } = useTranslation();
  const {
    fetchLivePrices,
    isLiveDataEnabled
  } = useLivePrices();
  const createNewUser = (currency: 'BRL' | 'USD') => {
    const userEmail = user?.email || '';
    const templates = {
      BRL: {
        userProfile: {
          name: userEmail,
          defaultCurrency: 'BRL' as const,
          language: language
        },
        projectionMonths: 12,
        exchangeRates: {
          brlToUsd: 0.18,
          usdToBrl: 5.54,
          btcPrice: 588300,
          ethPrice: 14000,
          lastUpdated: new Date().toISOString()
        },
        liquidAssets: [],
        illiquidAssets: [],
        passiveIncome: [],
        activeIncome: [],
        expenses: [],
        tasks: [],
        debts: [],
        properties: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      },
      USD: {
        userProfile: {
          name: userEmail,
          defaultCurrency: 'USD' as const,
          language: language
        },
        projectionMonths: 12,
        exchangeRates: {
          brlToUsd: 0.18,
          usdToBrl: 5.54,
          btcPrice: 100000,
          ethPrice: 2500,
          lastUpdated: new Date().toISOString()
        },
        liquidAssets: [],
        illiquidAssets: [],
        passiveIncome: [],
        activeIncome: [],
        expenses: [],
        tasks: [],
        debts: [],
        properties: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
    const templateJson = JSON.stringify(templates[currency]);
    importFromJSON(templateJson);
  };
  const handleCurrencyChange = async (newCurrency: 'BRL' | 'USD' | 'EUR') => {
    console.log('Currency changed to:', newCurrency);
    updateUserProfile({
      defaultCurrency: newCurrency
    });
    if (user && isLiveDataEnabled) {
      console.log('Fetching prices for new currency:', newCurrency);
      await fetchLivePrices(newCurrency);
    }
  };
  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'BRL':
        return {
          symbol: 'R$',
          flag: '🇧🇷'
        };
      case 'USD':
        return {
          symbol: '$',
          flag: '🇺🇸'
        };
      case 'EUR':
        return {
          symbol: '€',
          flag: '🇪🇺'
        };
      default:
        return {
          symbol: currency,
          flag: ''
        };
    }
  };
  const currencyDisplay = getCurrencyDisplay(data.userProfile.defaultCurrency);
  const displayName = data.userProfile.name || user?.email || "User";
  if (!user) return null;
  return <div className="flex items-center gap-2">
      <LanguageSelector variant="outline" size="sm" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button bg-stone-900 hover:bg-stone-800 text-slate-50">
            <Settings size={16} />
            <span className="hidden sm:inline font-mono uppercase">{t.userProfile}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-2 border-border z-50">
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-2 font-mono">
            <User size={16} />
            <span className="truncate">{displayName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          
          {/* Currency Selection */}
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2 font-mono uppercase">
            <DollarSign size={12} />
            {t.defaultCurrency}: {currencyDisplay.flag} {currencyDisplay.symbol}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleCurrencyChange('BRL')} className="hover:bg-accent hover:text-accent-foreground font-mono">
            🇧🇷 Real (BRL)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCurrencyChange('USD')} className="hover:bg-accent hover:text-accent-foreground font-mono">
            🇺🇸 Dollar (USD)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCurrencyChange('EUR')} className="hover:bg-accent hover:text-accent-foreground font-mono">
            🇪🇺 Euro (EUR)
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-border" />
          
          {/* User Management */}
          <DropdownMenuItem onClick={() => createNewUser('BRL')} className="hover:bg-accent hover:text-accent-foreground font-mono">
            <UserPlus size={16} className="mr-2" />
            Novo Usuário (BRL 🇧🇷)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createNewUser('USD')} className="hover:bg-accent hover:text-accent-foreground font-mono">
            <UserPlus size={16} className="mr-2" />
            New User (USD 🇺🇸)
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-border" />
          
          <DropdownMenuItem onClick={resetData} className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono">
            <Trash2 size={16} className="mr-2" />
            {t.resetData}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono">
            <LogOut size={16} className="mr-2" />
            {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
};