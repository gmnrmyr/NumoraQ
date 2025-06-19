
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Coins, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SolanaWallet {
  id: string;
  address: string;
  label: string;
  solBalance: number;
  usdValue: number;
  tokens: Array<{
    symbol: string;
    balance: number;
    usdValue: number;
    name: string;
  }>;
  nfts: number;
  lastUpdated: string;
}

export const SolanaTracker = () => {
  const [wallets, setWallets] = useState<SolanaWallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const validateSolanaAddress = (address: string): boolean => {
    // Basic Solana address validation (base58, 32-44 chars)
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaRegex.test(address);
  };

  const addWallet = async () => {
    if (!newAddress || !newLabel) {
      toast({
        title: "Error",
        description: "Please enter both address and label",
        variant: "destructive",
      });
      return;
    }

    if (!validateSolanaAddress(newAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      // Simulate API call - replace with actual Solana API
      const mockSolBalance = Math.random() * 100;
      const mockTokens = [
        { symbol: 'USDC', balance: Math.random() * 1000, usdValue: Math.random() * 1000, name: 'USD Coin' },
        { symbol: 'RAY', balance: Math.random() * 500, usdValue: Math.random() * 100, name: 'Raydium' },
      ];
      
      const newWallet: SolanaWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        solBalance: mockSolBalance,
        usdValue: mockSolBalance * 120, // Mock SOL price
        tokens: mockTokens,
        nfts: Math.floor(Math.random() * 20),
        lastUpdated: new Date().toISOString(),
      };

      setWallets(prev => [...prev, newWallet]);
      setNewAddress('');
      setNewLabel('');
      
      toast({
        title: "Success",
        description: "Solana wallet added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsAdding(false);
  };

  const removeWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Removed",
      description: "Wallet removed from tracking",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <Card className="border-yellow-500 bg-yellow-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-yellow-500" />
            <div>
              <div className="font-mono font-semibold text-yellow-700 dark:text-yellow-400">
                Solana Integration Coming Soon
              </div>
              <div className="font-mono text-sm text-yellow-600 dark:text-yellow-500">
                Full Solana wallet tracking with SPL tokens and NFTs will be available in the next update
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Wallet */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="font-mono text-sm flex items-center gap-2">
            <Plus size={16} />
            Add Solana Wallet (Preview)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sol-address">Solana Address</Label>
              <Input
                id="sol-address"
                placeholder="9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sol-label">Wallet Label</Label>
              <Input
                id="sol-label"
                placeholder="My Solana Wallet"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={addWallet} 
            disabled={isAdding}
            className="w-full"
          >
            {isAdding ? 'Adding...' : 'Add Wallet (Preview)'}
          </Button>
        </CardContent>
      </Card>

      {/* Wallet List */}
      {wallets.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono uppercase text-sm text-muted-foreground">Tracked Wallets</h3>
          {wallets.map((wallet) => {
            const totalTokenValue = wallet.tokens.reduce((sum, token) => sum + token.usdValue, 0);
            const totalValue = wallet.usdValue + totalTokenValue;
            
            return (
              <Card key={wallet.id} className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Coins size={20} className="text-purple-500" />
                      <div>
                        <div className="font-mono font-semibold">{wallet.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(wallet.address)} • Solana
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold">
                        {wallet.solBalance.toFixed(4)} SOL
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        ${totalValue.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        Preview
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeWallet(wallet.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Token List */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs uppercase text-muted-foreground">SPL Tokens</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {wallet.tokens.map((token, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded">
                          <div className="font-mono text-sm">
                            {token.balance.toFixed(4)} {token.symbol}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            ${token.usdValue.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    {wallet.nfts > 0 && (
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                        <div className="font-mono text-sm">NFTs</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {wallet.nfts} items
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {wallets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Coins size={48} className="mx-auto mb-4 opacity-50 text-purple-500" />
          <p className="font-mono">No Solana wallets tracked yet</p>
          <p className="font-mono text-sm">Add your first wallet to preview the functionality</p>
        </div>
      )}
    </div>
  );
};
