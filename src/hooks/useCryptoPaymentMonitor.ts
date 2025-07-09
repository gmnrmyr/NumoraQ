import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { CryptoPaymentService } from '@/services/cryptoPaymentService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PaymentTier {
  minAmount: number; // in USD
  plan: string;
  description: string;
  durationMonths: number | null; // null for lifetime
}

export const useCryptoPaymentMonitor = () => {
  const { user } = useAuth();
  const { refetch: refetchPremiumStatus } = usePremiumStatus();
  const cryptoServiceRef = useRef<CryptoPaymentService>();
  const cleanupRef = useRef<(() => void) | null>(null);

  // Payment tiers based on USD amounts
  const paymentTiers: PaymentTier[] = [
    { minAmount: 9.99, plan: '1month', description: 'Monthly Degen', durationMonths: 1 },
    { minAmount: 24.99, plan: '3months', description: '3 Month Degen', durationMonths: 3 },
    { minAmount: 44.99, plan: '6months', description: '6 Month Degen', durationMonths: 6 },
    { minAmount: 79.99, plan: '1year', description: 'Yearly Degen', durationMonths: 12 },
    { minAmount: 299.99, plan: 'lifetime', description: 'Lifetime Degen', durationMonths: null }
  ];

  const determinePlanFromAmount = useCallback((usdAmount: number): PaymentTier | null => {
    // Find the highest tier that the payment qualifies for
    const qualifyingTiers = paymentTiers.filter(tier => usdAmount >= tier.minAmount);
    return qualifyingTiers.length > 0 ? qualifyingTiers[qualifyingTiers.length - 1] : null;
  }, []);

  const activatePremiumFromCrypto = useCallback(async (
    transactionHash: string,
    ethAmount: number,
    usdAmount: number,
    fromAddress: string
  ) => {
    if (!user) return;

    try {
      const tier = determinePlanFromAmount(usdAmount);
      if (!tier) {
        toast({
          title: "Payment Too Small",
          description: `Minimum payment is $${paymentTiers[0].minAmount} for premium access`,
          variant: "destructive"
        });
        return;
      }

      // Create a payment session record
      const sessionId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error: sessionError } = await supabase
        .from('payment_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          payment_method: 'crypto',
          subscription_plan: tier.plan,
          amount: usdAmount,
          currency: 'USD',
          status: 'completed',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          metadata: {
            transaction_hash: transactionHash,
            eth_amount: ethAmount,
            usd_amount: usdAmount,
            from_address: fromAddress,
            auto_detected: true
          }
        });

      if (sessionError) throw sessionError;

      // Calculate expiry date
      const now = new Date();
      let expiresAt: Date | null = null;
      
      if (tier.durationMonths) {
        expiresAt = new Date(now.getFullYear(), now.getMonth() + tier.durationMonths, now.getDate());
      } else {
        expiresAt = new Date(2099, 11, 31); // Lifetime
      }

      // Activate premium status
      const { error: statusError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: user.id,
          is_premium: true,
          premium_type: tier.plan,
          activated_at: now.toISOString(),
          expires_at: expiresAt?.toISOString(),
          payment_session_id: sessionId
        });

      if (statusError) throw statusError;

      // Refresh premium status
      await refetchPremiumStatus();

      toast({
        title: "🎉 Crypto Payment Detected!",
        description: `${tier.description} activated! Transaction: ${transactionHash.slice(0, 10)}...`,
        duration: 8000
      });

      console.log('Premium activated from crypto payment:', {
        tier: tier.description,
        amount: `${ethAmount} ETH ($${usdAmount.toFixed(2)})`,
        transaction: transactionHash
      });

    } catch (error) {
      console.error('Error activating premium from crypto:', error);
      toast({
        title: "Activation Error",
        description: "Payment detected but activation failed. Please contact support.",
        variant: "destructive"
      });
    }
  }, [user, determinePlanFromAmount, refetchPremiumStatus]);

  const handleNewPayments = useCallback(async (payments: any[]) => {
    if (!cryptoServiceRef.current) return;

    for (const payment of payments) {
      try {
        // Convert ETH to USD
        const usdAmount = await cryptoServiceRef.current.convertToUSD(payment.amount);
        
        await activatePremiumFromCrypto(
          payment.transactionHash,
          payment.amount,
          usdAmount,
          payment.fromAddress
        );
      } catch (error) {
        console.error('Error processing crypto payment:', error);
      }
    }
  }, [activatePremiumFromCrypto]);

  // Initialize crypto service and start monitoring
  useEffect(() => {
    if (!user) return;

    try {
      cryptoServiceRef.current = new CryptoPaymentService();
      
      // Start monitoring for payments every 30 seconds
      const cleanup = cryptoServiceRef.current.startMonitoring(handleNewPayments, 30000);
      cleanupRef.current = cleanup;

      console.log('Crypto payment monitoring started for user:', user.email);

      return () => {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing crypto payment monitor:', error);
    }
  }, [user, handleNewPayments]);

  // Manual transaction validation
  const validateTransaction = useCallback(async (txHash: string): Promise<boolean> => {
    if (!cryptoServiceRef.current || !user) return false;

    try {
      const payment = await cryptoServiceRef.current.validateTransactionHash(txHash);
      if (!payment) {
        toast({
          title: "Invalid Transaction",
          description: "Transaction not found or not to our wallet",
          variant: "destructive"
        });
        return false;
      }

      const usdAmount = await cryptoServiceRef.current.convertToUSD(payment.amount);
      
      await activatePremiumFromCrypto(
        payment.transactionHash,
        payment.amount,
        usdAmount,
        payment.fromAddress
      );

      return true;
    } catch (error) {
      console.error('Error validating transaction:', error);
      toast({
        title: "Validation Error",
        description: "Could not validate transaction. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, activatePremiumFromCrypto]);

  const getWalletAddress = useCallback((): string => {
    return cryptoServiceRef.current?.getWalletAddress() || '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD';
  }, []);

  const getPaymentTiers = useCallback(() => paymentTiers, []);

  return {
    validateTransaction,
    getWalletAddress,
    getPaymentTiers,
    isMonitoring: !!cleanupRef.current
  };
}; 