
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumDetails, setPremiumDetails] = useState<{
    type: string | null;
    expiresAt: string | null;
    isOnTrial?: boolean;
    trialTimeRemaining?: string;
    activationSource?: string;
    sourceDetails?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremiumUser(false);
      setPremiumDetails(null);
      setLoading(false);
      return;
    }

    checkPremiumStatus();
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_premium_status')
        .select('is_premium, premium_type, expires_at, activated_at, activation_source, source_details')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Premium status check error:', error);
        setIsPremiumUser(false);
        setPremiumDetails(null);
        setLoading(false);
        return;
      }

      if (!data) {
        // User doesn't have premium status - they should have been given a trial
        setIsPremiumUser(false);
        setPremiumDetails(null);
        setLoading(false);
        return;
      }

      const now = new Date();
      const expiryDate = data.expires_at ? new Date(data.expires_at) : null;
      const hasNotExpired = !expiryDate || expiryDate > now;

      // Check if user has actual premium access (is_premium: true and not expired)
      const isActive = data.is_premium && hasNotExpired;

      // Check if user is on trial (is_premium: false but has expiry date and hasn't expired)
      const isOnTrial = !data.is_premium && data.premium_type === '30day_trial' && hasNotExpired;

      // Calculate trial time remaining if on trial
      let trialTimeRemaining = '';
      if (isOnTrial && expiryDate) {
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
          trialTimeRemaining = 'Expired';
        } else if (diffDays === 1) {
          trialTimeRemaining = '1 Day';
        } else {
          trialTimeRemaining = `${diffDays} Days`;
        }
      }

      // Set states based on the results
      setIsPremiumUser(isActive);
      setPremiumDetails({
        type: data.premium_type,
        expiresAt: data.expires_at,
        isOnTrial: isOnTrial,
        trialTimeRemaining: trialTimeRemaining,
        activationSource: data.activation_source,
        sourceDetails: data.source_details
      });

      setLoading(false);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremiumUser(false);
      setPremiumDetails(null);
      setLoading(false);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await checkPremiumStatus();
  };

  return {
    isPremiumUser,
    premiumDetails,
    loading,
    refetch
  };
};
