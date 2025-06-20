
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserTitle {
  id: number;
  title: string;
  min_points: number;
  max_points: number;
}

const DEFAULT_TITLES: UserTitle[] = [
  { id: 1, title: 'NEWBIE', min_points: 0, max_points: 99 },
  { id: 2, title: 'BEGINNER', min_points: 100, max_points: 299 },
  { id: 3, title: 'APPRENTICE', min_points: 300, max_points: 599 },
  { id: 4, title: 'TRACKER', min_points: 600, max_points: 999 },
  { id: 5, title: 'ANALYST', min_points: 1000, max_points: 1999 },
  { id: 6, title: 'STRATEGIST', min_points: 2000, max_points: 3999 },
  { id: 7, title: 'EXPERT', min_points: 4000, max_points: 7999 },
  { id: 8, title: 'MASTER', min_points: 8000, max_points: 15999 },
  { id: 9, title: 'LEGEND', min_points: 16000, max_points: 31999 },
  { id: 10, title: 'MATRIX LORD', min_points: 32000, max_points: 63999 },
  { id: 11, title: 'DEGEN OVERLORD', min_points: 64000, max_points: 999999 }
];

export const useUserTitles = () => {
  const { user } = useAuth();
  const [userTitle, setUserTitle] = useState<string>('NEWBIE');
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPoints();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserPoints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user points:', error);
        return;
      }

      const points = data?.total_points || 0;
      setUserPoints(points);
      
      // Calculate title based on points
      const title = calculateTitle(points);
      setUserTitle(title);
    } catch (error) {
      console.error('Error loading user points:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTitle = (points: number): string => {
    for (const title of DEFAULT_TITLES) {
      if (points >= title.min_points && points <= title.max_points) {
        return title.title;
      }
    }
    return 'MATRIX LORD'; // Fallback for very high points
  };

  const setCustomTitle = async (userId: string, titleId: number) => {
    try {
      const title = DEFAULT_TITLES.find(t => t.id === titleId);
      if (!title) return;

      const { error } = await supabase
        .from('user_custom_titles')
        .upsert({
          user_id: userId,
          title: title.title,
          assigned_by: user?.id
        });

      if (error) {
        console.error('Error setting custom title:', error);
      }
    } catch (error) {
      console.error('Error setting custom title:', error);
    }
  };

  return {
    userTitle,
    userPoints,
    loading,
    titles: DEFAULT_TITLES,
    setCustomTitle,
    refresh: loadUserPoints
  };
};
