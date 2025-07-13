
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
      console.log('🔍 Checking premium status for user:', user.id);
      
      // Query with all possible columns, fallback gracefully for missing ones
      const { data, error } = await supabase
        .from('user_premium_status')
        .select(`
          is_premium, 
          premium_type, 
          expires_at, 
          activated_at
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Premium status check error:', error);
        setIsPremiumUser(false);
        setPremiumDetails(null);
        setLoading(false);
        return;
      }

      if (!data) {
        console.log('📊 No premium status found for user');
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

      // Check if user is on trial (premium_type: '30day_trial' and hasn't expired)
      const isOnTrial = data.premium_type === '30day_trial' && hasNotExpired;

      // Calculate detailed time remaining
      let timeRemaining = '';
      if (expiryDate) {
        const diffTime = expiryDate.getTime() - now.getTime();
        
        if (diffTime <= 0) {
          timeRemaining = 'Expired';
        } else {
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
          const diffMinutes = Math.ceil(diffTime / (1000 * 60));
          
          // Show more precise time for shorter periods
          if (diffDays <= 1) {
            if (diffHours <= 1) {
              timeRemaining = `${diffMinutes} minutes`;
            } else {
              timeRemaining = `${diffHours} hours`;
            }
          } else if (diffDays <= 7) {
            timeRemaining = `${diffDays} days`;
          } else if (diffDays <= 30) {
            timeRemaining = `${diffDays} days`;
          } else if (diffDays <= 365) {
            const months = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            if (remainingDays === 0) {
              timeRemaining = `${months} months`;
            } else {
              timeRemaining = `${months} months ${remainingDays} days`;
            }
          } else {
            const years = Math.floor(diffDays / 365);
            const remainingDays = diffDays % 365;
            const remainingMonths = Math.floor(remainingDays / 30);
            
            if (remainingMonths === 0) {
              timeRemaining = `${years} years`;
            } else {
              timeRemaining = `${years} years ${remainingMonths} months`;
            }
          }
        }
      }

      // Set premium user status
      setIsPremiumUser(isActive);
      
      // Set premium details
      setPremiumDetails({
        type: data.premium_type,
        expiresAt: data.expires_at,
        isOnTrial: isOnTrial,
        trialTimeRemaining: timeRemaining,
        activationSource: 'unknown', // Will show 'unknown' if column doesn't exist
        sourceDetails: {}
      });

      console.log('📊 Premium status calculated:', {
        isPremium: isActive,
        isOnTrial: isOnTrial,
        type: data.premium_type,
        expiresAt: data.expires_at,
        timeRemaining: timeRemaining,
        diffFromNow: expiryDate ? Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 'N/A'
      });

    } catch (error) {
      console.error('❌ Error checking premium status:', error);
      setIsPremiumUser(false);
      setPremiumDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    console.log('🔄 Force refreshing premium status...');
    setLoading(true);
    await checkPremiumStatus();
  };

  // Force refresh every 30 seconds when component is active (for real-time updates)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('⏰ Auto-refreshing premium status...');
      checkPremiumStatus();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  return {
    isPremiumUser,
    premiumDetails,
    loading,
    refetch
  };
};
