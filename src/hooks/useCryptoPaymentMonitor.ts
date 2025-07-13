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
    { minAmount: 299, plan: 'lifetime', description: 'Lifetime Degen', durationMonths: null }
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

      // Get existing premium status to check for stacking (same logic as webhook)
      const { data: existingStatus, error: fetchError } = await supabase
        .from('user_premium_status')
        .select('expires_at, premium_type, is_premium')
        .eq('user_id', user.id)
        .single();

      console.log('Activating premium for tier:', tier.description);
      
      let startDate = new Date();
      
      // If user has existing active premium, extend from expiry date
      if (existingStatus && existingStatus.is_premium && existingStatus.expires_at) {
        const existingExpiry = new Date(existingStatus.expires_at);
        const now = new Date();
        
        // If existing plan hasn't expired yet, extend from expiry date
        if (existingExpiry > now) {
          startDate = existingExpiry;
          console.log(`Crypto payment: Extending existing premium plan from ${existingExpiry.toISOString()}`);
        } else {
          console.log('Crypto payment: Existing plan expired, starting fresh');
        }
      }
      
      // Calculate expiry date from start date
      let expiresAt: Date | null = null;
      
      if (tier.durationMonths) {
        expiresAt = new Date(startDate.getFullYear(), startDate.getMonth() + tier.durationMonths, startDate.getDate());
      } else {
        expiresAt = new Date(2099, 11, 31); // Lifetime
      }

      console.log(`Crypto premium activation: User ${user.id}, Plan: ${tier.plan}, Start: ${startDate.toISOString()}, Expires: ${expiresAt?.toISOString()}`);

      // Activate premium status with proper time stacking
      const { error: statusError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: user.id,
          is_premium: true,
          premium_type: tier.plan,
          activated_at: new Date().toISOString(), // When this specific purchase was made
          expires_at: expiresAt?.toISOString(),
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