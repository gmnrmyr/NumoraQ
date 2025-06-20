
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, User, UserPlus, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { CurrencySelector } from './CurrencySelector';

export const UserSettingsPanel = () => {
  const { user, signOut } = useAuth();
  const { data, importFromJSON, resetData } = useFinancialData();
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = data.userProfile.name || user?.email || "User";

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
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button bg-stone-900 hover:bg-stone-800 text-slate-50">
          <Settings size={16} />
          <span className="hidden sm:inline font-mono uppercase">{t.userProfile}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-2 border-border z-50">
        <DropdownMenuLabel className="flex items-center gap-2 font-mono">
          <User size={16} />
          <span className="truncate">{displayName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <div className="px-2 py-1">
          <CurrencySelector />
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          onClick={() => createNewUser('BRL')} 
          className="hover:bg-accent hover:text-accent-foreground font-mono"
        >
          <UserPlus size={16} className="mr-2" />
          Novo Usuário (BRL 🇧🇷)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => createNewUser('USD')} 
          className="hover:bg-accent hover:text-accent-foreground font-mono"
        >
          <UserPlus size={16} className="mr-2" />
          New User (USD 🇺🇸)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          onClick={() => { resetData(); setIsOpen(false); }} 
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono"
        >
          <Trash2 size={16} className="mr-2" />
          {t.resetData}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { signOut(); setIsOpen(false); }} 
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono"
        >
          <LogOut size={16} className="mr-2" />
          {t.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
