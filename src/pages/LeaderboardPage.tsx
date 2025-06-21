
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { ProfileUIDEditor } from '@/components/ProfileUIDEditor';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { UserStatsCard } from '@/components/leaderboard/UserStatsCard';
import { PointCategoriesGrid } from '@/components/leaderboard/PointCategoriesGrid';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { CallToActionCard } from '@/components/leaderboard/CallToActionCard';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { leaderboard, userStats, loading, refresh } = useLeaderboard();
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaderboard = leaderboard.slice(startIndex, endIndex);

  return (
    <>
      <title>Leaderboard - OPEN FINDASH | Community Rankings</title>
      <meta name="description" content="See how you rank among the OPEN FINDASH community. Track your fidelity points, donation contributions, and overall engagement." />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Navbar activeTab="leaderboard" onTabChange={() => {}} />
        <div className="pt-20 sm:pt-32 pb-8">
          <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
            
            <LeaderboardHeader onRefresh={refresh} />

            {showProfile && user && (
              <ProfileUIDEditor />
            )}

            {user && (
              <UserStatsCard userStats={userStats} />
            )}

            <PointCategoriesGrid />

            <LeaderboardTable 
              leaderboard={leaderboard}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              currentLeaderboard={currentLeaderboard}
            />

            <CallToActionCard />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LeaderboardPage;
