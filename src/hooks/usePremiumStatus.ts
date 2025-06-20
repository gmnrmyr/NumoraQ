
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremiumUser(false);
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
        .select('is_premium, expires_at')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setIsPremiumUser(false);
        return;
      }

      // Check if premium is active and not expired
      const isActive = data.is_premium && 
        (data.expires_at === null || new Date(data.expires_at) > new Date());

      setIsPremiumUser(isActive);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremiumUser(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPremiumUser, loading, refetch: checkPremiumStatus };
};
