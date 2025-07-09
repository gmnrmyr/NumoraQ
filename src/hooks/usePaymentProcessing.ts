import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export type PaymentMethod = 'stripe' | 'paypal' | 'crypto';
export type SubscriptionPlan = '1month' | '3months' | '6months' | '1year' | '5years' | 'lifetime';

export interface PaymentSession {
  id: string;
  method: PaymentMethod;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  expires_at: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  features: string[];
  popular?: boolean;
  description: string;
}

export const usePaymentProcessing = () => {
  const { user } = useAuth();
  const { refetch: refetchPremiumStatus } = usePremiumStatus();
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<PaymentSession | null>(null);

  // Available subscription plans
  const subscriptionPlans: Record<SubscriptionPlan, SubscriptionInfo> = {
    '1month': {
      plan: '1month',
      amount: 9.99,
      currency: 'USD',
      description: 'Monthly Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support']
    },
    '3months': {
      plan: '3months',
      amount: 24.99,
      currency: 'USD',
      description: '3 Month Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '17% savings']
    },
    '6months': {
      plan: '6months',
      amount: 44.99,
      currency: 'USD',
      description: '6 Month Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '25% savings'],
      popular: true
    },
    '1year': {
      plan: '1year',
      amount: 79.99,
      currency: 'USD',
      description: 'Yearly Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '33% savings']
    },
    '5years': {
      plan: '5years',
      amount: 199,
      currency: 'USD',
      description: '5 Year Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', '50% savings', 'Exclusive features']
    },
    'lifetime': {
      plan: 'lifetime',
      amount: 299,
      currency: 'USD',
      description: 'Lifetime Premium',
      features: ['Ad-free experience', 'Premium themes', 'Advanced analytics', 'Priority support', 'All future features', 'Founder badge', 'Early access']
    }
  };

  const createPaymentSession = useCallback(async (
    plan: SubscriptionPlan,
    method: PaymentMethod,
    metadata?: Record<string, any>
  ): Promise<PaymentSession | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    
    try {
      const planInfo = subscriptionPlans[plan];
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const session: PaymentSession = {
        id: sessionId,
        method,
        plan,
        amount: planInfo.amount,
        currency: planInfo.currency,
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        metadata: {
          user_id: user.id,
          user_email: user.email,
          ...metadata
        }
      };

      // Store session in database
      const { error } = await supabase
        .from('payment_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          payment_method: method,
          subscription_plan: plan,
          amount: planInfo.amount,
          currency: planInfo.currency,
          status: 'pending',
          expires_at: session.expires_at,
          metadata: session.metadata
        });

      if (error) throw error;

      setCurrentSession(session);
      
      toast({
        title: "Payment Session Created",
        description: `${method.charAt(0).toUpperCase() + method.slice(1)} payment session created for ${planInfo.description}`,
      });

      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Payment Session Failed",
        description: "Could not create payment session. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const processStripePayment = useCallback(async (sessionId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Get the current session details
      const { data: sessionData, error: sessionError } = await supabase
        .from('payment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        throw new Error('Payment session not found');
      }

      // Call the Stripe Edge Function to create checkout session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          plan: sessionData.subscription_plan,
          userEmail: user?.email,
          userId: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
      return true;
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment could not be processed. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const processPayPalPayment = useCallback(async (sessionId: string): Promise<boolean> => {
    // In a real implementation, this would integrate with PayPal
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update session status
      const { error } = await supabase
        .from('payment_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      if (error) throw error;

      await activatePremiumAccess(sessionId);
      
      toast({
        title: "PayPal Payment Successful! 🎉",
        description: "Your premium access has been activated",
      });

      return true;
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment Failed",
        description: "PayPal payment could not be processed. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const processCryptoPayment = useCallback(async (sessionId: string, transactionHash: string): Promise<boolean> => {
    // In a real implementation, this would verify the crypto transaction
    setLoading(true);
    
    try {
      // Simulate transaction verification
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update session status
      const { error } = await supabase
        .from('payment_sessions')
        .update({ 
          status: 'completed',
          metadata: { transaction_hash: transactionHash }
        })
        .eq('id', sessionId);

      if (error) throw error;

      await activatePremiumAccess(sessionId);
      
      toast({
        title: "Crypto Payment Verified! 🎉",
        description: "Your premium access has been activated",
      });

      return true;
    } catch (error) {
      console.error('Crypto payment error:', error);
      toast({
        title: "Payment Verification Failed",
        description: "Could not verify crypto payment. Please contact support.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const activatePremiumAccess = useCallback(async (sessionId: string) => {
    try {
      // Get payment session details
      const { data: session, error: sessionError } = await supabase
        .from('payment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Calculate expiry date based on plan
      const now = new Date();
      let expiresAt: Date | null = null;
      
      switch (session.subscription_plan) {
        case '1month':
          expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          break;
        case '3months':
          expiresAt = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
          break;
        case '6months':
          expiresAt = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
          break;
        case '1year':
          expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          break;
        case '5years':
          expiresAt = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
          break;
        case 'lifetime':
          expiresAt = new Date(2099, 11, 31);
          break;
      }

      // Update user premium status
      const { error: statusError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: session.user_id,
          is_premium: true,
          premium_type: session.subscription_plan,
          activated_at: now.toISOString(),
          expires_at: expiresAt?.toISOString(),
          payment_session_id: sessionId
        });

      if (statusError) throw statusError;

      // Refresh premium status
      await refetchPremiumStatus();
      
    } catch (error) {
      console.error('Error activating premium access:', error);
      throw error;
    }
  }, [refetchPremiumStatus]);

  const cancelPaymentSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('payment_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      setCurrentSession(null);
      
      toast({
        title: "Payment Cancelled",
        description: "Payment session has been cancelled",
      });
    } catch (error) {
      console.error('Error cancelling payment session:', error);
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel payment session",
        variant: "destructive"
      });
    }
  }, []);

  const getPaymentMethods = useCallback((): PaymentMethod[] => {
    // Return available payment methods based on configuration
    const methods: PaymentMethod[] = ['stripe'];
    
    // Add PayPal if enabled (for future implementation)
    if (import.meta.env.VITE_PAYPAL_ENABLED === 'true') {
      methods.push('paypal');
    }
    
    // Add crypto if enabled (for future implementation)
    if (import.meta.env.VITE_CRYPTO_PAYMENTS_ENABLED === 'true') {
      methods.push('crypto');
    }
    
    return methods;
  }, []);

  return {
    subscriptionPlans,
    currentSession,
    loading,
    createPaymentSession,
    processStripePayment,
    processPayPalPayment,
    processCryptoPayment,
    cancelPaymentSession,
    getPaymentMethods
  };
}; 