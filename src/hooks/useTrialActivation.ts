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
    if (user && !premiumDetails && !isActivating) {
      // Only check for trial if user has no premium status at all
      checkAndActivateTrial();
    }
  }, [user, premiumDetails, isActivating]);

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

      // If no premium status exists, the database trigger should have created one
      // But if it didn't, we'll create it manually
      if (!existingStatus) {
        await createMissingTrial();
      }
    } catch (error) {
      console.error('Error in trial activation:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const createMissingTrial = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const { error } = await supabase
        .from('user_premium_status')
        .insert({
          user_id: user.id,
          is_premium: false, // Trial users are not premium (they see ads)
          premium_type: '30day_trial',
          activated_at: now.toISOString(),
          expires_at: trialExpiry.toISOString(),
          activation_source: 'manual_trial',
          source_details: JSON.stringify({
            trial_type: '30_day',
            manually_created: true,
            reason: 'missing_trial_fix'
          })
        });

      if (error) {
        console.error('Error creating missing trial:', error);
        return;
      }

      // Refetch premium status to reflect the new trial
      await refetchPremiumStatus();

      console.log('30-day trial created for user:', user.id);
      
      toast({
        title: "🎉 Welcome to NUMORAQ!",
        description: "Your 30-day free trial has started!",
        duration: 5000
      });
    } catch (error) {
      console.error('Error creating missing trial:', error);
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
          premium_type: '30day_trial',
          activated_at: now.toISOString(),
          expires_at: gracePeriodExpiry.toISOString(),
          activation_source: 'grace_period',
          source_details: JSON.stringify({
            trial_type: '3_day_grace',
            grace_period: true
          }),
          updated_at: now.toISOString()
        });

      if (error) {
        console.error('Error activating beta grace period:', error);
        return false;
      }

      await refetchPremiumStatus();

      toast({
        title: "🎉 Beta Grace Period Activated!",
        description: "You have 3 days of beta access!",
        duration: 5000
      });

      return true;
    } catch (error) {
      console.error('Error in beta grace period activation:', error);
      return false;
    }
  };

  const isTrialExpired = () => {
    if (!premiumDetails || !premiumDetails.expiresAt) return false;
    if (premiumDetails.type !== '30day_trial') return false;
    
    const now = new Date();
    const expiryDate = new Date(premiumDetails.expiresAt);
    return expiryDate <= now;
  };

  const isOnTrial = () => {
    return premiumDetails?.isOnTrial === true;
  };

  const getTrialTimeRemaining = () => {
    if (!premiumDetails || !premiumDetails.isOnTrial) return '';
    return premiumDetails.trialTimeRemaining || '';
  };

  const trialTimeRemaining = getTrialTimeRemaining();

  return {
    activateBetaGracePeriod,
    isTrialExpired: isTrialExpired(),
    isOnTrial: isOnTrial(),
    trialTimeRemaining,
    isActivating
  };
}; 