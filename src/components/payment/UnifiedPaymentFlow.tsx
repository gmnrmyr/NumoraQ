import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Wallet, 
  Zap, 
  Crown, 
  Heart, 
  Check, 
  Info, 
  AlertCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useTranslation } from '@/contexts/TranslationContext';
import { usePaymentProcessing, PaymentType } from '@/hooks/usePaymentProcessing';
import { toast } from '@/hooks/use-toast';

export interface PaymentTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  type: 'degen' | 'donation';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'coming-soon' | 'disabled';
  description: string;
}

interface UnifiedPaymentFlowProps {
  tiers: PaymentTier[];
  flowType: 'degen' | 'donation';
  onPaymentComplete?: (tier: PaymentTier, method: string) => void;
}

export const UnifiedPaymentFlow: React.FC<UnifiedPaymentFlowProps> = ({
  tiers,
  flowType,
  onPaymentComplete
}) => {
  const { user } = useAuth();
  const { isPremiumUser, premiumDetails } = usePremiumStatus();
  const { userTitle } = useUserTitle();
  const { t } = useTranslation();
  const { 
    loading, 
    createPaymentSession, 
    processStripePayment, 
    currentSession 
  } = usePaymentProcessing();
  
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get premium status display text
  const getPremiumStatusText = () => {
    if (!isPremiumUser || !premiumDetails) return 'Active';
    
    if (premiumDetails.type === 'lifetime') return 'Lifetime';
    if (premiumDetails.type === '1year') return '1 Year';
    if (premiumDetails.type === '5years') return '5 Years';
    if (premiumDetails.type === '6months') return '6 Months';
    if (premiumDetails.type === '3months') return '3 Months';
    if (premiumDetails.type === '1month') return '1 Month';
    
    return premiumDetails.type || 'Active';
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: t.creditCardStripe,
      icon: <CreditCard size={16} />,
      status: 'active',
      description: t.securePaymentProcessing
    },
    {
      id: 'pix',
      name: t.pix,
      icon: <Zap size={16} />,
      status: 'coming-soon',
      description: t.instantBrazilianPayments
    },
    {
      id: 'boleto',
      name: t.boleto,
      icon: <Wallet size={16} />,
      status: 'coming-soon',
      description: t.brazilianBankSlip
    },
    {
      id: 'solana',
      name: t.solanaWallet,
      icon: <Zap size={16} />,
      status: 'coming-soon',
      description: t.directSolPayments
    },
    {
      id: 'paypal',
      name: t.paypal,
      icon: <Wallet size={16} />,
      status: 'coming-soon',
      description: t.paypalAccountPayments
    },
    {
      id: 'evm-direct',
      name: t.evmDirectTransfer,
      icon: <Wallet size={16} />,
      status: 'active',
      description: t.sendEthBscDirectly
    },
    {
      id: 'evm-wallet',
      name: t.evmWalletConnect,
      icon: <Wallet size={16} />,
      status: 'coming-soon',
      description: t.connectMetamaskWallets
    }
  ];

  const handleTierSelect = (tier: PaymentTier) => {
    setSelectedTier(tier);
    setSelectedMethod('stripe'); // Default to Stripe
  };

  const handlePayment = async () => {
    if (!selectedTier || !user) return;

    setIsProcessing(true);

    try {
      const method = paymentMethods.find(m => m.id === selectedMethod);
      
      if (!method) {
        throw new Error('Invalid payment method');
      }

      if (method.status === 'coming-soon') {
        toast({
          title: t.comingSoon,
          description: `${method.name} ${t.willBeAvailableSoon}`,
          variant: "destructive"
        });
        return;
      }

      // Handle different payment methods
      switch (selectedMethod) {
        case 'stripe':
          // Create payment session and process Stripe payment
          const session = await createPaymentSession(
            selectedTier.id,
            'stripe',
            flowType as PaymentType
          );

          if (session) {
            const success = await processStripePayment(session.id, flowType as PaymentType);
            if (success) {
              onPaymentComplete?.(selectedTier, selectedMethod);
            }
          }
          break;

        case 'evm-direct':
          // Show wallet address for manual transfer
          toast({
            title: t.manualTransfer,
            description: t.sendExactAmountContact,
          });
          break;

        default:
          toast({
            title: t.comingSoon,
            description: t.thisPaymentMethodComingSoon,
            variant: "destructive"
          });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: t.paymentError,
        description: t.paymentCouldNotBeProcessed,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white text-xs">{t.paymentActive}</Badge>;
      case 'coming-soon':
        return <Badge className="bg-orange-500 text-white text-xs">{t.comingSoon}</Badge>;
      case 'disabled':
        return <Badge className="bg-gray-500 text-white text-xs">{t.disabled}</Badge>;
      default:
        return null;
    }
  };

  const getFlowIcon = () => {
    return flowType === 'degen' ? <Crown size={20} /> : <Heart size={20} />;
  };

  const getFlowTitle = () => {
    return flowType === 'degen' ? t.degenPlansPremiumAccess : t.supportDonorBadges;
  };

  const getShortName = (fullName: string) => {
    const words = fullName.split(' ');
    return words.length > 1 ? words.slice(0, 2).join(' ') : fullName;
  };

  return (
    <div className="space-y-6">
      {/* User Status */}
      {user && (
        <Card className="border-2 border-border bg-muted/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">{t.currentStatus}</span>
                {flowType === 'degen' ? (
                  // Payment page - show degen status
                  <>
                    {isPremiumUser ? (
                      <>
                        <Badge className="bg-green-600 text-white font-mono">
                          <Crown size={12} className="mr-1" />
                          DEGEN: {getPremiumStatusText()}
                        </Badge>
                      </>
                    ) : (
                      <Badge className="bg-orange-600 text-white font-mono">
                        <Crown size={12} className="mr-1" />
                        {t.degenNo}
                      </Badge>
                    )}
                  </>
                ) : (
                  // Donation page - show tier and points
                  <>
                    <Badge className={`${userTitle.color} bg-transparent border font-mono`}>
                      {userTitle.title}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      {userTitle.level} points
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {flowType === 'degen' ? t.paymentStatus : t.donationStatus}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Header */}
      <Card className="border-2 border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-mono text-accent">
            {getFlowIcon()}
            {getFlowTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedTier?.id === tier.id 
                    ? 'border-accent bg-accent/20 ring-2 ring-accent/50 shadow-lg' 
                    : 'border-border hover:border-accent/50 hover:bg-accent/5'
                } ${tier.popular ? 'ring-2 ring-accent' : ''}`}
                onClick={() => handleTierSelect(tier)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {flowType === 'degen' ? <Crown size={16} /> : <Heart size={16} />}
                      <span className="font-mono font-semibold">{tier.name}</span>
                      {tier.popular && (
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          {t.popular}
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-accent">
                      ${tier.price}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-mono">
                    {tier.description}
                  </p>
                  
                  <ul className="text-xs space-y-1">
                    {tier.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check size={12} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                    {tier.features.length > 3 && (
                      <li className="text-muted-foreground">
                        +{tier.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                  
                  {selectedTier?.id === tier.id && (
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center ml-auto">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {selectedTier && (
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="font-mono text-accent">
              {t.selectPaymentMethod}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedMethod === method.id 
                      ? 'border-accent bg-accent/20 ring-2 ring-accent/50 shadow-lg' 
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  } ${method.status === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => method.status !== 'disabled' && setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <span className="font-mono text-sm font-semibold">
                          {getShortName(method.name)}
                        </span>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {method.description}
                    </div>
                    
                    <div className="flex justify-end">
                      {getStatusBadge(method.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Method Details */}
            {selectedMethod && (
              <div className="space-y-4">
                <div className="border-t border-border pt-6">
                  <h4 className="font-mono font-semibold text-foreground mb-4">
                    {t.paymentDetails}
                  </h4>
                  
                  {/* Selected Tier Summary */}
                  <div className="bg-muted/20 border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-mono font-semibold">{selectedTier.name}</h5>
                        <p className="text-sm text-muted-foreground">{selectedTier.description}</p>
                      </div>
                      <div className="text-2xl font-bold text-accent">
                        ${selectedTier.price}
                      </div>
                    </div>
                  </div>

                  {/* Selected Payment Method Info */}
                  {(() => {
                    const method = paymentMethods.find(m => m.id === selectedMethod);
                    if (!method) return null;
                    
                    return (
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          {method.icon}
                          <span className="font-mono font-semibold">{method.name}</span>
                          {getStatusBadge(method.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    );
                  })()}

                  {/* Action Button */}
                  {(() => {
                    const method = paymentMethods.find(m => m.id === selectedMethod);
                    if (!method) return null;
                    
                    if (method.status === 'coming-soon') {
                      return (
                        <Alert className="border-orange-500/20 bg-orange-500/5">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          <AlertDescription className="text-orange-400 font-mono">
                            {t.thisPaymentMethodComingSoon}
                          </AlertDescription>
                        </Alert>
                      );
                    }
                    
                    if (method.status === 'active') {
                      return (
                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing || !user}
                          className="w-full p-4 text-base font-mono"
                          size="lg"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              {t.processing}
                            </>
                          ) : (
                            <>
                              {flowType === 'degen' ? <Crown size={20} className="mr-3" /> : <Heart size={20} className="mr-3" />}
                              {flowType === 'degen' 
                                ? t.activateDegenPlan
                                : t.completeDonation
                              }
                            </>
                          )}
                        </Button>
                      );
                    }
                    
                    return null;
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 