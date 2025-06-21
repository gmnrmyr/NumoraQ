
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  user_uid: string;
  total_points: number;
  rank: number;
  donation_count: number;
  login_streak: number;
  last_activity: string;
  is_premium?: boolean;
}

export const useLeaderboardData = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      // Get aggregated user points with profiles
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select(`
          user_id,
          points,
          activity_type,
          activity_date
        `);

      if (pointsError) throw pointsError;

      // Aggregate points by user
      const userPointsMap = new Map<string, {
        total_points: number;
        donation_count: number;
        login_streak: number;
        last_activity: string;
      }>();

      pointsData?.forEach(entry => {
        const userId = entry.user_id;
        const existing = userPointsMap.get(userId) || {
          total_points: 0,
          donation_count: 0,
          login_streak: 0,
          last_activity: entry.activity_date
        };

        existing.total_points += entry.points;
        
        if (entry.activity_type === 'donation') {
          existing.donation_count += 1;
        }
        
        if (entry.activity_type === 'daily_login') {
          existing.login_streak += 1;
        }

        if (entry.activity_date > existing.last_activity) {
          existing.last_activity = entry.activity_date;
        }

        userPointsMap.set(userId, existing);
      });

      // Get user profiles for names and UIDs
      const userIds = Array.from(userPointsMap.keys());
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, user_uid')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Get premium status for users
      const { data: premiumData, error: premiumError } = await supabase
        .from('user_premium_status')
        .select('user_id, is_premium')
        .in('user_id', userIds)
        .eq('is_premium', true);

      if (premiumError) throw premiumError;

      // Combine data and create leaderboard
      const leaderboardEntries: LeaderboardEntry[] = [];
      
      userPointsMap.forEach((stats, userId) => {
        const profile = profilesData?.find(p => p.id === userId);
        const isPremium = premiumData?.some(p => p.user_id === userId) || false;
        
        let displayName = profile?.name?.trim() || 'Anonymous User';
        let userUID = profile?.user_uid || 'USER';
        
        leaderboardEntries.push({
          user_id: userId,
          user_name: displayName,
          user_uid: userUID,
          total_points: stats.total_points,
          rank: 0, // Will be calculated after sorting
          donation_count: stats.donation_count,
          login_streak: stats.login_streak,
          last_activity: stats.last_activity,
          is_premium: isPremium
        });
      });

      // Sort by points and assign ranks
      leaderboardEntries.sort((a, b) => b.total_points - a.total_points);
      leaderboardEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboard(leaderboardEntries.slice(0, 10)); // Top 10
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    refresh: loadLeaderboard
  };
};
