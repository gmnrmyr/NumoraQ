
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Mail } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
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
    if (currencyValue === 'BRL' || currencyValue === 'USD' || currencyValue === 'EUR') {
      updateUserProfile({
        defaultCurrency: currencyValue
      });
    }
  };
  
  return (
    <Card className="bg-card border-2 border-border brutalist-card mb-6">
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-border">
            <AvatarImage src={data.userProfile.avatar} alt={data.userProfile.name || 'User'} />
            <AvatarFallback className="bg-muted border-2 border-border font-mono">
              {(data.userProfile.name || user?.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm font-mono">
              <Mail size={14} />
              <span className="truncate">{userEmail}</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">Name:</span>
            <EditableValue 
              value={data.userProfile.name} 
              onSave={value => updateUserProfile({ name: String(value) })} 
              type="text" 
              placeholder={displayName} 
              className="bg-input border-2 border-border font-mono text-sm flex-1" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">Currency:</span>
            <EditableValue 
              value={data.userProfile.defaultCurrency} 
              onSave={handleCurrencyUpdate} 
              type="text" 
              className="bg-input border-2 border-border font-mono text-sm flex-1" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
