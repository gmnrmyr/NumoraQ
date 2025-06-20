
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserTitle {
  title: string;
  color: string;
  level: number;
}

const USER_TITLES: UserTitle[] = [
  // Donation-based titles (1-100)
  { level: 100, title: 'LEGEND', color: 'text-purple-400' },
  { level: 90, title: 'PATRON', color: 'text-yellow-400' },
  { level: 80, title: 'CHAMPION', color: 'text-orange-400' },
  { level: 70, title: 'SUPPORTER', color: 'text-blue-400' },
  { level: 60, title: 'BACKER', color: 'text-green-400' },
  { level: 50, title: 'DONOR', color: 'text-cyan-400' },
  { level: 40, title: 'CONTRIBUTOR', color: 'text-indigo-400' },
  { level: 30, title: 'HELPER', color: 'text-pink-400' },
  { level: 20, title: 'FRIEND', color: 'text-emerald-400' },
  { level: 10, title: 'SUPPORTER', color: 'text-lime-400' },
  
  // Activity-based titles (101-500)
  { level: 500, title: 'MASTER TRADER', color: 'text-red-400' },
  { level: 450, title: 'CRYPTO WIZARD', color: 'text-violet-400' },
  { level: 400, title: 'PORTFOLIO GURU', color: 'text-amber-400' },
  { level: 350, title: 'MARKET ANALYST', color: 'text-teal-400' },
  { level: 300, title: 'HODLER ELITE', color: 'text-rose-400' },
  { level: 250, title: 'DIAMOND HANDS', color: 'text-sky-400' },
  { level: 200, title: 'ACTIVE TRADER', color: 'text-orange-300' },
  { level: 150, title: 'INVESTOR', color: 'text-green-300' },
  { level: 100, title: 'ENTHUSIAST', color: 'text-blue-300' },
  { level: 50, title: 'BEGINNER', color: 'text-gray-400' },
  { level: 1, title: 'NEWCOMER', color: 'text-slate-400' }
];

export const useUserTitle = () => {
  const { user } = useAuth();
  const [userTitle, setUserTitle] = useState<UserTitle>({ title: 'NEWCOMER', color: 'text-slate-400', level: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      calculateUserTitle();
    } else {
      setLoading(false);
    }
  }, [user]);

  const calculateUserTitle = async () => {
    if (!user) return;

    try {
      // Get user's total points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points, activity_type')
        .eq('user_id', user.id);

      if (pointsError) throw pointsError;

      const totalPoints = pointsData?.reduce((sum, entry) => sum + entry.points, 0) || 0;
      const donationPoints = pointsData?.filter(p => p.activity_type === 'donation')
        .reduce((sum, entry) => sum + entry.points, 0) || 0;

      // Check for admin-assigned title first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('admin_level')
        .eq('id', user.id)
        .single();

      if (profileData?.admin_level && profileData.admin_level !== 'standard') {
        const adminLevel = parseInt(profileData.admin_level);
        if (adminLevel >= 1 && adminLevel <= 500) {
          const title = USER_TITLES.find(t => t.level <= adminLevel) || USER_TITLES[USER_TITLES.length - 1];
          setUserTitle(title);
          setLoading(false);
          return;
        }
      }

      // Calculate title based on points and donations
      let targetLevel = 1;
      
      if (donationPoints > 0) {
        // Donation-based titles (higher priority)
        if (donationPoints >= 10000) targetLevel = 100; // LEGEND
        else if (donationPoints >= 5000) targetLevel = 90; // PATRON
        else if (donationPoints >= 2000) targetLevel = 80; // CHAMPION
        else if (donationPoints >= 1000) targetLevel = 70; // SUPPORTER
        else if (donationPoints >= 500) targetLevel = 60; // BACKER
        else if (donationPoints >= 100) targetLevel = 50; // DONOR
        else if (donationPoints >= 50) targetLevel = 40; // CONTRIBUTOR
        else if (donationPoints >= 25) targetLevel = 30; // HELPER
        else if (donationPoints >= 10) targetLevel = 20; // FRIEND
        else targetLevel = 10; // SUPPORTER
      } else {
        // Activity-based titles
        if (totalPoints >= 5000) targetLevel = 500;
        else if (totalPoints >= 2500) targetLevel = 450;
        else if (totalPoints >= 1000) targetLevel = 400;
        else if (totalPoints >= 750) targetLevel = 350;
        else if (totalPoints >= 500) targetLevel = 300;
        else if (totalPoints >= 300) targetLevel = 250;
        else if (totalPoints >= 200) targetLevel = 200;
        else if (totalPoints >= 100) targetLevel = 150;
        else if (totalPoints >= 50) targetLevel = 100;
        else if (totalPoints >= 25) targetLevel = 50;
        else targetLevel = 1;
      }

      const title = USER_TITLES.find(t => t.level <= targetLevel) || USER_TITLES[USER_TITLES.length - 1];
      setUserTitle(title);
    } catch (error) {
      console.error('Error calculating user title:', error);
    } finally {
      setLoading(false);
    }
  };

  return { userTitle, loading, refresh: calculateUserTitle };
};
