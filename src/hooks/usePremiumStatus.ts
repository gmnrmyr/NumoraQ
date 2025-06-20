
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PremiumStatus {
  is_premium: boolean;
  premium_type: string | null;
  expires_at: string | null;
}

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    is_premium: false,
    premium_type: null,
    expires_at: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    } else {
      setPremiumStatus({
        is_premium: false,
        premium_type: null,
        expires_at: null
      });
      setLoading(false);
    }
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_premium_status')
        .select('is_premium, premium_type, expires_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking premium status:', error);
        return;
      }

      if (data) {
        // Check if premium has expired
        const isActive = data.is_premium && 
          (data.premium_type === 'lifetime' || 
           (data.expires_at && new Date(data.expires_at) > new Date()));

        setPremiumStatus({
          is_premium: isActive,
          premium_type: data.premium_type,
          expires_at: data.expires_at
        });
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isPremium: premiumStatus.is_premium,
    premiumType: premiumStatus.premium_type,
    expiresAt: premiumStatus.expires_at,
    loading,
    refresh: checkPremiumStatus
  };
};
