
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  points: number;
  rank: number;
  streak: number;
  donations: number;
  referrals: number;
}

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    rank: 0,
    streak: 0,
    donations: 0,
    referrals: 0
  });
  const [loading, setLoading] = useState(true);

  const loadUserStats = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get user's total points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points, activity_type')
        .eq('user_id', user.user.id);

      if (pointsError) throw pointsError;

      const totalPoints = pointsData?.reduce((sum, entry) => sum + entry.points, 0) || 0;
      const donations = pointsData?.filter(p => p.activity_type === 'donation').length || 0;
      const streak = pointsData?.filter(p => p.activity_type === 'daily_login').length || 0;
      const referrals = pointsData?.filter(p => p.activity_type === 'referral').length || 0;

      // Calculate user rank
      const { data: allUsersPoints } = await supabase
        .from('user_points')
        .select('user_id, points');

      const userTotals = new Map<string, number>();
      allUsersPoints?.forEach(entry => {
        const current = userTotals.get(entry.user_id) || 0;
        userTotals.set(entry.user_id, current + entry.points);
      });

      const sortedTotals = Array.from(userTotals.entries())
        .sort(([, a], [, b]) => b - a);

      const rank = sortedTotals.findIndex(([userId]) => userId === user.user.id) + 1;

      setUserStats({
        points: totalPoints,
        rank: rank || 999,
        streak,
        donations,
        referrals
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  return {
    userStats,
    loading,
    refresh: loadUserStats
  };
};
