
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Bitcoin, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BitcoinWallet {
  id: string;
  address: string;
  label: string;
  balance: number;
  usdValue: number;
  lastUpdated: string;
}

export const BitcoinTracker = () => {
  const [wallets, setWallets] = useState<BitcoinWallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const validateBitcoinAddress = (address: string): boolean => {
    // Basic Bitcoin address validation (simplified)
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
    return btcRegex.test(address);
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

    if (!validateBitcoinAddress(newAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Bitcoin address",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      // Simulate API call - replace with actual blockchain API
      const mockBalance = Math.random() * 5; // Mock BTC balance
      const mockUsdValue = mockBalance * 45000; // Mock USD value
      
      const newWallet: BitcoinWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        balance: mockBalance,
        usdValue: mockUsdValue,
        lastUpdated: new Date().toISOString(),
      };

      setWallets(prev => [...prev, newWallet]);
      setNewAddress('');
      setNewLabel('');
      
      toast({
        title: "Success",
        description: "Bitcoin wallet added successfully",
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
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Add New Wallet */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="font-mono text-sm flex items-center gap-2">
            <Plus size={16} />
            Add Bitcoin Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="btc-address">Bitcoin Address</Label>
              <Input
                id="btc-address"
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="btc-label">Wallet Label</Label>
              <Input
                id="btc-label"
                placeholder="My Bitcoin Wallet"
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
            {isAdding ? 'Adding...' : 'Add Wallet'}
          </Button>
        </CardContent>
      </Card>

      {/* Wallet List */}
      {wallets.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono uppercase text-sm text-muted-foreground">Tracked Wallets</h3>
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bitcoin size={20} className="text-orange-500" />
                    <div>
                      <div className="font-mono font-semibold">{wallet.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {formatAddress(wallet.address)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">
                      {wallet.balance.toFixed(8)} BTC
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">
                      ${wallet.usdValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      Live
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {wallets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Bitcoin size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono">No Bitcoin wallets tracked yet</p>
          <p className="font-mono text-sm">Add your first wallet to get started</p>
        </div>
      )}
    </div>
  );
};
