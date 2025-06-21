
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Coins, Image, Wallet, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EVMWalletService } from './EVMWalletService';

interface TrackedWallet {
  id: string;
  address: string;
  label: string;
  totalValue: number;
  tokens: Array<{
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
  }>;
  nfts: Array<{
    contractAddress: string;
    name: string;
    count: number;
    totalValue: number;
  }>;
  lastUpdated: string;
}

export const AdvancedEVMTracker = () => {
  const [wallets, setWallets] = useState<TrackedWallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addWallet = async () => {
    if (!newAddress || !newLabel) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid EVM address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const walletData = await EVMWalletService.fetchWalletTokens(newAddress);
      const nftData = await EVMWalletService.fetchNFTValues(newAddress);
      
      const newWallet: TrackedWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        totalValue: walletData.totalUsd + nftData.reduce((sum, nft) => sum + nft.totalValue, 0),
        tokens: walletData.tokens,
        nfts: nftData,
        lastUpdated: walletData.lastUpdated,
      };

      setWallets(prev => [...prev, newWallet]);
      setNewAddress('');
      setNewLabel('');
      
      toast({
        title: "Success",
        description: `Wallet added with $${newWallet.totalValue.toLocaleString()} total value`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const refreshWallet = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    setIsLoading(true);
    
    try {
      const walletData = await EVMWalletService.fetchWalletTokens(wallet.address);
      const nftData = await EVMWalletService.fetchNFTValues(wallet.address);
      
      setWallets(prev => prev.map(w => w.id === walletId ? {
        ...w,
        totalValue: walletData.totalUsd + nftData.reduce((sum, nft) => sum + nft.totalValue, 0),
        tokens: walletData.tokens,
        nfts: nftData,
        lastUpdated: walletData.lastUpdated,
      } : w));
      
      toast({
        title: "Refreshed",
        description: "Wallet data updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh wallet data",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const removeWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Removed",
      description: "Wallet removed from tracking",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalPortfolioValue = wallets.reduce((sum, wallet) => sum + wallet.totalValue, 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {wallets.length > 0 && (
        <Card className="bg-accent/10 border-accent">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-accent">
                ${totalPortfolioValue.toLocaleString()}
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                Total Portfolio Value • {wallets.length} Wallet{wallets.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Wallet */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="font-mono text-sm flex items-center gap-2">
            <Plus size={16} />
            Advanced EVM Wallet Tracker
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Fetches live token & NFT values from blockchain
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advanced-address">Wallet Address</Label>
              <Input
                id="advanced-address"
                placeholder="0x742d35Cc6638C0532925a3b8D186dE0824c821A4"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advanced-label">Wallet Label</Label>
              <Input
                id="advanced-label"
                placeholder="My DeFi Portfolio"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={addWallet} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Fetching Data...' : 'Add Advanced Wallet'}
          </Button>
        </CardContent>
      </Card>

      {/* Wallet List */}
      {wallets.map((wallet) => (
        <Card key={wallet.id} className="bg-muted/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet size={20} className="text-accent" />
                <div>
                  <div className="font-mono font-semibold">{wallet.label}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {formatAddress(wallet.address)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg">
                  ${wallet.totalValue.toLocaleString()}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Updated: {new Date(wallet.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refreshWallet(wallet.id)}
                  disabled={isLoading}
                >
                  <RefreshCw size={14} />
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
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tokens" className="flex items-center gap-2">
                  <Coins size={14} />
                  Tokens ({wallet.tokens.length})
                </TabsTrigger>
                <TabsTrigger value="nfts" className="flex items-center gap-2">
                  <Image size={14} />
                  NFTs ({wallet.nfts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tokens" className="space-y-2 mt-4">
                {wallet.tokens.length > 0 ? (
                  <div className="space-y-2">
                    {wallet.tokens.map((token, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded border">
                        <div>
                          <div className="font-mono font-semibold text-sm">{token.symbol}</div>
                          <div className="font-mono text-xs text-muted-foreground">{token.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {token.balance.toFixed(4)}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            ${token.usdValue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">
                    No tokens found
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nfts" className="space-y-2 mt-4">
                {wallet.nfts.length > 0 ? (
                  <div className="space-y-2">
                    {wallet.nfts.map((nft, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-background/50 rounded border">
                        <div>
                          <div className="font-mono font-semibold text-sm">{nft.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {nft.count} item{nft.count !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            ${nft.totalValue.toLocaleString()}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            Est. Value
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">
                    No NFTs found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}

      {wallets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Wallet size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono">No advanced wallets tracked yet</p>
          <p className="font-mono text-sm">Add your first wallet to get live token & NFT data</p>
        </div>
      )}
    </div>
  );
};
