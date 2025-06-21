
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDailyLogin = () => {
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

  return { awardDailyLoginPoints };
};
