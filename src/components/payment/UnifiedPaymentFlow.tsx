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
      name: 'Credit Card (Stripe)',
      icon: <CreditCard size={16} />,
      status: 'active',
      description: 'Secure credit card payments with automatic activation'
    },
    {
      id: 'solana',
      name: 'Solana Wallet',
      icon: <Zap size={16} />,
      status: 'coming-soon',
      description: 'Direct SOL payments for instant activation'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet size={16} />,
      status: 'coming-soon',
      description: 'PayPal account payments'
    },
    {
      id: 'evm-direct',
      name: 'EVM Direct Transfer',
      icon: <Wallet size={16} />,
      status: 'active',
      description: 'Send ETH/BSC directly to our wallet'
    },
    {
      id: 'evm-wallet',
      name: 'EVM Wallet Connect',
      icon: <Wallet size={16} />,
      status: 'coming-soon',
      description: 'Connect MetaMask or other EVM wallets'
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
          title: "Coming Soon",
          description: `${method.name} will be available soon!`,
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
              title: "Manual Payment Required",
              description: "Please send payment to our wallet and contact us for activation",
            });
          }
          break;

        case 'evm-direct':
          // Show wallet address for manual transfer
          toast({
            title: "Manual Transfer",
            description: "Please send the exact amount to our EVM wallet and contact us",
          });
          break;

        default:
          toast({
            title: "Coming Soon",
            description: "This payment method will be available soon!",
            variant: "destructive"
          });
      }

      onPaymentComplete?.(selectedTier, selectedMethod);
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Payment could not be processed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white text-xs">Active</Badge>;
      case 'coming-soon':
        return <Badge className="bg-orange-500 text-white text-xs">Coming Soon</Badge>;
      case 'disabled':
        return <Badge className="bg-gray-500 text-white text-xs">Disabled</Badge>;
      default:
        return null;
    }
  };

  const getFlowIcon = () => {
    return flowType === 'degen' ? <Crown size={20} /> : <Heart size={20} />;
  };

  const getFlowTitle = () => {
    return flowType === 'degen' ? 'Degen Plans' : 'Donation Tiers';
  };

  const getShortName = (fullName: string) => {
    const shortNames: { [key: string]: string } = {
      'Credit Card (Stripe)': 'Stripe',
      'Solana Wallet': 'Solana',
      'PayPal': 'PayPal',
      'EVM Direct Transfer': 'EVM Direct',
      'EVM Wallet Connect': 'EVM Connect'
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
                 <span className="font-mono text-sm text-muted-foreground">Current Status:</span>
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
                         DEGEN: No
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
                 {flowType === 'degen' ? 'Payment Status' : 'Donation Status'}
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
                   ? 'Choose your degen plan to unlock premium features and ad-free experience'
                   : 'Support the platform and earn exclusive donor badges'
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
             {flowType === 'degen' ? 'SELECT DEGEN PLAN' : 'SELECT DONATION TIER'}
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
                           Popular
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
         <Card className="border-2 border-border">
           <CardContent className="space-y-8 pt-6">
             <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
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
                 <TabsContent key={method.id} value={method.id}>
                   <div className="space-y-8">
                     <div className="flex items-center justify-end mb-4">
                       {getStatusBadge(method.status)}
                     </div>
                     
                     <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                       {method.description}
                     </p>

                     {method.status === 'coming-soon' && (
                       <Alert className="bg-orange-500/10 border-orange-500/20">
                         <AlertCircle className="h-4 w-4 text-orange-500" />
                         <AlertDescription className="text-orange-400 font-mono text-sm">
                           This payment method is coming soon. Please choose another option.
                         </AlertDescription>
                       </Alert>
                     )}

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
                               Processing...
                             </>
                           ) : (
                             <>
                               {flowType === 'degen' ? <Crown size={18} className="mr-3" /> : <Heart size={18} className="mr-3" />}
                               {flowType === 'degen' ? 'Activate Degen Plan' : 'Complete Donation'}
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

             {/* Instructions */}
       <Card className="border-2 border-border bg-muted/30">
         <CardContent className="pt-8 pb-8">
           <div className="text-sm text-muted-foreground font-mono space-y-3">
             <div className="font-bold text-foreground mb-4">How it works:</div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
               <span>Select your preferred {flowType === 'degen' ? 'degen plan' : 'donation tier'} above</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
               <span>Choose your preferred payment method</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
               <span>Complete the payment process</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
               <span>{flowType === 'degen' ? 'Premium features will be activated automatically' : 'Donor badge will be applied to your profile'}</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">5</div>
               <span>Contact support if you need help: <span className="text-accent underline">numoraq@gmail.com</span></span>
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
  );
}; 