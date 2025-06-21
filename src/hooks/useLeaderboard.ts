
import { useLeaderboardData } from './leaderboard/useLeaderboardData';
import { useUserStats } from './leaderboard/useUserStats';
import { useDailyLogin } from './leaderboard/useDailyLogin';

export const useLeaderboard = () => {
  const { leaderboard, loading: leaderboardLoading, refresh: refreshLeaderboard } = useLeaderboardData();
  const { userStats, loading: statsLoading, refresh: refreshStats } = useUserStats();
  const { awardDailyLoginPoints } = useDailyLogin();

  const refresh = () => {
    refreshLeaderboard();
    refreshStats();
  };

  return {
    leaderboard,
    userStats,
    loading: leaderboardLoading || statsLoading,
    awardDailyLoginPoints,
    refresh
  };
};
