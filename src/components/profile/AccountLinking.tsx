
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, MessageCircle, Mail, Link, Eye, EyeOff } from 'lucide-react';

export const AccountLinking = () => {
  const { user, linkAccount } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showLinkedAccounts, setShowLinkedAccounts] = useState(true);

  if (!user) return null;

  const identities = user.identities || [];
  const connectedProviders = identities.map(identity => identity.provider);

  const handleLinkAccount = async (provider: 'solana' | 'discord') => {
    setLoading(provider);
    await linkAccount(provider);
    setLoading(null);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'email':
        return <Mail size={14} />;
      case 'discord':
        return <MessageCircle size={14} />;
      case 'web3':
        return <Wallet size={14} />;
      default:
        return <Link size={14} />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'email':
        return 'Email';
      case 'discord':
        return 'Discord';
      case 'web3':
        return 'Solana';
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  return (
    <Card className="brutalist-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-mono text-sm">
          <div className="flex items-center gap-2">
            <Link className="text-accent" size={16} />
            LINKED ACCOUNTS
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkedAccounts(!showLinkedAccounts)}
          >
            {showLinkedAccounts ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connected Accounts */}
        {showLinkedAccounts && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-muted-foreground">Connected:</h4>
            <div className="flex flex-wrap gap-2">
              {identities.length > 0 ? (
                identities.map((identity, index) => (
                  <Badge key={index} variant="outline" className="font-mono text-xs">
                    {getProviderIcon(identity.provider)}
                    <span className="ml-1">{getProviderName(identity.provider)}</span>
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                  No accounts linked
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Link Additional Accounts */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-muted-foreground">Link More:</h4>
          <div className="flex flex-col gap-2">
            {!connectedProviders.includes('web3') && (
              <Button
                onClick={() => handleLinkAccount('solana')}
                variant="outline"
                size="sm"
                disabled={loading === 'solana'}
                className="justify-start font-mono"
              >
                <Wallet size={14} className="mr-2" />
                {loading === 'solana' ? 'Linking...' : 'Link Solana Wallet'}
              </Button>
            )}
            
            {!connectedProviders.includes('discord') && (
              <Button
                onClick={() => handleLinkAccount('discord')}
                variant="outline"
                size="sm"
                disabled={loading === 'discord'}
                className="justify-start font-mono"
              >
                <MessageCircle size={14} className="mr-2" />
                {loading === 'discord' ? 'Linking...' : 'Link Discord Account'}
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
          🔗 <strong>Account Linking:</strong> Connect multiple authentication methods to your account for easier access.
        </div>
      </CardContent>
    </Card>
  );
};
