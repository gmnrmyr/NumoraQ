
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
        .select('is_premium, premium_type, expires_at, trial_activated_at')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setIsPremiumUser(false);
        setPremiumDetails(null);
        return;
      }

      const now = new Date();
      const expiryDate = data.expires_at ? new Date(data.expires_at) : null;
      const hasNotExpired = !expiryDate || expiryDate > now;

      // Check if user has actual premium access (is_premium: true and not expired)
      const isActive = data.is_premium && hasNotExpired;

      // Check if user is on trial (premium_type: '30day_trial' and not expired)
      const isOnTrial = data.premium_type === '30day_trial' && hasNotExpired;

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

      setIsPremiumUser(isActive);
      
      if (isActive || isOnTrial) {
        setPremiumDetails({
          type: data.premium_type || 'lifetime',
          expiresAt: data.expires_at,
          isOnTrial,
          trialTimeRemaining
        });
      } else {
        setPremiumDetails(null);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremiumUser(false);
      setPremiumDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return { isPremiumUser, premiumDetails, loading, refetch: checkPremiumStatus };
};
