import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTrialActivation = () => {
  const { user } = useAuth();
  const { isPremiumUser, premiumDetails, refetch: refetchPremiumStatus } = usePremiumStatus();
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    if (user && !isPremiumUser && !premiumDetails) {
      checkAndActivateTrial();
    }
  }, [user, isPremiumUser, premiumDetails]);

  const checkAndActivateTrial = async () => {
    if (!user || isActivating) return;

    try {
      setIsActivating(true);
      
      // Check if user already has premium status record
      const { data: existingStatus, error: statusError } = await supabase
        .from('user_premium_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statusError && statusError.code !== 'PGRST116') {
        console.error('Error checking premium status:', statusError);
        return;
      }

      // If no premium status exists, create 30-day trial
      if (!existingStatus) {
        await activateFreeTrial();
      }
    } catch (error) {
      console.error('Error in trial activation:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const activateFreeTrial = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const { error } = await supabase
        .from('user_premium_status')
        .insert({
          user_id: user.id,
          is_premium: false, // Trial users should see ads like non-degens
          premium_type: 'lifetime', // Use valid constraint value, actual trial tracked in metadata
          activated_at: now.toISOString(),
          expires_at: trialExpiry.toISOString(),
        });

      if (error) {
        console.error('Error activating trial:', error);
        return;
      }

      // Refetch premium status to reflect the new trial
      await refetchPremiumStatus();

      console.log('30-day trial activated for user:', user.id);
      
      toast({
        title: "🎉 Welcome to NUMORAQ!",
        description: "Your 30-day free trial has started! (You'll see ads during trial)",
        duration: 5000
      });
    } catch (error) {
      console.error('Error in trial activation:', error);
    }
  };

  const activateBetaGracePeriod = async () => {
    if (!user) return false;

    try {
      const now = new Date();
      const gracePeriodExpiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

      const { error } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: user.id,
          is_premium: false, // Grace period users also see ads
          premium_type: 'lifetime', // Use valid constraint value
          activated_at: now.toISOString(),
          expires_at: gracePeriodExpiry.toISOString(),
          updated_at: now.toISOString()
        });

      if (error) {
        console.error('Error activating grace period:', error);
        toast({
          title: "Grace Period Failed",
          description: "Could not activate 3-day grace period. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "🎁 3-Day Grace Period Activated!",
        description: "You have 3 additional days to explore premium features (with ads)",
        duration: 8000
      });

      return true;
    } catch (error) {
      console.error('Error activating grace period:', error);
      return false;
    }
  };

  const isTrialExpired = () => {
    if (!premiumDetails) return false;
    
    // Check if it's a trial that has expired
    // A trial is: is_premium: false with an expiry date that has passed
    if (premiumDetails.type === '30day_trial' && premiumDetails.expiresAt) {
      const expiryDate = new Date(premiumDetails.expiresAt);
      const now = new Date();
      return expiryDate <= now;
    }
    
    return false;
  };

  const getTrialTimeRemaining = () => {
    if (!premiumDetails || !premiumDetails.expiresAt) return '';
    
    const expiryDate = new Date(premiumDetails.expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 Day';
    return `${diffDays} Days`;
  };

  const isOnTrial = premiumDetails?.isOnTrial || false;
  const trialTimeRemaining = getTrialTimeRemaining();

  return {
    activateFreeTrial,
    activateBetaGracePeriod,
    isTrialExpired: isTrialExpired(),
    trialTimeRemaining,
    isOnTrial,
    isActivating
  };
}; 