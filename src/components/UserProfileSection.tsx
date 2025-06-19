
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User, Mail, RefreshCw } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { EditableValue } from './ui/editable-value';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';

const avatarOptions = [
  {
    id: 'crypto-chad',
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=150&fit=crop&crop=face',
    alt: 'Crypto chad'
  },
  {
    id: 'degen-ape',
    src: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    alt: 'Degen ape'
  },
  {
    id: 'diamond-hands',
    src: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&fit=crop&crop=face',
    alt: 'Diamond hands'
  },
  {
    id: 'moon-cat',
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
    alt: 'Moon cat'
  },
  {
    id: 'hodl-queen',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    alt: 'HODL queen'
  }
];

export const UserProfileSection = () => {
  const { data, updateUserProfile } = useFinancialData();
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    avatarOptions.find(a => a.src === data.userProfile.avatar)?.id || ''
  );
  
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

  const handleAvatarSelect = (avatarId: string) => {
    const avatar = avatarOptions.find(a => a.id === avatarId);
    if (avatar) {
      setSelectedAvatar(avatarId);
      updateUserProfile({ avatar: avatar.src });
    }
  };

  const generateRandomAvatar = () => {
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    setSelectedAvatar(randomAvatar.id);
    updateUserProfile({ avatar: randomAvatar.src });
  };
  
  return (
    <Card className="bg-card border-2 border-border brutalist-card mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-mono uppercase">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main user info with avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage src={data.userProfile.avatar} alt={data.userProfile.name || 'User'} />
            <AvatarFallback className="bg-muted border-2 border-border font-mono text-lg">
              {(data.userProfile.name || user?.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-bold text-sm">{data.userProfile.name || user?.email}</h3>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Mail size={12} />
              <span className="truncate">{userEmail}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {data.userProfile.avatar ? 'Degen mode activated' : 'Using default pfp'}
            </p>
          </div>
          <Button onClick={generateRandomAvatar} variant="outline" size="sm" className="brutalist-button text-xs">
            <RefreshCw size={14} />
            <span className="hidden sm:inline ml-1">Random</span>
          </Button>
        </div>
        
        {/* User settings */}
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

        {/* Avatar selection */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground">
            Choose Degen PFP:
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {avatarOptions.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`relative group ${selectedAvatar === avatar.id ? 'ring-2 ring-accent' : ''}`}
              >
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-border hover:border-accent transition-colors">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                  <AvatarFallback className="bg-muted text-xs font-mono">
                    {avatar.id.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedAvatar === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent border-2 border-background rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-3 border-2 border-border">
          <p><strong>PRO TIP:</strong> NFT PFPs coming soon... wen? 🚀</p>
        </div>
      </CardContent>
    </Card>
  );
};
