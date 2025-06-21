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
import { toast } from '@/hooks/use-toast';

const DonationPage = () => {
  const { settings, loading } = useCMSSettings();
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
    { title: 'WHALE', amount: '$50,000+', points: 50000, color: 'text-purple-600', features: ['Exclusive Whale Badge', 'Ultra VIP Access', 'All Premium Features', 'Direct Developer Contact'] },
    { title: 'LEGEND', amount: '$10,000+', points: 10000, color: 'text-purple-400', features: ['Exclusive Legend Badge', 'Priority Support', 'All Premium Features'] },
    { title: 'PATRON', amount: '$5,000+', points: 5000, color: 'text-yellow-400', features: ['Patron Badge', 'Premium Themes', 'Advanced Features'] },
    { title: 'CHAMPION', amount: '$2,000+', points: 2000, color: 'text-orange-400', features: ['Champion Badge', 'Black Hole Animation', 'Premium Themes'] },
    { title: 'SUPPORTER', amount: '$1,000+', points: 1000, color: 'text-blue-400', features: ['Supporter Badge', 'Premium Access'] },
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
              SUPPORT THE PROJECT
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              Help us build the future of financial tracking
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <Heart className="text-accent" size={24} />
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>

          {/* Auto Badge Assignment Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="text-accent mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-accent">AUTOMATIC BADGE ASSIGNMENT</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Donor badges are automatically assigned to your profile upon receiving donations. 
                    If you experience any issues with badge assignment, please contact us via{' '}
                    <Twitter className="inline mx-1" size={14} />
                    <span className="text-accent">Twitter</span> for assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crypto Wallets Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                💰 CRYPTO DONATIONS
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
              
              <div className="mt-4 p-3 bg-muted border border-border rounded">
                <div className="text-sm font-mono text-muted-foreground">
                  <Gift size={16} className="inline mr-2" />
                  <strong>Note:</strong> Currently, only the EVM wallet actively tracks donation tiers. 
                  Other networks (Solana, Bitcoin, Bitcoin Cash) will enable tier tracking in future updates.
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
              <CardTitle className="font-mono text-accent">WHY SUPPORT {settings.website_name?.toUpperCase() || 'OPEN FINDASH'}?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🚀 DEVELOPMENT</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Your support helps us build new features, improve performance, and maintain the platform.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">💰 SERVER COSTS</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Keep the lights on with reliable hosting, database infrastructure, and third-party services.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🔒 PRIVACY FIRST</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    We don't sell your data. Donations help us stay independent and user-focused.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-foreground">🌟 OPEN SOURCE</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Supporting an open-source project that benefits the entire community.
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
