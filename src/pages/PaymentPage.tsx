import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Heart, Zap, Star, Gift, Copy, Check, Info, Twitter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import { PremiumSubscriptionPanel } from '@/components/premium/PremiumSubscriptionPanel';
import { SimplePaymentProcessor } from '@/components/premium/SimplePaymentProcessor';
import { SolanaPaymentPanel } from '@/components/payment/SolanaPaymentPanel';
import { useCMSSettings } from '@/hooks/useCMSSettings';
import { useCryptoPaymentMonitor } from '@/hooks/useCryptoPaymentMonitor';
import { toast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const { settings, loading } = useCMSSettings();
  const { isMonitoring, getWalletAddress, getPaymentTiers } = useCryptoPaymentMonitor();
  const [copiedWallet, setCopiedWallet] = React.useState<string>('');

  const copyWallet = (wallet: string, type: string) => {
    navigator.clipboard.writeText(wallet);
    setCopiedWallet(type);
    setTimeout(() => setCopiedWallet(''), 2000);
    toast({
      title: "Copied!",
      description: `${type} wallet address copied to clipboard`
    });
  };



  // Wallet options with CMS data and status
  const walletOptions = [
    { 
      type: 'EVM', 
      address: settings.project_wallet_evm, 
      label: 'Ethereum / BSC / Polygon', 
      icon: '⚡', 
      status: 'active',
      description: 'Active - Tracks payment tiers'
    },
    { 
      type: 'Solana', 
      address: settings.project_wallet_solana, 
      label: 'Solana Network', 
      icon: '🌟', 
      status: 'upcoming',
      description: 'Coming Soon - Will track tiers in future'
    },
    { 
      type: 'Bitcoin', 
      address: settings.project_wallet_btc, 
      label: 'Bitcoin Network', 
      icon: '₿', 
      status: 'upcoming',
      description: 'Coming Soon - Will track tiers in future'
    },
    { 
      type: 'Bitcoin Cash', 
      address: settings.project_wallet_bch, 
      label: 'Bitcoin Cash Network', 
      icon: '🅱️', 
      status: 'upcoming',
      description: 'Coming Soon - Will track tiers in future'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar activeTab="" onTabChange={() => {}} />
        <div className="pt-20 sm:pt-32 pb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-pulse">Loading payment information...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="" onTabChange={() => {}} />
      
      <div className="pt-20 sm:pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-accent uppercase tracking-wider">
              DEGEN PLANS & SUBSCRIPTIONS
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              Choose your degen plan and unlock premium features
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <Crown className="text-accent" size={24} />
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>

          {/* Beta Payment Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="text-accent mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-accent">DEGEN FINANCIAL PLATFORM</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Numoraq is a degen financial platform for serious wealth builders. All new users get extended beta trial access. 
                    Choose a degen plan to unlock advanced features, AI-powered insights, and premium themes.
                  </p>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded mt-3">
                    <p className="text-sm font-mono text-orange-600">
                      ⚠️ <strong>Beta Status:</strong> Payments are in implementation. Feel free to send payments to our EVM address with a message to numoraq@gmail.com while in beta.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">CONTACT & SUPPORT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-muted-foreground">
                <p className="mb-2">
                  <strong>Email:</strong> numoraq@gmail.com
                </p>
                <p>
                  For payment issues, degen support, or general inquiries, please contact us via email or social media.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Simple Payment Processor - Easy Degen Purchase */}
          <SimplePaymentProcessor />

          {/* Solana Direct Payment */}
          <SolanaPaymentPanel 
            onPaymentSuccess={(tier, transactionHash) => {
              toast({
                title: "Payment Successful!",
                description: `Your ${tier} tier is now active. Transaction: ${transactionHash}`,
              });
            }}
          />

          {/* Degen Subscription Panel */}
          <PremiumSubscriptionPanel />



          {/* Crypto Wallets Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                💰 CRYPTO PAYMENTS
                {isMonitoring && (
                  <Badge className="bg-green-600 text-white text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                    Auto-Detection Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletOptions.map((wallet) => (
                  <div key={wallet.type} className={`p-4 border border-border rounded ${wallet.status === 'upcoming' ? 'bg-muted/30' : 'bg-card/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{wallet.icon}</span>
                        <span className="font-mono font-bold text-foreground">{wallet.type}</span>
                        {wallet.status === 'upcoming' && (
                          <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                            Coming Soon
                          </Badge>
                        )}
                        {wallet.status === 'active' && (
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                            Active
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {wallet.label}
                      </Badge>
                    </div>
                    
                    <div className="text-xs font-mono text-muted-foreground mb-2">
                      {wallet.description}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <code className={`flex-1 p-2 bg-muted rounded font-mono text-xs break-all ${wallet.status === 'upcoming' && !wallet.address ? 'text-muted-foreground' : ''}`}>
                        {wallet.address || 'Wallet address will be available soon...'}
                      </code>
                      {wallet.address && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyWallet(wallet.address, wallet.type)}
                          className="font-mono"
                          disabled={wallet.status === 'upcoming'}
                        >
                          {copiedWallet === wallet.type ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Automatic Payment Tiers */}
              {isMonitoring && (
                <div className="mt-4 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-mono text-green-400 mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-green-400" />
                      <strong>🚀 Automatic Premium Activation</strong>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-xs">
                      LIVE
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    {getPaymentTiers().map((tier, index) => (
                      <div key={index} className="flex justify-between p-2 bg-background/30 rounded border border-green-500/20">
                        <span className="text-green-300">${tier.minAmount}+ USD:</span>
                        <span className="text-green-400 font-semibold">{tier.description}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-green-300 mt-3 p-2 bg-background/20 rounded border-l-2 border-green-500">
                    💡 <strong>Send ETH to our wallet and get instant premium activation!</strong> 
                    <span className="block mt-1 text-green-400">
                      Received: <span className="text-accent font-bold">∞</span> automatic payments detected
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-muted border border-border rounded">
                <div className="text-sm font-mono text-muted-foreground">
                  <Gift size={16} className="inline mr-2" />
                  <strong>Note:</strong> EVM wallet has automatic payment detection for instant premium activation. 
                  Other networks (Solana, Bitcoin, Bitcoin Cash) are for payments and future tier tracking.
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Why Choose Degen */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">WHY CHOOSE {settings.website_name?.toUpperCase() || 'NUMORAQ'} DEGEN?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🚀 ADVANCED FEATURES</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Access AI-powered insights, advanced analytics, degen themes, and cutting-edge financial tools.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">💰 PROFESSIONAL GRADE</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Built for serious wealth builders with enterprise-level infrastructure and reliability.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🔒 PRIVACY FIRST</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    We don't sell your data. Degen subscriptions keep us independent and user-focused.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🌟 CONTINUOUS INNOVATION</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Degen users get early access to new features and direct input on product development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage; 