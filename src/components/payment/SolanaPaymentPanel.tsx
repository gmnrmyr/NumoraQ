import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wallet, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { solanaWalletService } from "@/services/solanaWalletService";

interface SolanaPaymentPanelProps {
  onPaymentSuccess?: (tier: string, transactionHash: string) => void;
}

export const SolanaPaymentPanel: React.FC<SolanaPaymentPanelProps> = ({ onPaymentSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState(85);
  const [paymentTiers, setPaymentTiers] = useState(solanaWalletService.getPaymentTiers());
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected
    const wallet = solanaWalletService.getConnectedWallet();
    if (wallet) {
      setIsConnected(true);
      setWalletAddress(wallet.publicKey);
    }

    // Update SOL price and tier pricing
    updatePricing();
  }, []);

  const updatePricing = async () => {
    try {
      const price = await solanaWalletService.getSolanaPrice();
      setSolPrice(price);
      await solanaWalletService.updateTierPricing();
      setPaymentTiers(solanaWalletService.getPaymentTiers());
    } catch (error) {
      console.error('Failed to update pricing:', error);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const wallet = await solanaWalletService.connectWallet();
      if (wallet) {
        setIsConnected(true);
        setWalletAddress(wallet.publicKey);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${wallet.publicKey.substring(0, 8)}...${wallet.publicKey.substring(-8)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await solanaWalletService.disconnectWallet();
      setIsConnected(false);
      setWalletAddress(null);
      setSelectedTier(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Solana wallet",
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (tier: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Solana wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSelectedTier(tier);

    try {
      const result = await solanaWalletService.processPayment(tier);
      
      if (result.success && result.transactionHash) {
        toast({
          title: "Payment Successful!",
          description: `Transaction: ${result.transactionHash.substring(0, 20)}...`,
        });
        
        onPaymentSuccess?.(tier, result.transactionHash);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(-8)}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'DEGEN_LIFETIME': return 'border-purple-500 bg-purple-500/10';
      case 'DEGEN_PRO': return 'border-blue-500 bg-blue-500/10';
      case 'WHALE': return 'border-cyan-500 bg-cyan-500/10';
      case 'CHAMPION': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Card className="bg-card border-2 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <span className="text-2xl">🌟</span>
          Solana Wallet Payment
          <Badge variant="outline" className="ml-auto">
            SOL ${solPrice.toFixed(2)}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pay directly with your Solana wallet for instant tier activation
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Wallet Connection */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Wallet className="text-accent" size={20} />
            <div>
              <div className="font-mono font-semibold">
                {isConnected ? 'Connected' : 'Wallet Not Connected'}
              </div>
              {walletAddress && (
                <div className="text-sm text-muted-foreground font-mono">
                  {formatAddress(walletAddress)}
                </div>
              )}
            </div>
          </div>
          
          <Button
            onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
            disabled={isConnecting}
            variant={isConnected ? "outline" : "default"}
            size="sm"
          >
            {isConnecting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Connecting...
              </>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              'Connect Wallet'
            )}
          </Button>
        </div>

        {/* Payment Tiers */}
        <div className="space-y-4">
          <h3 className="font-mono font-semibold">Select Payment Tier</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentTiers.map((tier) => (
              <Card 
                key={tier.tier} 
                className={`${getTierColor(tier.tier)} transition-all hover:shadow-lg`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-mono font-bold">{tier.tier.replace('_', ' ')}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${tier.usdValue} USD
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-lg">
                        ◎{tier.solAmount.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        SOL
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-green-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handlePayment(tier.tier)}
                    disabled={!isConnected || isProcessing}
                    className="w-full font-mono"
                    size="sm"
                  >
                    {isProcessing && selectedTier === tier.tier ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Processing...
                      </>
                    ) : (
                      `Pay ◎${tier.solAmount.toFixed(3)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Beta Feature:</strong> Solana payments are currently in beta. 
            Payments will be processed instantly upon confirmation. 
            Make sure you have enough SOL for transaction fees (~0.001 SOL).
          </AlertDescription>
        </Alert>

        {/* Wallet Installation Guide */}
        {!isConnected && (
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              <strong>Need a Solana wallet?</strong> Install{' '}
              <a 
                href="https://phantom.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-1"
              >
                Phantom <ExternalLink size={12} />
              </a>
              {' '}or{' '}
              <a 
                href="https://solflare.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-1"
              >
                Solflare <ExternalLink size={12} />
              </a>
              {' '}to get started.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 