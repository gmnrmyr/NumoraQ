
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
}

interface UserStats {
  points: number;
  rank: number;
  streak: number;
  donations: number;
  referrals: number;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    rank: 0,
    streak: 0,
    donations: 0,
    referrals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    loadUserStats();
  }, []);

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

      // Get user profiles for names and UIDs - use name from profiles as primary source
      const userIds = Array.from(userPointsMap.keys());
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, user_uid')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine data and create leaderboard
      const leaderboardEntries: LeaderboardEntry[] = [];
      
      userPointsMap.forEach((stats, userId) => {
        const profile = profilesData?.find(p => p.id === userId);
        
        // Use the name from profiles (this comes from USER_INFO_CONFIG_UI)
        let displayName = 'Anonymous User';
        if (profile?.name && profile.name.trim()) {
          displayName = profile.name.trim();
        }
        
        // Generate UID from user ID if not set
        let userUID = profile?.user_uid || 'UNKNOWN';
        if (!userUID || userUID === 'UNKNOWN') {
          // Generate a simple UID from the user ID
          userUID = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
        }
        
        leaderboardEntries.push({
          user_id: userId,
          user_name: displayName,
          user_uid: userUID,
          total_points: stats.total_points,
          rank: 0, // Will be calculated after sorting
          donation_count: stats.donation_count,
          login_streak: stats.login_streak,
          last_activity: stats.last_activity
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
    }
  };

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

  const awardDailyLoginPoints = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const today = new Date().toISOString().split('T')[0];

      // Check if user already got points today
      const { data: existing } = await supabase
        .from('user_points')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('activity_type', 'daily_login')
        .eq('activity_date', today)
        .single();

      if (existing) {
        toast({
          title: "Already Claimed",
          description: "You've already received your daily login bonus today!",
          variant: "destructive"
        });
        return false;
      }

      // Award 1 point instead of 10
      const { error } = await supabase
        .from('user_points')
        .insert({
          user_id: user.user.id,
          points: 1,
          activity_type: 'daily_login',
          activity_date: today
        });

      if (error) throw error;

      toast({
        title: "Daily Login Bonus!",
        description: "You earned 1 point for logging in today!"
      });

      // Refresh data
      await loadUserStats();
      await loadLeaderboard();
      
      return true;
    } catch (error) {
      console.error('Error awarding daily login points:', error);
      toast({
        title: "Error",
        description: "Failed to award daily login points",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    leaderboard,
    userStats,
    loading,
    awardDailyLoginPoints,
    refresh: () => {
      loadLeaderboard();
      loadUserStats();
    }
  };
};
