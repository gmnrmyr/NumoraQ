import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumCodes } from '@/hooks/usePremiumCodes';
import { toast } from '@/hooks/use-toast';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  code: string; // Premium code that gets auto-applied
}

const paymentPlans: PaymentPlan[] = [
  {
    id: 'degen-1m',
    name: 'Degen 1 Month',
    price: 9.99,
    duration: '1 Month',
    features: ['All Premium Features', 'Ad-Free Experience', 'Priority Support'],
    code: 'DEGEN1M'
  },
  {
    id: 'degen-3m',
    name: 'Degen 3 Months',
    price: 24.99,
    duration: '3 Months',
    features: ['All Premium Features', 'Ad-Free Experience', 'Priority Support', '17% Savings'],
    code: 'DEGEN3M'
  },
  {
    id: 'degen-6m',
    name: 'Degen 6 Months',
    price: 44.99,
    duration: '6 Months',
    features: ['All Premium Features', 'Ad-Free Experience', 'Priority Support', '25% Savings'],
    code: 'DEGEN6M'
  },
  {
    id: 'degen-1y',
    name: 'Degen 1 Year',
    price: 79.99,
    duration: '1 Year',
    features: ['All Premium Features', 'Ad-Free Experience', 'Priority Support', '33% Savings'],
    code: 'DEGEN1Y'
  },
  {
    id: 'degen-lifetime',
    name: 'Degen Lifetime',
    price: 299,
    duration: 'Lifetime',
    features: ['All Premium Features', 'Ad-Free Experience', 'Priority Support', 'Lifetime Access', 'Founder Badge'],
    code: 'DEGENLIFE'
  }
];

export const SimplePaymentProcessor = () => {
  const { user } = useAuth();
  const { activateCode } = usePremiumCodes();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'paypal' | 'stripe'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentEmail, setPaymentEmail] = useState('');

  const PROJECT_WALLETS = {
    bsc: '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD', // BSC/ETH
    usdc: '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD', // USDC on BSC
    usdt: '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD', // USDT on BSC
    paypal: 'numoraq@gmail.com'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2000);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handlePaymentComplete = async (plan: PaymentPlan) => {
    setIsProcessing(true);
    
    try {
      // Activate the premium code automatically
      const success = await activateCode(plan.code, user?.email);
      
      if (success) {
        toast({
          title: "Payment Complete!",
          description: `${plan.name} activated successfully! Premium features are now available.`,
        });
      } else {
        toast({
          title: "Activation Error",
          description: "Payment received but failed to activate premium. Please contact support.",
          variant: "destructive",
        });
      }
      
      // You can add webhook/confirmation logic here
      
    } catch (error) {
      toast({
        title: "Activation Error",
        description: "Payment received but failed to activate premium. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const CryptoPayment = ({ plan }: { plan: PaymentPlan }) => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="font-mono text-sm">
          Send exactly <strong>${plan.price} USD</strong> worth of crypto to activate {plan.name}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div className="p-4 border border-border rounded bg-card/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm">BSC/ETH Address:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(PROJECT_WALLETS.bsc, 'BSC Address')}
            >
              {copiedCode === 'BSC Address' ? <Check size={14} /> : <Copy size={14} />}
            </Button>
          </div>
          <code className="text-xs break-all bg-muted p-2 rounded block">
            {PROJECT_WALLETS.bsc}
          </code>
        </div>
        
        <div className="text-xs text-muted-foreground font-mono">
          <strong>Accepted Tokens:</strong> BNB, ETH, USDC, USDT on BSC network
        </div>
      </div>
      
      <Alert className="bg-yellow-500/10 border-yellow-500/20">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-400 font-mono text-sm">
          After payment, click "I've Sent Payment" below. Premium activation is usually instant but may take up to 24 hours.
        </AlertDescription>
      </Alert>
      
      <Button
        onClick={() => handlePaymentComplete(plan)}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Activating...' : 'I\'ve Sent Payment'}
      </Button>
    </div>
  );

  const PayPalPayment = ({ plan }: { plan: PaymentPlan }) => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="font-mono text-sm">
          Send <strong>${plan.price} USD</strong> via PayPal to activate {plan.name}
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border border-border rounded bg-card/50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-sm">PayPal Email:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(PROJECT_WALLETS.paypal, 'PayPal Email')}
          >
            {copiedCode === 'PayPal Email' ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
        <code className="text-xs bg-muted p-2 rounded block">
          {PROJECT_WALLETS.paypal}
        </code>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paypal-email">Your PayPal Email (for confirmation)</Label>
        <Input
          id="paypal-email"
          type="email"
          placeholder="your@email.com"
          value={paymentEmail}
          onChange={(e) => setPaymentEmail(e.target.value)}
          className="font-mono"
        />
      </div>
      
      <Alert className="bg-yellow-500/10 border-yellow-500/20">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-400 font-mono text-sm">
          Include your account email in PayPal notes for faster activation. Processing time: 1-24 hours.
        </AlertDescription>
      </Alert>
      
      <Button
        onClick={() => handlePaymentComplete(plan)}
        disabled={isProcessing || !paymentEmail}
        className="w-full"
      >
        {isProcessing ? 'Activating...' : 'I\'ve Sent PayPal Payment'}
      </Button>
    </div>
  );

  if (!user) {
    return (
      <Card className="border-2 border-border">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-mono font-bold mb-2">Login Required</h3>
              <p className="text-sm text-muted-foreground">
                Please log in to purchase premium plans
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="font-mono text-accent">
            🚀 CHOOSE YOUR DEGEN PLAN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer border-2 transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="font-mono text-sm flex items-center justify-between">
                    {plan.name}
                    {plan.id === 'degen-lifetime' && (
                      <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                        Best Value
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-2xl font-bold text-accent">${plan.price}</div>
                  <div className="text-xs text-muted-foreground">{plan.duration}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-xs font-mono text-muted-foreground">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      {selectedPlan && (
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="font-mono text-accent">
              💳 PAYMENT FOR {selectedPlan.name.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crypto">
                  <Wallet size={16} className="mr-2" />
                  Crypto
                </TabsTrigger>
                <TabsTrigger value="paypal">
                  <CreditCard size={16} className="mr-2" />
                  PayPal
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="crypto">
                <CryptoPayment plan={selectedPlan} />
              </TabsContent>
              
              <TabsContent value="paypal">
                <PayPalPayment plan={selectedPlan} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-2 border-border bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground font-mono space-y-2">
            <div><strong>How it works:</strong></div>
            <div>1. Select your preferred Degen plan above</div>
            <div>2. Choose crypto or PayPal payment method</div>
            <div>3. Send the exact amount to the provided address/email</div>
            <div>4. Click "I've Sent Payment" to activate premium features</div>
            <div>5. Premium code is automatically applied to your account</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 