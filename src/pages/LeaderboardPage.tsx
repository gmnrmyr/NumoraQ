
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, TrendingUp, Calendar, Gift, Users } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { data } = useFinancialData();

  // Mock leaderboard data - this will be replaced with real data later
  const mockLeaderboard = [
    { rank: 1, name: "CryptoKing", points: 2840, streak: 45, donations: 12 },
    { rank: 2, name: "DeFiMaster", points: 2650, streak: 38, donations: 8 },
    { rank: 3, name: "HODLer_Pro", points: 2420, streak: 32, donations: 15 },
    { rank: 4, name: "YieldFarmer", points: 2180, streak: 28, donations: 6 },
    { rank: 5, name: "NFTCollector", points: 1950, streak: 25, donations: 10 },
  ];

  const userStats = {
    points: 1250,
    rank: 12,
    streak: 18,
    donations: 3,
    referrals: 2
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Award className="text-amber-600" size={24} />;
      default: return <Star className="text-muted-foreground" size={16} />;
    }
  };

  return (
    <>
      <title>Leaderboard - OPEN FINDASH | Community Rankings</title>
      <meta name="description" content="See how you rank among the OPEN FINDASH community. Track your fidelity points, donation contributions, and overall engagement." />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Navbar activeTab="leaderboard" onTabChange={() => {}} />
        <div className="pt-20 sm:pt-32 pb-8">
          <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
            
            {/* Header */}
            <div className="text-center space-y-4 py-8">
              <div className="flex items-center justify-center gap-4">
                <Trophy className="text-accent" size={32} />
                <h1 className="text-3xl font-bold font-mono text-accent uppercase tracking-wider">
                  COMMUNITY LEADERBOARD
                </h1>
                <Trophy className="text-accent" size={32} />
              </div>
              <p className="text-muted-foreground font-mono uppercase tracking-wide">
                FIDELITY POINTS // COMMUNITY ENGAGEMENT // PLATFORM GROWTH
              </p>
            </div>

            {/* User Stats Card */}
            {user && (
              <Card className="brutalist-card border-accent bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <Star className="text-accent" size={20} />
                    YOUR STATS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-accent">{userStats.points}</div>
                      <div className="text-xs text-muted-foreground font-mono">POINTS</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-accent">#{userStats.rank}</div>
                      <div className="text-xs text-muted-foreground font-mono">RANK</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-accent">{userStats.streak}</div>
                      <div className="text-xs text-muted-foreground font-mono">DAY STREAK</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-accent">{userStats.donations}</div>
                      <div className="text-xs text-muted-foreground font-mono">DONATIONS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Point Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="brutalist-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-mono">
                    <Calendar className="text-accent" size={16} />
                    FIDELITY POINTS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground font-mono">
                    • Daily Login: +10 pts<br/>
                    • Weekly Streak: +50 pts<br/>
                    • Monthly Streak: +200 pts
                  </div>
                </CardContent>
              </Card>

              <Card className="brutalist-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-mono">
                    <Gift className="text-accent" size={16} />
                    PLATFORM SUPPORT
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground font-mono">
                    • Donation: +100 pts<br/>
                    • Feature Request: +25 pts<br/>
                    • Bug Report: +50 pts
                  </div>
                </CardContent>
              </Card>

              <Card className="brutalist-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-mono">
                    <Users className="text-accent" size={16} />
                    COMMUNITY GROWTH
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground font-mono">
                    • Referral Signup: +150 pts<br/>
                    • Active Referral: +300 pts<br/>
                    • Community Helper: +75 pts
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card className="brutalist-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <TrendingUp className="text-accent" size={20} />
                  TOP CONTRIBUTORS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded">
                      <div className="flex items-center gap-3">
                        {getRankIcon(user.rank)}
                        <div>
                          <div className="font-mono font-bold text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Rank #{user.rank}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-bold text-accent font-mono">{user.points.toLocaleString()} pts</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.streak}d streak • {user.donations} donations
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="brutalist-card border-accent bg-accent/5">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-lg font-bold font-mono text-accent">CLIMB THE RANKS</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Stay engaged, support the platform, and help grow our community to earn more fidelity points!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="brutalist-button bg-accent text-accent-foreground">
                    <Gift size={16} className="mr-2" />
                    Support Platform
                  </Button>
                  <Button variant="outline" className="brutalist-button">
                    <Users size={16} className="mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LeaderboardPage;
