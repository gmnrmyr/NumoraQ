
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserPoints {
  user_id: string;
  points: number;
  total_donated: number;
  activity_type: 'daily_login' | 'donation' | 'referral' | 'manual';
  activity_date: string;
  created_at: string;
  updated_at: string;
  highest_tier: string;
}

export const useUserPoints = () => {
  const [userPoints, setUserPoints] = useState<UserPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserPoints((data || []) as UserPoints[]);
      setTotalPoints((data || []).reduce((sum, point) => sum + point.points, 0));
    } catch (error) {
      console.error('Error loading user points:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDailyLoginPoints = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const today = new Date().toISOString().split('T')[0];

      // Check if user already got daily login points today
      const { data: existing } = await supabase
        .from('user_points')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('activity_type', 'daily_login')
        .eq('activity_date', today)
        .single();

      if (existing) {
        return false; // Already got points today
      }

      const { error } = await supabase
        .from('user_points')
        .insert({
          user_id: user.user.id,
          points: 10,
          activity_type: 'daily_login',
          activity_date: today
        });

      if (error) throw error;

      await loadUserPoints();
      
      toast({
        title: "Daily Login Bonus",
        description: "You earned 10 points for logging in today!"
      });

      return true;
    } catch (error) {
      console.error('Error adding daily login points:', error);
      return false;
    }
  };

  const addManualPoints = async (userId: string, points: number, reason: string) => {
    try {
      console.log('Adding manual points:', { userId, points, reason });
      
      // Get current admin user
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          points,
          activity_type: 'manual',
          activity_date: new Date().toISOString().split('T')[0],
          points_source: 'admin_assigned',
          source_details: JSON.stringify({
            reason: reason,
            admin_assigned: true,
            timestamp: new Date().toISOString()
          }),
          assigned_by_admin: currentUser.user?.id || null
        });

      if (error) {
        console.error('Error adding manual points:', error);
        throw error;
      }

      console.log('Manual points added successfully');

      toast({
        title: "Points Added Successfully! ✅",
        description: `${points} points added to user ${userId.substring(0, 8)}... - ${reason}`,
        duration: 5000
      });

      // Reload points if it's the current user
      if (userId === currentUser.user?.id) {
        await loadUserPoints();
      }
    } catch (error) {
      console.error('Error adding manual points:', error);
      toast({
        title: "Failed to Add Points ❌",
        description: error instanceof Error ? error.message : "Failed to add points. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  return {
    userPoints,
    totalPoints,
    loading,
    addDailyLoginPoints,
    addManualPoints,
    reload: loadUserPoints
  };
};
