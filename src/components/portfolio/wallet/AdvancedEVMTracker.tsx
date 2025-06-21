
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WalletService } from '@/services/walletService';
import { WalletForm } from './WalletForm';
import { WalletCard } from './WalletCard';

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
  defiPositions: Array<{
    protocol: string;
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
      const walletData = await WalletService.fetchWalletData(newAddress);
      
      const newWallet: TrackedWallet = {
        id: Date.now().toString(),
        address: newAddress,
        label: newLabel,
        totalValue: walletData.totalUsd,
        tokens: walletData.tokens,
        defiPositions: walletData.defiPositions,
        nfts: walletData.nfts,
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
      const walletData = await WalletService.fetchWalletData(wallet.address);
      
      setWallets(prev => prev.map(w => w.id === walletId ? {
        ...w,
        totalValue: walletData.totalUsd,
        tokens: walletData.tokens,
        defiPositions: walletData.defiPositions,
        nfts: walletData.nfts,
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
      <WalletForm
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        newLabel={newLabel}
        setNewLabel={setNewLabel}
        onSubmit={addWallet}
        isLoading={isLoading}
      />

      {/* Wallet List */}
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          onRefresh={refreshWallet}
          onRemove={removeWallet}
          isLoading={isLoading}
        />
      ))}

      {wallets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Wallet size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono">No advanced wallets tracked yet</p>
          <p className="font-mono text-sm">Add your first wallet to get live token & DeFi data</p>
        </div>
      )}
    </div>
  );
};
