
import React from 'react';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserPlus, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface UserActionsProps {
  onClose?: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const { importFromJSON, resetData } = useFinancialData();
  const { language, t } = useTranslation();

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
    onClose?.();
  };

  return (
    <>
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
        onClick={() => { resetData(); onClose?.(); }} 
        className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono"
      >
        <Trash2 size={16} className="mr-2" />
        {t.resetData}
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => { signOut(); onClose?.(); }} 
        className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono"
      >
        <LogOut size={16} className="mr-2" />
        {t.signOut}
      </DropdownMenuItem>
    </>
  );
};
