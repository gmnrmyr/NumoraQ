import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTrialActivation = () => {
  const { user } = useAuth();
  const { isPremiumUser, refetch } = usePremiumStatus();
  const [checking, setChecking] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);

  useEffect(() => {
    // Only check for trial activation once per session
    if (user && !isPremiumUser && !checking && !trialActivated) {
      checkAndActivateTrial();
    }
  }, [user, isPremiumUser, checking, trialActivated]);

  const checkAndActivateTrial = async () => {
    if (!user) return;

    setChecking(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setChecking(false);
        return;
      }

      // First, check if user needs trial
      const checkResponse = await fetch(`${supabase.supabaseUrl}/functions/v1/trial_activation/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (!checkResponse.ok) {
        setChecking(false);
        return;
      }

      const checkData = await checkResponse.json();

      // If user needs trial, activate it
      if (checkData.needsTrial) {
        const activateResponse = await fetch(`${supabase.supabaseUrl}/functions/v1/trial_activation/activate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          }
        });

        if (activateResponse.ok) {
          const activateData = await activateResponse.json();
          
          setTrialActivated(true);
          
          // Refresh premium status
          await refetch();
          
          // Show success message
          toast({
            title: "🎉 Welcome! Free Trial Activated!",
            description: "You have 30 days of premium access to explore all features. Enjoy!",
            duration: 8000
          });

          console.log('30-day trial activated successfully:', activateData);
        } else {
          const errorData = await activateResponse.json();
          console.error('Failed to activate trial:', errorData);
          
          // Don't show error to user as this is automatic
        }
      }
    } catch (error) {
      console.error('Error checking/activating trial:', error);
      // Don't show error to user as this is automatic
    } finally {
      setChecking(false);
    }
  };

  return {
    checking,
    trialActivated,
    checkAndActivateTrial
  };
}; 