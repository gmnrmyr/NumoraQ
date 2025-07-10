import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Heart, Zap, Star, Gift, Copy, Check, Info, Twitter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UnifiedPaymentFlow, type PaymentTier } from '@/components/payment/UnifiedPaymentFlow';
import { useCMSSettings } from '@/hooks/useCMSSettings';
import { useCryptoPaymentMonitor } from '@/hooks/useCryptoPaymentMonitor';
import { useTranslation } from '@/contexts/TranslationContext';
import { toast } from '@/hooks/use-toast';

const DonationPage = () => {
  const { settings, loading } = useCMSSettings();
  const { isMonitoring, getWalletAddress, getPaymentTiers } = useCryptoPaymentMonitor();
  const { t } = useTranslation();
  const [copiedWallet, setCopiedWallet] = React.useState<string>('');

  // Donation tiers configuration
  const donationTiers: PaymentTier[] = [
    {
      id: 'whale',
      name: 'Whale',
      price: 50000,
      description: 'Ultra VIP access',
      features: ['Exclusive Whale Badge', 'Ultra VIP Access', 'All Degen Features', 'Direct Developer Contact'],
      type: 'donation'
    },
    {
      id: 'legend',
      name: 'Legend',
      price: 10000,
      description: 'Priority support',
      features: ['Exclusive Legend Badge', 'Priority Support', 'All Degen Features'],
      type: 'donation'
    },
    {
      id: 'patron',
      name: 'Patron',
      price: 5000,
      description: 'Advanced features',
      features: ['Patron Badge', 'Degen Themes', 'Advanced Features'],
      type: 'donation'
    },
    {
      id: 'champion',
      name: 'Champion',
      price: 2000,
      description: 'Black hole animation',
      features: ['Champion Badge', 'Black Hole Animation', 'Degen Themes'],
      type: 'donation'
    },
    {
      id: 'supporter',
      name: 'Supporter',
      price: 1000,
      description: 'Degen access',
      features: ['Supporter Badge', 'Degen Access'],
      type: 'donation'
    },
    {
      id: 'backer',
      name: 'Backer',
      price: 500,
      description: 'Special recognition',
      features: ['Backer Badge', 'Special Recognition'],
      type: 'donation'
    },
    {
      id: 'donor',
      name: 'Donor',
      price: 100,
      description: 'Thank you message',
      features: ['Donor Badge', 'Thank You Message'],
      type: 'donation'
    },
    {
      id: 'contributor',
      name: 'Contributor',
      price: 50,
      description: 'Contributor badge',
      features: ['Contributor Badge'],
      type: 'donation'
    },
    {
      id: 'helper',
      name: 'Helper',
      price: 25,
      description: 'Helper badge',
      features: ['Helper Badge'],
      type: 'donation'
    },
    {
      id: 'friend',
      name: 'Friend',
      price: 20,
      description: 'Friend badge',
      features: ['Friend Badge'],
      type: 'donation'
    },
    {
      id: 'supporter-basic',
      name: 'Supporter',
      price: 10,
      description: 'Basic supporter badge',
      features: ['Basic Supporter Badge'],
      type: 'donation'
    },
    {
      id: 'newcomer',
      name: 'Newcomer',
      price: 0,
      description: 'Welcome badge',
      features: ['Welcome Badge', '1 point daily login'],
      type: 'donation'
    }
  ];

  const copyWallet = (wallet: string, type: string) => {
    navigator.clipboard.writeText(wallet);
    setCopiedWallet(type);
    setTimeout(() => setCopiedWallet(''), 2000);
    toast({
      title: t.copied,
      description: `${type} ${t.walletAddressCopied}`
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
      description: 'Active - Tracks donation tiers'
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
              <div className="animate-pulse">{t.loadingDonationInfo}</div>
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
          {/* Navigation between payment pages */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-accent" size={20} />
                  <div>
                    <div className="font-mono text-sm text-accent font-bold">{t.currentlyOnDonations}</div>
                    <div className="text-xs text-muted-foreground font-mono">Support platform & donor badges</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/payment'}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono"
                >
                  <Crown size={14} className="mr-2" />
                  {t.switchToPayments}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-accent uppercase tracking-wider">
              {t.supportDonorBadges}
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              {t.supportPlatformDevelopment}
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <Heart className="text-accent" size={24} />
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>

          {/* Donation Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Heart className="text-accent mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-accent">PLATFORM SUPPORT - DONOR BADGES</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Support Numoraq development and earn exclusive donor badges. This is separate from premium access - for degen plans, visit the <a href="/payment" className="text-accent underline">payment page</a>.
                  </p>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-sm font-mono text-blue-600">
                      💙 <strong>Simple Flow:</strong> Choose your donation tier → Select payment method → Complete donation → Get donor badge
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded mt-3">
                    <p className="text-sm font-mono text-blue-600">
                      💙 <strong>Support Development:</strong> Your donations help us build better features and maintain the platform
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





          {/* Unified Payment Flow for Donation Tiers */}
          <UnifiedPaymentFlow 
            tiers={donationTiers}
            flowType="donation"
            onPaymentComplete={(tier, method) => {
              toast({
                title: "Donation Initiated!",
                description: `Processing ${tier.name} donation via ${method}`,
              });
            }}
          />

          {/* Advanced Crypto Options - Collapsible */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                💰 ADVANCED CRYPTO OPTIONS
                {isMonitoring && (
                  <Badge className="bg-green-600 text-white text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                    Auto-Detection Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-mono text-muted-foreground mb-4">
                Direct wallet transfers for advanced users. These methods are separate from the main payment flow above.
              </div>
              
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
                  Other networks (Solana, Bitcoin, Bitcoin Cash) are for donations and future tier tracking.
                </div>
              </div>
            </CardContent>
          </Card>





          {/* Why Support Us */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">WHY SUPPORT {settings.website_name?.toUpperCase() || 'NUMORAQ'}?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🚀 INDEPENDENT DEVELOPMENT</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Your donations keep us independent and focused on building the best financial platform possible.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">💰 TRANSPARENT FUNDING</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    All donations go directly to development costs, server maintenance, and new feature development.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🔒 NO ADS, NO TRACKING</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Donations help us maintain a clean, ad-free experience without selling your data.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🌟 EXCLUSIVE RECOGNITION</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Donors get exclusive badges, early access to features, and direct input on development priorities.
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

export default DonationPage;
