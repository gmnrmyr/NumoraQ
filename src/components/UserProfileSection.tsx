
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail } from 'lucide-react';
import { EditableValue } from './ui/editable-value';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';

export const UserProfileSection = () => {
  const { data, updateUserProfile } = useFinancialData();
  const { user } = useAuth();
  
  const displayName = user?.email || data.userProfile.name || 'Default User';
  const userEmail = user?.email || 'user@example.com';
  
  const handleCurrencyUpdate = (value: string | number) => {
    const currencyValue = String(value);
    // Validate that the currency is one of the allowed types
    if (currencyValue === 'BRL' || currencyValue === 'USD' || currencyValue === 'EUR') {
      updateUserProfile({
        defaultCurrency: currencyValue
      });
    }
  };
  
  return (
    <Card className="bg-card border-2 border-border brutalist-card mb-6">
      <CardContent className="space-y-3 py-[7px]">
        <div className="flex items-center gap-2 text-sm font-mono">
          <Mail size={16} />
          <span>{userEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">Display Name:</span>
          <EditableValue 
            value={data.userProfile.name} 
            onSave={value => updateUserProfile({ name: String(value) })} 
            type="text" 
            placeholder={displayName} 
            className="bg-input border-2 border-border font-mono" 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">Default Currency:</span>
          <EditableValue 
            value={data.userProfile.defaultCurrency} 
            onSave={handleCurrencyUpdate} 
            type="text" 
            className="bg-input border-2 border-border font-mono" 
          />
        </div>
      </CardContent>
    </Card>
  );
};
