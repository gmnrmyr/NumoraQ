
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Bitcoin, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BitcoinWallet {
  id: string;
  address: string;
  label: string;
  balance: number;
  usdValue: number;
  lastUpdated: string;
  isAutoFetching?: boolean;
}

export const BitcoinTracker = () => {
  const [wallets, setWallets] = useState<BitcoinWallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isFetching, setIsFetching] = useState<string | null>(null);
  const { toast } = useToast();

  const validateBitcoinAddress = (address: string): boolean => {
    // Basic Bitcoin address validation (simplified)
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
    return btcRegex.test(address);
  };

  const fetchBitcoinPrice = async (): Promise<number> => {
    try {
      // Mock API call - replace with real CoinGecko API
      // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      // const data = await response.json();
      // return data.bitcoin.usd;
      
      // Mock price for demo
      return 45000 + (Math.random() * 5000); // Simulated BTC price between 45k-50k
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
      return 45000; // Fallback price
    }
  };

  const fetchWalletBalance = async (address: string): Promise<{ balance: number; btcPrice: number }> => {
    try {
      // Mock API call - replace with real blockchain API
      // For real implementation, use:
      // - BlockCypher API: https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance
      // - Blockchain.info API: https://blockchain.info/q/addressbalance/${address}
      // - Blockstream API: https://blockstream.info/api/address/${address}
      
      const btcPrice = await fetchBitcoinPrice();
      const mockBalance = Math.random() * 5; // Mock BTC balance
      
      return {
        balance: mockBalance,
        btcPrice
      };
    } catch (error) {
      throw new Error('Failed to fetch wallet balance');
    }
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
      // Auto-fetch wallet balance
      const { balance, btcPrice } = await fetchWalletBalance(newAddress);
      
      const newWallet: BitcoinWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        balance: balance,
        usdValue: balance * btcPrice,
        lastUpdated: new Date().toISOString(),
        isAutoFetching: true,
      };

      setWallets(prev => [...prev, newWallet]);
      setNewAddress('');
      setNewLabel('');
      
      toast({
        title: "Success",
        description: `Bitcoin wallet added with ${balance.toFixed(8)} BTC`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wallet balance. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsAdding(false);
  };

  const refreshWallet = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    setIsFetching(walletId);
    
    try {
      const { balance, btcPrice } = await fetchWalletBalance(wallet.address);
      
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? {
              ...w,
              balance,
              usdValue: balance * btcPrice,
              lastUpdated: new Date().toISOString()
            }
          : w
      ));
      
      toast({
        title: "Updated",
        description: `Wallet balance refreshed: ${balance.toFixed(8)} BTC`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh wallet balance",
        variant: "destructive",
      });
    }
    
    setIsFetching(null);
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

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
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
            {isAdding ? 'Fetching Balance...' : 'Add Wallet & Auto-Fetch'}
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
                      {wallet.isAutoFetching && (
                        <div className="text-xs text-muted-foreground">
                          Updated: {formatLastUpdated(wallet.lastUpdated)}
                        </div>
                      )}
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
                      {wallet.isAutoFetching ? 'Auto' : 'Manual'}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refreshWallet(wallet.id)}
                      disabled={isFetching === wallet.id}
                      title="Refresh Balance"
                    >
                      <RefreshCw size={14} className={isFetching === wallet.id ? 'animate-spin' : ''} />
                    </Button>
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
