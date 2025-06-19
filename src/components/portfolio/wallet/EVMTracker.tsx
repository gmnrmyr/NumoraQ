
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Coins, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EVMWallet {
  id: string;
  address: string;
  label: string;
  chain: string;
  tokens: Array<{
    symbol: string;
    balance: number;
    usdValue: number;
    name: string;
  }>;
  nfts: number;
  lastUpdated: string;
}

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: 'text-blue-500' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: 'text-purple-500' },
  { id: 'bsc', name: 'Binance Smart Chain', symbol: 'BNB', color: 'text-yellow-500' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', color: 'text-blue-400' },
  { id: 'optimism', name: 'Optimism', symbol: 'ETH', color: 'text-red-500' },
];

export const EVMTracker = () => {
  const [wallets, setWallets] = useState<EVMWallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const validateEVMAddress = (address: string): boolean => {
    // Basic EVM address validation
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    return evmRegex.test(address);
  };

  const addWallet = async () => {
    if (!newAddress || !newLabel || !selectedChain) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEVMAddress(newAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid EVM address",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      // Simulate API call - replace with actual blockchain API
      const mockTokens = [
        { symbol: 'ETH', balance: Math.random() * 10, usdValue: Math.random() * 20000, name: 'Ethereum' },
        { symbol: 'USDC', balance: Math.random() * 1000, usdValue: Math.random() * 1000, name: 'USD Coin' },
      ];
      
      const newWallet: EVMWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        chain: selectedChain,
        tokens: mockTokens,
        nfts: Math.floor(Math.random() * 50),
        lastUpdated: new Date().toISOString(),
      };

      setWallets(prev => [...prev, newWallet]);
      setNewAddress('');
      setNewLabel('');
      setSelectedChain('');
      
      toast({
        title: "Success",
        description: "EVM wallet added successfully",
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainInfo = (chainId: string) => {
    return SUPPORTED_CHAINS.find(c => c.id === chainId) || SUPPORTED_CHAINS[0];
  };

  return (
    <div className="space-y-6">
      {/* Add New Wallet */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="font-mono text-sm flex items-center gap-2">
            <Plus size={16} />
            Add EVM Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evm-address">Wallet Address</Label>
              <Input
                id="evm-address"
                placeholder="0x742d35Cc6638C0532925a3b8D186dE0824c821A4"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evm-label">Wallet Label</Label>
              <Input
                id="evm-label"
                placeholder="My DeFi Wallet"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evm-chain">Blockchain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <span className={chain.color}>{chain.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          {wallets.map((wallet) => {
            const chainInfo = getChainInfo(wallet.chain);
            const totalValue = wallet.tokens.reduce((sum, token) => sum + token.usdValue, 0);
            
            return (
              <Card key={wallet.id} className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Coins size={20} className={chainInfo.color} />
                      <div>
                        <div className="font-mono font-semibold">{wallet.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(wallet.address)} • {chainInfo.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold">
                        ${totalValue.toLocaleString()}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {wallet.nfts} NFTs
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
                  
                  {/* Token List */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs uppercase text-muted-foreground">Tokens</h4>
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {wallets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Coins size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono">No EVM wallets tracked yet</p>
          <p className="font-mono text-sm">Add your first wallet to get started</p>
        </div>
      )}
    </div>
  );
};
