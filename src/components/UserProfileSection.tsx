
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
      updateUserProfile({ defaultCurrency: currencyValue });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-slate-700 to-slate-800 text-white mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User size={20} />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={16} />
          <span>{userEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Display Name:</span>
          <EditableValue
            value={data.userProfile.name}
            onSave={(value) => updateUserProfile({ name: String(value) })}
            type="text"
            placeholder={displayName}
            className="text-white bg-white/20 hover:bg-white/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Default Currency:</span>
          <EditableValue
            value={data.userProfile.defaultCurrency}
            onSave={handleCurrencyUpdate}
            type="text"
            className="text-white bg-white/20 hover:bg-white/30"
          />
        </div>
      </CardContent>
    </Card>
  );
};
