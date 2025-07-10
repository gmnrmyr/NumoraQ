import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Heart, Zap, Star, Gift, Copy, Check, Info, Twitter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import { UnifiedPaymentFlow, type PaymentTier } from '@/components/payment/UnifiedPaymentFlow';
import { useCMSSettings } from '@/hooks/useCMSSettings';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTranslation } from '@/contexts/TranslationContext';
import { toast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const { settings, loading } = useCMSSettings();
  const { refetch: refetchPremiumStatus } = usePremiumStatus();
  const { t } = useTranslation();
  const [copiedWallet, setCopiedWallet] = React.useState<string>('');

  // Degen plans configuration
  const degenPlans: PaymentTier[] = [
    {
      id: '1month',
      name: 'Monthly Premium',
      price: 9.99,
      description: 'Monthly degen access',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support'],
      type: 'degen'
    },
    {
      id: '3months',
      name: '3 Month Premium',
      price: 24.99,
      description: '3 month degen access',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '17% savings'],
      type: 'degen'
    },
    {
      id: '6months',
      name: '6 Month Premium',
      price: 44.99,
      description: '6 month degen access',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '25% savings'],
      popular: true,
      type: 'degen'
    },
    {
      id: '1year',
      name: 'Yearly Premium',
      price: 79.99,
      description: 'Yearly degen access',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '33% savings'],
      type: 'degen'
    },
    {
      id: 'lifetime',
      name: 'Lifetime Premium',
      price: 299,
      description: 'Lifetime degen access',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', 'All future features', 'Founder badge'],
      type: 'degen'
    }
  ];

  // Handle payment success from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const canceled = urlParams.get('canceled');

    if (success === 'true' && sessionId) {
      toast({
        title: t.paymentSuccessful,
        description: t.welcomeToDegenClub,
      });
      refetchPremiumStatus();
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (canceled === 'true') {
      toast({
        title: t.paymentCancelled,
        description: t.paymentCancelledDescription,
        variant: "destructive"
      });
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [refetchPremiumStatus]);

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
              <div className="animate-pulse">{t.loadingPaymentInfo}</div>
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
                  <Crown className="text-accent" size={20} />
                  <div>
                    <div className="font-mono text-sm text-accent font-bold">{t.currentlyOnPayments}</div>
                    <div className="text-xs text-muted-foreground font-mono">Premium access & degen plans</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/donation'}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono"
                >
                  <Heart size={14} className="mr-2" />
                  {t.switchToDonations}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-accent uppercase tracking-wider">
              {t.degenPlansPremiumAccess}
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              {t.purchasePremiumAccess}
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <Crown className="text-accent" size={24} />
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>

          {/* Premium Access Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Crown className="text-accent mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-accent">{t.premiumAccessNotice}</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    {t.premiumAccessDescription}
                  </p>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-sm font-mono text-blue-600">
                      💙 <strong>{t.simpleFlow.split(':')[0]}:</strong> {t.simpleFlow.split(':')[1]}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded mt-3">
                    <p className="text-sm font-mono text-green-600">
                      ✅ <strong>{t.stripeIntegrationActive.split(':')[0]}:</strong> {t.stripeIntegrationActive.split(':')[1]}
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

          {/* Unified Payment Flow for Degen Plans */}
          <UnifiedPaymentFlow 
            tiers={degenPlans}
            flowType="degen"
            onPaymentComplete={(tier, method) => {
              toast({
                title: "Payment Initiated!",
                description: `Processing ${tier.name} payment via ${method}`,
              });
            }}
          />



          {/* Alternative Payment Methods */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-accent">
                🔄 ALTERNATIVE PAYMENT METHODS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded bg-card/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💳</span>
                    <span className="font-mono font-bold text-foreground">Stripe (Primary)</span>
                    <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mb-2">
                    Secure credit card payments with automatic premium activation
                  </div>
                  <p className="text-xs text-green-400 font-mono">
                    ✅ Recommended payment method
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🌟</span>
                    <span className="font-mono font-bold text-foreground">Solana</span>
                    <Badge variant="outline" className="text-xs text-orange-400 border-orange-400">
                      Coming Soon
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mb-2">
                    Direct SOL payments for premium access
                  </div>
                  <p className="text-xs text-orange-400 font-mono">
                    🚧 In development
                  </p>
                </div>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-xs font-mono text-blue-400">
                  💡 <strong>Need help?</strong> Contact us at numoraq@gmail.com for payment support
                </p>
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