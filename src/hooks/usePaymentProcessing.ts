import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export type PaymentMethod = 'stripe' | 'paypal' | 'crypto';
export type SubscriptionPlan = '1month' | '3months' | '6months' | '1year' | '5years' | 'lifetime';
export type PaymentType = 'degen' | 'donation';

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

export interface DonationTier {
  tier: string;
  amount: number;
  currency: string;
  description: string;
  points: number;
  features: string[];
}

export const usePaymentProcessing = () => {
  const { user } = useAuth();
  const { refetch: refetchPremiumStatus } = usePremiumStatus();
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<PaymentSession | null>(null);

  // Available subscription plans (Degen Plans)
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

  // Available donation tiers
  const donationTiers: Record<string, DonationTier> = {
    'whale': {
      tier: 'whale',
      amount: 50000,
      currency: 'USD',
      description: 'Ultra VIP access',
      points: 50000,
      features: ['Exclusive Whale Badge', 'Ultra VIP Access', 'All Degen Features', 'Direct Developer Contact']
    },
    'legend': {
      tier: 'legend',
      amount: 10000,
      currency: 'USD',
      description: 'Priority support',
      points: 10000,
      features: ['Exclusive Legend Badge', 'Priority Support', 'All Degen Features']
    },
    'patron': {
      tier: 'patron',
      amount: 5000,
      currency: 'USD',
      description: 'Advanced features',
      points: 5000,
      features: ['Patron Badge', 'Degen Themes', 'Advanced Features']
    },
    'champion': {
      tier: 'champion',
      amount: 2000,
      currency: 'USD',
      description: 'Black hole animation',
      points: 2000,
      features: ['Champion Badge', 'Black Hole Animation', 'Degen Themes']
    },
    'supporter': {
      tier: 'supporter',
      amount: 1000,
      currency: 'USD',
      description: 'Degen access',
      points: 1000,
      features: ['Supporter Badge', 'Degen Access']
    },
    'backer': {
      tier: 'backer',
      amount: 500,
      currency: 'USD',
      description: 'Special recognition',
      points: 500,
      features: ['Backer Badge', 'Special Recognition']
    },
    'donor': {
      tier: 'donor',
      amount: 100,
      currency: 'USD',
      description: 'Thank you message',
      points: 100,
      features: ['Donor Badge', 'Thank You Message']
    },
    'contributor': {
      tier: 'contributor',
      amount: 50,
      currency: 'USD',
      description: 'Contributor badge',
      points: 50,
      features: ['Contributor Badge']
    },
    'helper': {
      tier: 'helper',
      amount: 25,
      currency: 'USD',
      description: 'Helper badge',
      points: 25,
      features: ['Helper Badge']
    },
    'friend': {
      tier: 'friend',
      amount: 20,
      currency: 'USD',
      description: 'Friend badge',
      points: 20,
      features: ['Friend Badge']
    },
    'supporter-basic': {
      tier: 'supporter-basic',
      amount: 10,
      currency: 'USD',
      description: 'Basic supporter badge',
      points: 10,
      features: ['Basic Supporter Badge']
    },
    'newcomer': {
      tier: 'newcomer',
      amount: 0,
      currency: 'USD',
      description: 'Welcome badge',
      points: 0,
      features: ['Welcome Badge', '1 point daily login']
    }
  };

  const createPaymentSession = useCallback(async (
    plan: SubscriptionPlan | string,
    method: PaymentMethod,
    paymentType: PaymentType,
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
      let planInfo: SubscriptionInfo | DonationTier;
      let amount: number;
      let dbPlanName: string; // The name to store in database
      
      if (paymentType === 'degen') {
        planInfo = subscriptionPlans[plan as SubscriptionPlan];
        amount = planInfo.amount;
        dbPlanName = plan as string; // Use the actual plan name
      } else {
        planInfo = donationTiers[plan];
        amount = planInfo.amount;
        // For donations, use 'lifetime' as valid database value but store real tier in metadata
        dbPlanName = 'lifetime';
      }

      const sessionId = crypto.randomUUID();
      
      // Create payment session in database
      const { error: sessionError } = await supabase
        .from('payment_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          payment_method: method,
          subscription_plan: dbPlanName, // Use database-compatible name
          amount: amount,
          currency: 'USD',
          status: 'pending',
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          metadata: {
            payment_type: paymentType,
            user_email: user.email,
            actual_plan: plan, // Store the real plan/tier name here
            ...metadata
          }
        });

      if (sessionError) {
        throw sessionError;
      }

      const session: PaymentSession = {
        id: sessionId,
        method,
        plan: plan as SubscriptionPlan,
        amount,
        currency: 'USD',
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        metadata: {
          payment_type: paymentType,
          user_id: user.id,
          user_email: user.email,
          actual_plan: plan,
          ...metadata
        }
      };

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

  const processStripePayment = useCallback(async (sessionId: string, paymentType: PaymentType, session?: PaymentSession): Promise<boolean> => {
    setLoading(true);
    
    try {
      const sessionToUse = session || currentSession;
      if (!sessionToUse) {
        throw new Error('Payment session not found');
      }

      // Get the current user session for authentication
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) {
        throw new Error('User not authenticated');
      }

      // Call the Stripe Edge Function to create checkout session
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/stripe-payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          plan: sessionToUse.plan,
          userEmail: user?.email,
          userId: user?.id,
          paymentType: paymentType
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
  }, [user, currentSession]);

  const processPayPalPayment = useCallback(async (sessionId: string): Promise<boolean> => {
    // In a real implementation, this would integrate with PayPal
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      if (!currentSession || !user) {
        throw new Error('Session or user not available');
      }

      // Instead of activating premium directly here, use the Stripe webhook endpoint
      // This ensures proper time stacking and avoids conflicts with webhook processing
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No user session available');
      }

      // Call the activate-payment endpoint to ensure proper stacking
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/stripe-payment/activate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          stripeSessionId: sessionId,
          userId: user.id 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to activate premium access');
      }

      // Update payment session status
      const { error: sessionError } = await supabase
        .from('payment_sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      // Refresh premium status
      await refetchPremiumStatus();
      
    } catch (error) {
      console.error('Error activating premium access:', error);
      throw error;
    }
  }, [refetchPremiumStatus, currentSession, user]);

  const cancelPaymentSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('payment_sessions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
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
        title: "Cancellation Error",
        description: "Could not cancel payment session",
        variant: "destructive"
      });
    }
  }, []);

  return {
    loading,
    currentSession,
    subscriptionPlans,
    donationTiers,
    createPaymentSession,
    processStripePayment,
    processPayPalPayment,
    processCryptoPayment,
    cancelPaymentSession,
    activatePremiumAccess
  };
};