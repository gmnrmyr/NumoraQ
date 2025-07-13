import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTrialActivation = () => {
  const { user } = useAuth();
  const { isPremiumUser, premiumDetails, refetch: refetchPremiumStatus } = usePremiumStatus();

  useEffect(() => {
    if (user && !isPremiumUser) {
      checkAndActivateTrial();
    }
  }, [user, isPremiumUser]);

  const checkAndActivateTrial = async () => {
    if (!user) return;

    try {
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
          premium_type: '30day_trial',
          activated_at: now.toISOString(),
          expires_at: trialExpiry.toISOString(),
          trial_activated_at: now.toISOString(), // Track when trial was activated
        });

      if (error) {
        console.error('Error activating trial:', error);
        return;
      }

      // Refetch premium status to reflect the new trial
      await refetchPremiumStatus();

      console.log('30-day trial activated for user:', user.id);
    } catch (error) {
      console.error('Error in trial activation:', error);
    }
  };

  const activateBetaGracePeriod = async () => {
    if (!user) return;

    try {
      // Check if user already used grace period
      const { data: existingGrace, error: graceError } = await supabase
        .from('user_premium_status')
        .select('grace_period_used, grace_period_activated_at')
        .eq('user_id', user.id)
        .single();

      if (graceError) {
        console.error('Error checking grace period:', graceError);
        return false;
      }

      if (existingGrace?.grace_period_used) {
        toast({
          title: "Grace Period Already Used",
          description: "You've already used your beta grace period. Please purchase a degen plan to continue.",
          variant: "destructive"
        });
        return false;
      }

      const now = new Date();
      const graceExpiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

      const { error } = await supabase
        .from('user_premium_status')
        .update({
          is_premium: true,
          expires_at: graceExpiry.toISOString(),
          grace_period_used: true,
          grace_period_activated_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error activating grace period:', error);
        return false;
      }

      await refetchPremiumStatus();

      toast({
        title: "🎁 Beta Grace Period Activated!",
        description: "You have 3 additional days to try premium features. This is a one-time beta offer!",
        duration: 10000
      });

      return true;
    } catch (error) {
      console.error('Error activating grace period:', error);
      return false;
    }
  };

  const isTrialExpired = () => {
    if (!premiumDetails || premiumDetails.type !== '30day_trial') return false;
    if (!premiumDetails.expiresAt) return false;
    
    return new Date(premiumDetails.expiresAt) <= new Date();
  };

  const getTrialTimeRemaining = () => {
    if (!premiumDetails || premiumDetails.type !== '30day_trial') return null;
    if (!premiumDetails.expiresAt) return 'Lifetime';
    
    const now = new Date();
    const expiryDate = new Date(premiumDetails.expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 Day';
    return `${diffDays} Days`;
  };

  return {
    activateFreeTrial,
    activateBetaGracePeriod,
    isTrialExpired: isTrialExpired(),
    trialTimeRemaining: getTrialTimeRemaining(),
    isOnTrial: premiumDetails?.type === '30day_trial'
  };
}; 