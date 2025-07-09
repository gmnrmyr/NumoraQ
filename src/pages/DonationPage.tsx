import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Heart, Zap, Star, Gift, Copy, Check, Info, Twitter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DonationInterface } from '@/components/dashboard/DonationInterface';
import { ProductStateSection } from '@/components/donation/ProductStateSection';
import { useCMSSettings } from '@/hooks/useCMSSettings';
import { useCryptoPaymentMonitor } from '@/hooks/useCryptoPaymentMonitor';
import { toast } from '@/hooks/use-toast';

const DonationPage = () => {
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

  // Hardcoded title requirements for display
  const titleRequirements = [
    { title: 'WHALE', amount: '$50,000+', points: 50000, color: 'text-purple-600', features: ['Exclusive Whale Badge', 'Ultra VIP Access', 'All Degen Features', 'Direct Developer Contact'] },
    { title: 'LEGEND', amount: '$10,000+', points: 10000, color: 'text-purple-400', features: ['Exclusive Legend Badge', 'Priority Support', 'All Degen Features'] },
    { title: 'PATRON', amount: '$5,000+', points: 5000, color: 'text-yellow-400', features: ['Patron Badge', 'Degen Themes', 'Advanced Features'] },
    { title: 'CHAMPION', amount: '$2,000+', points: 2000, color: 'text-orange-400', features: ['Champion Badge', 'Black Hole Animation', 'Degen Themes'] },
    { title: 'SUPPORTER', amount: '$1,000+', points: 1000, color: 'text-blue-400', features: ['Supporter Badge', 'Degen Access'] },
    { title: 'BACKER', amount: '$500+', points: 500, color: 'text-green-400', features: ['Backer Badge', 'Special Recognition'] },
    { title: 'DONOR', amount: '$100+', points: 100, color: 'text-cyan-400', features: ['Donor Badge', 'Thank You Message'] },
    { title: 'CONTRIBUTOR', amount: '$50+', points: 50, color: 'text-indigo-400', features: ['Contributor Badge'] },
    { title: 'HELPER', amount: '$25+', points: 25, color: 'text-pink-400', features: ['Helper Badge'] },
    { title: 'FRIEND', amount: '$20+', points: 20, color: 'text-emerald-400', features: ['Friend Badge'] },
    { title: 'SUPPORTER', amount: '$10+', points: 10, color: 'text-lime-400', features: ['Basic Supporter Badge'] },
    { title: 'NEWCOMER', amount: '$0-9', points: 0, color: 'text-slate-400', features: ['Welcome Badge', '1 point daily login'] }
  ];

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
              <div className="animate-pulse">Loading donation information...</div>
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
              SUPPORT & DONOR BADGES
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              Support the platform and earn exclusive donor badges
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
                  <h3 className="font-mono font-bold text-accent">PLATFORM SUPPORT</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Support Numoraq development and earn exclusive donor badges. Your donations help us build better features and maintain the platform.
                  </p>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded mt-3">
                    <p className="text-sm font-mono text-orange-600">
                      ⚠️ <strong>Beta Status:</strong> Payments are in implementation. Feel free to send donations to our EVM address with a message to numoraq@gmail.com while in beta.
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

          {/* Crypto Wallets Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                💰 CRYPTO PAYMENTS & DONATIONS
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
                  Other networks (Solana, Bitcoin, Bitcoin Cash) are for donations and future tier tracking.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PayPal Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                💳 PAYPAL DONATIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-border rounded bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-foreground">PayPal Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="p-2 bg-muted rounded font-mono text-sm text-muted-foreground">
                      {settings.project_paypal_email}
                    </code>
                    <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono text-muted-foreground">
                  PayPal donations will be available soon and will enable tier tracking. Stay tuned for updates!
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation Interface */}
          <DonationInterface isOpen={false} onClose={() => {}} />

          {/* Product State Section - NEW */}
          <ProductStateSection />



          {/* Title Requirements */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                <Crown size={24} />
                DONOR RECOGNITION TIERS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {titleRequirements.map((tier, index) => (
                  <Card key={index} className="border border-border bg-card/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${tier.color} bg-transparent border font-mono`}>
                          {tier.title}
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">
                          {tier.points > 0 ? `${tier.points} pts` : '0-9 pts'}
                        </span>
                      </div>
                      <div className="text-xl font-bold font-mono text-accent">
                        {tier.amount}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {tier.features.map((feature, fIndex) => (
                          <li key={fIndex} className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                            <Star size={12} className="text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {tier.title === 'CHAMPION' && (
                        <div className="mt-2 p-2 bg-accent/10 border border-accent rounded">
                          <div className="text-xs font-mono text-accent flex items-center gap-1">
                            <Zap size={12} />
                            Unlocks Black Hole Animation
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted border border-border rounded">
                <div className="text-sm font-mono text-muted-foreground">
                  <Gift size={16} className="inline mr-2" />
                  <strong>Note:</strong> All donations directly support development and server costs. 
                  Titles are automatically assigned based on total donation amount and grant access to exclusive features.
                  Daily login rewards: 1 point per day.
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
