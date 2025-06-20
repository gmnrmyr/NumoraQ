
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Globe } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const UserPreferences = () => {
  const { data, updateUserProfile } = useFinancialData();

  return (
    <>
      <div className="flex items-center gap-2">
        <DollarSign size={14} className="text-muted-foreground" />
        <Select 
          value={data.userProfile.defaultCurrency} 
          onValueChange={(value) => updateUserProfile({ defaultCurrency: value as "BRL" | "USD" | "EUR" })}
        >
          <SelectTrigger className="w-32 bg-input border-2 border-border font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
            <SelectItem value="USD">🇺🇸 USD</SelectItem>
            <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Globe size={14} className="text-muted-foreground" />
        <Select 
          value={data.userProfile.language} 
          onValueChange={(value) => updateUserProfile({ language: value as "en" | "pt" | "es" })}
        >
          <SelectTrigger className="w-32 bg-input border-2 border-border font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🇺🇸 EN</SelectItem>
            <SelectItem value="pt">🇧🇷 PT</SelectItem>
            <SelectItem value="es">🇪🇸 ES</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
