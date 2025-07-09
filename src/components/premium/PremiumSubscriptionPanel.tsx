import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePaymentProcessing, type PaymentMethod, type SubscriptionPlan } from '@/hooks/usePaymentProcessing';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  Zap, 
  CreditCard, 
  DollarSign, 
  Bitcoin, 
  Check, 
  Star,
  Clock,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PremiumSubscriptionPanel = () => {
  const { user } = useAuth();
  const { isPremiumUser } = usePremiumStatus();
  const { 
    subscriptionPlans, 
    currentSession, 
    loading, 
    createPaymentSession,
    processStripePayment,
    processPayPalPayment,
    processCryptoPayment,
    cancelPaymentSession,
    getPaymentMethods
  } = usePaymentProcessing();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('6months');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('stripe');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cryptoTransactionHash, setCryptoTransactionHash] = useState('');

  const availablePaymentMethods = getPaymentMethods();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to degen",
        variant: "destructive"
      });
      return;
    }

    if (isPremiumUser) {
      toast({
        title: "Already Degen",
        description: "You already have degen access",
        variant: "destructive"
      });
      return;
    }

    const session = await createPaymentSession(selectedPlan, selectedPaymentMethod);
    if (session) {
      setShowPaymentDialog(true);
    }
  };

  const handlePayment = async () => {
    if (!currentSession) return;

    let success = false;
    
    switch (selectedPaymentMethod) {
      case 'stripe':
        success = await processStripePayment(currentSession.id);
        break;
      case 'paypal':
        success = await processPayPalPayment(currentSession.id);
        break;
      case 'crypto':
        if (!cryptoTransactionHash.trim()) {
          toast({
            title: "Transaction Hash Required",
            description: "Please enter the transaction hash",
            variant: "destructive"
          });
          return;
        }
        success = await processCryptoPayment(currentSession.id, cryptoTransactionHash);
        break;
    }

    if (success) {
      setShowPaymentDialog(false);
      setCryptoTransactionHash('');
    }
  };

  const handleCancelPayment = async () => {
    if (currentSession) {
      await cancelPaymentSession(currentSession.id);
    }
    setShowPaymentDialog(false);
    setCryptoTransactionHash('');
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'stripe':
        return <CreditCard size={16} />;
      case 'paypal':
        return <DollarSign size={16} />;
      case 'crypto':
        return <Bitcoin size={16} />;
      default:
        return <CreditCard size={16} />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'stripe':
        return 'Credit Card (Stripe)';
      case 'paypal':
        return 'PayPal';
      case 'crypto':
        return 'Cryptocurrency';
      default:
        return method;
    }
  };

  const getPlanSavings = (plan: SubscriptionPlan) => {
    const monthlyPrice = subscriptionPlans['1month'].amount;
    const planInfo = subscriptionPlans[plan];
    
    let months = 1;
    switch (plan) {
      case '3months': months = 3; break;
      case '6months': months = 6; break;
      case '1year': months = 12; break;
      case '5years': months = 60; break;
      case 'lifetime': months = 120; break; // Assuming 10 years value
    }
    
    const regularPrice = monthlyPrice * months;
    const savings = regularPrice - planInfo.amount;
    const percentage = Math.round((savings / regularPrice) * 100);
    
    return { savings, percentage, months };
  };

  if (isPremiumUser) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Crown size={20} />
            Degen Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-green-600 text-white">
                <Zap size={12} className="mr-1" />
                DEGEN USER
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                You have access to all degen features
              </p>
            </div>
            <Shield size={48} className="text-green-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Crown size={20} />
            Upgrade to Degen
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Unlock all features and support development
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subscriptionPlans).map(([planKey, planInfo]) => {
              const plan = planKey as SubscriptionPlan;
              const { savings, percentage } = getPlanSavings(plan);
              const isSelected = selectedPlan === plan;
              
              return (
                <Card 
                  key={plan}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border hover:border-accent/50'
                  } ${planInfo.popular ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{planInfo.description}</CardTitle>
                      {planInfo.popular && (
                        <Badge className="bg-accent text-accent-foreground">
                          <Star size={12} className="mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-accent">
                      ${planInfo.amount}
                      {plan !== 'lifetime' && (
                        <span className="text-sm text-muted-foreground">
                          /{plan.replace(/\d+/, '')}
                        </span>
                      )}
                    </div>
                    {percentage > 0 && (
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Save {percentage}%
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {planInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check size={14} className="text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-sm font-mono">Payment Method</Label>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value: PaymentMethod) => setSelectedPaymentMethod(value)}
                className="mt-2"
              >
                {availablePaymentMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem value={method} id={method} />
                    <Label htmlFor={method} className="flex items-center gap-2 cursor-pointer">
                      {getPaymentMethodIcon(method)}
                      {getPaymentMethodName(method)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Clock size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown size={16} className="mr-2" />
                  Subscribe to Degen
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-mono">Complete Payment</DialogTitle>
          </DialogHeader>
          
          {currentSession && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Plan:</span>
                    <p className="font-mono">{subscriptionPlans[currentSession.plan].description}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-mono">${currentSession.amount} {currentSession.currency}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <p className="font-mono flex items-center gap-2">
                      {getPaymentMethodIcon(currentSession.method)}
                      {getPaymentMethodName(currentSession.method)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="ml-2">
                      {currentSession.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedPaymentMethod === 'crypto' && (
                <div>
                  <Label htmlFor="txHash" className="text-sm">
                    Transaction Hash
                  </Label>
                  <Input
                    id="txHash"
                    placeholder="Enter transaction hash after payment"
                    value={cryptoTransactionHash}
                    onChange={(e) => setCryptoTransactionHash(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Send payment to the wallet address and enter the transaction hash here
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Clock size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelPayment}
                  variant="outline"
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 