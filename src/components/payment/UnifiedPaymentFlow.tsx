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
  const [selectedTier, setSelectedTier] = useState<PaymentTier | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get premium status display text
  const getPremiumStatusText = () => {
    if (!isPremiumUser || !premiumDetails) return 'Active';
    
    if (premiumDetails.type === 'lifetime') return 'Lifetime';
    if (premiumDetails.type === '1year') return '1 Year';
    if (premiumDetails.type === '5years') return '5 Years';
    
    return premiumDetails.type || 'Active';
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: t.creditCardStripe,
      icon: <CreditCard size={16} />,
      status: 'active',
      description: t.secureCreditCardPayments
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
          // Redirect to Stripe payment
          if (flowType === 'degen') {
            // Use existing Stripe flow
            window.location.href = `/payment?plan=${selectedTier.id}`;
          } else {
            // For donations, show manual payment info
            toast({
              title: t.manualPaymentRequired,
              description: t.sendPaymentContactActivation,
            });
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

      onPaymentComplete?.(selectedTier, selectedMethod);
    } catch (error) {
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
        return <Badge className="bg-green-500 text-white text-xs">{t.active}</Badge>;
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
    return flowType === 'degen' ? t.selectDegenPlan : t.selectDonationTier;
  };

  const getShortName = (fullName: string) => {
    const shortNames: { [key: string]: string } = {
      [t.creditCardStripe]: 'Stripe',
      [t.solanaWallet]: 'Solana',
      [t.paypal]: 'PayPal',
      [t.evmDirectTransfer]: 'EVM Direct',
      [t.evmWalletConnect]: 'EVM Connect',
      [t.pix]: 'PIX',
      [t.boleto]: 'Boleto'
    };
    return shortNames[fullName] || fullName;
  };

     return (
     <div className="space-y-8">
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

       {/* Header */}
       <Card className="border-2 border-accent/30 bg-accent/5">
         <CardContent className="pt-6 pb-6">
           <div className="flex items-start gap-4">
             {getFlowIcon()}
             <div className="space-y-3">
               <h3 className="font-mono font-bold text-accent text-xl">{getFlowTitle()}</h3>
               <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                 {flowType === 'degen' 
                   ? t.chooseDegenPlan
                   : t.supportPlatformEarnBadges
                 }
               </p>
             </div>
           </div>
         </CardContent>
       </Card>

             {/* Tier Selection */}
       <Card className="border-2 border-border">
         <CardHeader className="pb-6">
           <CardTitle className="font-mono text-accent">
             {flowType === 'degen' ? t.selectDegenPlan : t.selectDonationTier}
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {tiers.map((tier) => (
               <Card 
                 key={tier.id}
                 className={`cursor-pointer transition-all ${
                   selectedTier?.id === tier.id 
                     ? 'border-accent bg-accent/20 ring-4 ring-accent shadow-xl scale-105' 
                     : 'border-border hover:border-accent/50 hover:bg-accent/5'
                 } ${tier.popular && selectedTier?.id !== tier.id ? 'ring-1 ring-accent/50' : ''}`}
                 onClick={() => handleTierSelect(tier)}
               >
                 <CardHeader className="pb-4">
                   <div className="flex items-center justify-between mb-3">
                     <CardTitle className="text-xl">{tier.name}</CardTitle>
                     <div className="flex items-center gap-2">
                       {selectedTier?.id === tier.id && (
                         <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                           <Check size={12} className="text-white" />
                         </div>
                       )}
                       {tier.popular && (
                         <Badge className="bg-accent text-accent-foreground">
                           {t.popular}
                         </Badge>
                       )}
                     </div>
                   </div>
                   <div className="text-3xl font-bold text-accent">
                     ${tier.price}
                   </div>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <ul className="space-y-3">
                     {tier.features.map((feature, index) => (
                       <li key={index} className="flex items-center gap-3 text-sm">
                         <Check size={16} className="text-green-400 flex-shrink-0" />
                         <span className="leading-relaxed">{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </CardContent>
               </Card>
             ))}
           </div>
         </CardContent>
       </Card>

             {/* Payment Method Selection */}
       {selectedTier && (
         <Card className="border-2 border-border bg-transparent">
           <CardContent className="space-y-8 pt-6">
             <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 mb-6 bg-transparent">
               {paymentMethods.map((method) => (
                 <TabsTrigger 
                   key={method.id} 
                   value={method.id}
                   disabled={method.status === 'disabled'}
                   className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:ring-4 data-[state=active]:ring-accent data-[state=active]:border-accent data-[state=active]:bg-accent/20 data-[state=active]:scale-105 data-[state=active]:shadow-lg"
                 >
                   {method.icon}
                   <span className="text-center leading-tight">{getShortName(method.name)}</span>
                 </TabsTrigger>
               ))}
             </TabsList>
               
               {paymentMethods.map((method) => (
                 <TabsContent key={method.id} value={method.id} className="bg-transparent">
                   <div className="space-y-8">
                     <div className="flex items-center justify-end">
                       {getStatusBadge(method.status)}
                     </div>

                     {method.status === 'active' && (
                       <div className="pt-2">
                         <Button
                           onClick={handlePayment}
                           disabled={isProcessing || !user}
                           className="w-full p-4 text-base font-mono"
                         >
                           {isProcessing ? (
                             <>
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                               {t.processing}
                             </>
                           ) : (
                             <>
                               {flowType === 'degen' ? <Crown size={18} className="mr-3" /> : <Heart size={18} className="mr-3" />}
                               {flowType === 'degen' ? t.activateDegenPlan : t.completeDonation}
                             </>
                           )}
                         </Button>
                       </div>
                     )}
                   </div>
                 </TabsContent>
               ))}
             </Tabs>
           </CardContent>
         </Card>
       )}

       {/* Coming Soon Alert - Moved outside tabs to avoid layout conflicts */}
       {selectedTier && paymentMethods.find(m => m.id === selectedMethod)?.status === 'coming-soon' && (
         <Card className="border-2 border-orange-500/20 bg-orange-500/5">
           <CardContent className="pt-4 pb-4">
             <div className="flex items-center gap-3">
               <AlertCircle className="h-5 w-5 text-orange-500" />
               <div className="text-orange-400 font-mono text-sm">
                 {t.thisPaymentMethodComingSoon}
               </div>
             </div>
           </CardContent>
         </Card>
       )}

             {/* Instructions */}
       <Card className="border-2 border-border bg-muted/30">
         <CardContent className="pt-8 pb-8">
           <div className="text-sm text-muted-foreground font-mono space-y-3">
             <div className="font-bold text-foreground mb-4">{t.howItWorks}</div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">{t.step1}</div>
               <span>{flowType === 'degen' ? t.selectPreferredPlan : t.selectPreferredTier}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">{t.step2}</div>
               <span>{t.choosePaymentMethod}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">{t.step3}</div>
               <span>{t.completePaymentProcess}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">{t.step4}</div>
               <span>{flowType === 'degen' ? t.premiumFeaturesActivated : t.donorBadgeApplied}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">{t.step5}</div>
               <span>{t.contactSupportHelp}</span>
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
  );
}; 