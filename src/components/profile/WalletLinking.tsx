import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Link, Unlink, CheckCircle, AlertCircle, Zap, Crown, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/TranslationContext";
import { solanaWalletService } from "@/services/solanaWalletService";
import { useNavigate } from "react-router-dom";

interface LinkedWallet {
  type: 'solana' | 'evm';
  address: string;
  connectedAt: Date;
  lastUsed?: Date;
  nickname?: string;
}

interface WalletLinkingProps {
  onWalletLinked?: (wallet: LinkedWallet) => void;
  onWalletUnlinked?: (type: string) => void;
}

export const WalletLinking: React.FC<WalletLinkingProps> = ({ 
  onWalletLinked, 
  onWalletUnlinked 
}) => {
  const [linkedWallets, setLinkedWallets] = useState<LinkedWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load linked wallets from localStorage
    const stored = localStorage.getItem('linkedWallets');
    if (stored) {
      try {
        const wallets = JSON.parse(stored).map((w: any) => ({
          ...w,
          connectedAt: new Date(w.connectedAt),
          lastUsed: w.lastUsed ? new Date(w.lastUsed) : undefined
        }));
        setLinkedWallets(wallets);
      } catch (error) {
        console.error('Error loading linked wallets:', error);
      }
    }
  }, []);

  const saveLinkedWallets = (wallets: LinkedWallet[]) => {
    localStorage.setItem('linkedWallets', JSON.stringify(wallets));
    setLinkedWallets(wallets);
  };

  const connectSolanaWallet = async () => {
    setIsConnecting('solana');
    try {
      const wallet = await solanaWalletService.connectWallet();
      if (wallet) {
        const existingIndex = linkedWallets.findIndex(w => w.type === 'solana');
        const newWallet: LinkedWallet = {
          type: 'solana',
          address: wallet.publicKey,
          connectedAt: new Date(),
          lastUsed: new Date(),
          nickname: `Solana Wallet`
        };

        let updatedWallets;
        if (existingIndex >= 0) {
          updatedWallets = [...linkedWallets];
          updatedWallets[existingIndex] = newWallet;
        } else {
          updatedWallets = [...linkedWallets, newWallet];
        }

        saveLinkedWallets(updatedWallets);
        onWalletLinked?.(newWallet);
        
        toast({
          title: "Solana Wallet Connected",
          description: `Connected ${wallet.publicKey.substring(0, 8)}...${wallet.publicKey.substring(-8)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect Solana wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const connectEVMWallet = async () => {
    setIsConnecting('evm');
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          const existingIndex = linkedWallets.findIndex(w => w.type === 'evm');
          const newWallet: LinkedWallet = {
            type: 'evm',
            address,
            connectedAt: new Date(),
            lastUsed: new Date(),
            nickname: 'MetaMask Wallet'
          };

          let updatedWallets;
          if (existingIndex >= 0) {
            updatedWallets = [...linkedWallets];
            updatedWallets[existingIndex] = newWallet;
          } else {
            updatedWallets = [...linkedWallets, newWallet];
          }

          saveLinkedWallets(updatedWallets);
          onWalletLinked?.(newWallet);
          
          toast({
            title: "EVM Wallet Connected",
            description: `Connected ${address.substring(0, 8)}...${address.substring(-8)}`,
          });
        }
      } else {
        throw new Error('MetaMask not found. Please install MetaMask wallet.');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect EVM wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const unlinkWallet = (type: string) => {
    const updatedWallets = linkedWallets.filter(w => w.type !== type);
    saveLinkedWallets(updatedWallets);
    onWalletUnlinked?.(type);
    
    toast({
      title: "Wallet Unlinked",
      description: `${type.toUpperCase()} wallet has been unlinked`,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(-8)}`;
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'solana': return '🌟';
      case 'evm': return '⚡';
      default: return '💼';
    }
  };



  return (
    <Card className="bg-card border-2 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Link size={20} />
          {t.linkedWallets}
          <Badge variant="outline" className="ml-auto">
            {t.directPayments}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.connectWallets}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Linked Wallets Display */}
        <div className="space-y-4">
          {linkedWallets.map((wallet, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getWalletIcon(wallet.type)}</span>
                <div>
                  <div className="font-mono font-semibold">
                    {wallet.nickname || `${wallet.type.toUpperCase()} Wallet`}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {formatAddress(wallet.address)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Connected: {wallet.connectedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/donation')}
                  size="sm"
                  className="bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30"
                >
                  <Crown size={14} className="mr-1" />
                  Pay for Tier
                </Button>
                <Button
                  onClick={() => navigate('/payment')}
                  size="sm"
                  className="bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30"
                >
                  <CreditCard size={14} className="mr-1" />
                  Pay for Degen
                </Button>
                <Button
                  onClick={() => unlinkWallet(wallet.type)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400/40 hover:bg-red-500/20"
                >
                  <Unlink size={14} />
                </Button>
              </div>
            </div>
          ))}
          
          {linkedWallets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-mono">No wallets linked yet</p>
              <p className="text-sm">Connect your wallets to enable direct payments</p>
            </div>
          )}
        </div>



        {/* Connection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solana Connection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <span className="font-mono font-semibold">Solana Wallet</span>
              {linkedWallets.some(w => w.type === 'solana') && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            <Button
              onClick={connectSolanaWallet}
              disabled={isConnecting === 'solana'}
              className="w-full"
              variant={linkedWallets.some(w => w.type === 'solana') ? "outline" : "default"}
            >
              {isConnecting === 'solana' ? (
                'Connecting...'
              ) : linkedWallets.some(w => w.type === 'solana') ? (
                'Reconnect Solana'
              ) : (
                'Connect Solana'
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Phantom, Solflare, and other Solana wallets
            </p>
          </div>

          {/* EVM Connection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-mono font-semibold">EVM Wallet</span>
              {linkedWallets.some(w => w.type === 'evm') && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            <Button
              onClick={connectEVMWallet}
              disabled={isConnecting === 'evm'}
              className="w-full"
              variant={linkedWallets.some(w => w.type === 'evm') ? "outline" : "default"}
            >
              {isConnecting === 'evm' ? (
                'Connecting...'
              ) : linkedWallets.some(w => w.type === 'evm') ? (
                'Reconnect EVM'
              ) : (
                'Connect MetaMask'
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              MetaMask, WalletConnect, and other EVM wallets
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>Direct Payment Benefits:</strong> Once linked, you can pay for tiers directly through your wallet with one click. 
            No need to copy addresses or send manual transactions. Your tier activates instantly upon payment confirmation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}; 