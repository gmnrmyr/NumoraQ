
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserTitle {
  title: string;
  color: string;
  level: number;
  description: string;
}

const USER_TITLES: UserTitle[] = [
  // Donation-based titles (highest to lowest)
  { level: 50000, title: 'WHALE', color: 'text-purple-600', description: '$50,000+ Exclusive Whale Badge' },
  { level: 10000, title: 'LEGEND', color: 'text-purple-400', description: '$10,000+ Exclusive Legend Badge' },
  { level: 5000, title: 'PATRON', color: 'text-yellow-400', description: '$5,000+ Patron Badge' },
  { level: 2000, title: 'CHAMPION', color: 'text-orange-400', description: '$2,000+ Champion Badge' },
  { level: 1000, title: 'SUPPORTER', color: 'text-blue-400', description: '$1,000+ Supporter Badge' },
  { level: 500, title: 'BACKER', color: 'text-green-400', description: '$500+ Backer Badge' },
  { level: 100, title: 'DONOR', color: 'text-cyan-400', description: '$100+ Donor Badge' },
  { level: 50, title: 'CONTRIBUTOR', color: 'text-indigo-400', description: '$50+ Contributor Badge' },
  { level: 25, title: 'HELPER', color: 'text-pink-400', description: '$25+ Helper Badge' },
  { level: 20, title: 'FRIEND', color: 'text-emerald-400', description: '$20+ Friend Badge' },
  { level: 10, title: 'SUPPORTER', color: 'text-blue-300', description: '$10+ Basic Supporter Badge' },
  { level: 0, title: 'NEWCOMER', color: 'text-slate-400', description: '$0-9 Welcome Badge' }
];

export const useUserTitle = () => {
  const { user } = useAuth();
  const [userTitle, setUserTitle] = useState<UserTitle>({ 
    title: 'NEWCOMER', 
    color: 'text-slate-400', 
    level: 0, 
    description: '$0-9 Welcome Badge' 
  });
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

      console.log('User points calculated:', { totalPoints });

      // Check for admin-assigned title first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('admin_level')
        .eq('id', user.id)
        .single();

      if (profileData?.admin_level && profileData.admin_level !== 'standard') {
        const adminLevel = parseInt(profileData.admin_level);
        if (adminLevel >= 1 && adminLevel <= 50000) {
          const title = USER_TITLES.find(t => adminLevel >= t.level) || USER_TITLES[USER_TITLES.length - 1];
          setUserTitle(title);
          setLoading(false);
          return;
        }
      }

      // Calculate title based on total points using your specified thresholds
      let selectedTitle = USER_TITLES[USER_TITLES.length - 1]; // Default to NEWCOMER

      // Find the highest title the user qualifies for
      for (const title of USER_TITLES) {
        if (totalPoints >= title.level) {
          selectedTitle = title;
          break;
        }
      }

      console.log('Calculated title:', selectedTitle, 'for points:', totalPoints);
      setUserTitle(selectedTitle);
    } catch (error) {
      console.error('Error calculating user title:', error);
    } finally {
      setLoading(false);
    }
  };

  return { userTitle, loading, refresh: calculateUserTitle };
};
