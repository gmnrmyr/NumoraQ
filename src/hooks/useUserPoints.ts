
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
  points_source?: string;
  source_details?: any;
  assigned_by_admin?: string;
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
          activity_date: today,
          points_source: 'daily_login',
          source_details: JSON.stringify({
            date: today,
            automatic: true
          })
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
      if (!currentUser.user) {
        throw new Error('No authenticated user found');
      }

      // Validate inputs
      if (!userId || !points || points <= 0) {
        throw new Error('Invalid parameters: userId and positive points are required');
      }

      // Check if target user exists
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id, name, user_uid')
        .eq('id', userId)
        .single();

      if (userError || !targetUser) {
        throw new Error('Target user not found');
      }

      // Get existing points to add to them
      const { data: existingPoints } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .single();

      const currentPoints = existingPoints?.points || 0;
      const newTotalPoints = currentPoints + points;

      // Add points with proper source tracking using UPSERT
      const { error, data: insertedData } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          points: newTotalPoints,
          activity_type: 'manual',
          activity_date: new Date().toISOString().split('T')[0],
          points_source: 'admin_assigned',
          source_details: JSON.stringify({
            reason: reason,
            admin_assigned: true,
            admin_id: currentUser.user.id,
            admin_email: currentUser.user.email,
            timestamp: new Date().toISOString(),
            points_added: points,
            previous_points: currentPoints,
            new_total: newTotalPoints
          }),
          assigned_by_admin: currentUser.user.id,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error adding manual points:', error);
        throw error;
      }

      console.log('Manual points added successfully:', insertedData);

      // Verify the points were actually added
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'manual')
        .eq('points', points)
        .order('created_at', { ascending: false })
        .limit(1);

      if (verifyError) {
        console.error('Error verifying points addition:', verifyError);
      } else if (verifyData && verifyData.length > 0) {
        console.log('Points verified successfully:', verifyData[0]);
      }

      return true;
    } catch (error) {
      console.error('Error in addManualPoints:', error);
      throw error;
    }
  };

  const getUserTotalPoints = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId);

      if (error) throw error;

      return (data || []).reduce((sum, point) => sum + point.points, 0);
    } catch (error) {
      console.error('Error getting user total points:', error);
      return 0;
    }
  };

  return {
    userPoints,
    totalPoints,
    loading,
    addDailyLoginPoints,
    addManualPoints,
    getUserTotalPoints,
    reloadUserPoints: loadUserPoints
  };
};
