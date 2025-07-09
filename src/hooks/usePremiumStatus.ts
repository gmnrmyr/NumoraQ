
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumDetails, setPremiumDetails] = useState<{
    type: string | null;
    expiresAt: string | null;
  } | null>(null);
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
        .select('is_premium, premium_type, expires_at')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setIsPremiumUser(false);
        setPremiumDetails(null);
        return;
      }

      // Check if premium is active and not expired
      const isActive = data.is_premium && 
        (data.expires_at === null || new Date(data.expires_at) > new Date());

      setIsPremiumUser(isActive);
      
      if (isActive) {
        setPremiumDetails({
          type: data.premium_type || 'lifetime',
          expiresAt: data.expires_at
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
