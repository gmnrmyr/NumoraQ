
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';

interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  dailyLogins: number;
  donations: number;
  referrals: number;
  lastLogin: string;
}

interface UserStats {
  points: number;
  dailyLogins: number;
  donations: number;
  referrals: number;
  lastLogin: string;
  loginStreak: number;
}

export const useLeaderboard = () => {
  const { user } = useAuth();
  const { data } = useFinancialData();
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    dailyLogins: 0,
    donations: 0,
    referrals: 0,
    lastLogin: '',
    loginStreak: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Points calculation
  const calculatePoints = (stats: UserStats) => {
    return (stats.dailyLogins * 10) + (stats.donations * 50) + (stats.referrals * 25);
  };

  // Check daily login
  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLogin');
    
    if (lastLogin !== today) {
      localStorage.setItem('lastLogin', today);
      const currentLogins = parseInt(localStorage.getItem('dailyLogins') || '0');
      const newLogins = currentLogins + 1;
      localStorage.setItem('dailyLogins', newLogins.toString());
      
      // Update login streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastLogin === yesterday.toDateString();
      const currentStreak = parseInt(localStorage.getItem('loginStreak') || '0');
      const newStreak = isConsecutive ? currentStreak + 1 : 1;
      localStorage.setItem('loginStreak', newStreak.toString());
      
      setUserStats(prev => ({
        ...prev,
        dailyLogins: newLogins,
        lastLogin: today,
        loginStreak: newStreak,
        points: calculatePoints({ ...prev, dailyLogins: newLogins })
      }));
      
      return true; // New login
    }
    return false; // Already logged in today
  };

  // Track donation
  const trackDonation = (amount: number) => {
    const currentDonations = parseInt(localStorage.getItem('totalDonations') || '0');
    const newDonations = currentDonations + amount;
    localStorage.setItem('totalDonations', newDonations.toString());
    
    setUserStats(prev => ({
      ...prev,
      donations: newDonations,
      points: calculatePoints({ ...prev, donations: newDonations })
    }));
  };

  // Track referral
  const trackReferral = () => {
    const currentReferrals = parseInt(localStorage.getItem('referrals') || '0');
    const newReferrals = currentReferrals + 1;
    localStorage.setItem('referrals', newReferrals.toString());
    
    setUserStats(prev => ({
      ...prev,
      referrals: newReferrals,
      points: calculatePoints({ ...prev, referrals: newReferrals })
    }));
  };

  // Load user stats from localStorage
  useEffect(() => {
    if (user) {
      const dailyLogins = parseInt(localStorage.getItem('dailyLogins') || '0');
      const donations = parseInt(localStorage.getItem('totalDonations') || '0');
      const referrals = parseInt(localStorage.getItem('referrals') || '0');
      const lastLogin = localStorage.getItem('lastLogin') || '';
      const loginStreak = parseInt(localStorage.getItem('loginStreak') || '0');
      
      const stats = {
        dailyLogins,
        donations,
        referrals,
        lastLogin,
        loginStreak,
        points: calculatePoints({ dailyLogins, donations, referrals, lastLogin, loginStreak })
      };
      
      setUserStats(stats);
      
      // Check for daily login on load
      checkDailyLogin();
    }
  }, [user]);

  // Mock leaderboard data (in future, this would come from backend)
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: 'user1',
        username: 'CryptoKing',
        points: 1250,
        dailyLogins: 45,
        donations: 15,
        referrals: 8,
        lastLogin: new Date().toDateString()
      },
      {
        userId: 'user2',
        username: 'InvestorPro',
        points: 980,
        dailyLogins: 32,
        donations: 12,
        referrals: 6,
        lastLogin: new Date().toDateString()
      },
      {
        userId: user?.id || 'current',
        username: data.userProfile.name || 'You',
        points: userStats.points,
        dailyLogins: userStats.dailyLogins,
        donations: userStats.donations,
        referrals: userStats.referrals,
        lastLogin: userStats.lastLogin
      }
    ].sort((a, b) => b.points - a.points);
    
    setLeaderboard(mockLeaderboard);
  }, [userStats, user, data.userProfile.name]);

  return {
    userStats,
    leaderboard,
    checkDailyLogin,
    trackDonation,
    trackReferral
  };
};
