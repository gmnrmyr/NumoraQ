
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  user_uid: string;
  total_points: number;
  rank: number;
  donation_count: number;
  login_streak: number;
  last_activity: string;
  is_premium?: boolean;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentLeaderboard: LeaderboardEntry[];
}

export const LeaderboardTable = ({ 
  leaderboard, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange,
  currentLeaderboard 
}: LeaderboardTableProps) => {
  const { user } = useAuth();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Award className="text-amber-600" size={24} />;
      default: return <Star className="text-muted-foreground" size={16} />;
    }
  };

  const highlightCurrentUser = (userId: string) => {
    return user?.id === userId ? "bg-accent/20 border-accent" : "bg-muted/20 border-border";
  };

  const getUserTitle = (points: number) => {
    const titles = [
      { level: 50000, title: "WHALE", color: "text-purple-600" },
      { level: 10000, title: "LEGEND", color: "text-purple-400" },
      { level: 5000, title: "PATRON", color: "text-yellow-400" },
      { level: 2000, title: "CHAMPION", color: "text-orange-400" },
      { level: 1000, title: "SUPPORTER", color: "text-blue-400" },
      { level: 500, title: "BACKER", color: "text-green-400" },
      { level: 100, title: "DONOR", color: "text-cyan-400" },
      { level: 50, title: "CONTRIBUTOR", color: "text-indigo-400" },
      { level: 25, title: "HELPER", color: "text-pink-400" },
      { level: 20, title: "FRIEND", color: "text-emerald-400" },
      { level: 10, title: "SUPPORTER", color: "text-blue-300" },
      { level: 0, title: "NEWCOMER", color: "text-slate-400" }
    ];
    
    for (const title of titles) {
      if (points >= title.level) {
        return title;
      }
    }
    
    return titles[titles.length - 1];
  };

  return (
    <Card className="brutalist-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <TrendingUp className="text-accent" size={20} />
          TOP CONTRIBUTORS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground font-mono">
            Loading leaderboard...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-mono">
            No data available. Be the first to earn points!
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentLeaderboard.map((entry) => {
                const userTitle = getUserTitle(entry.total_points);
                return (
                  <div 
                    key={entry.user_id} 
                    className={`flex items-center justify-between p-3 border rounded transition-colors ${highlightCurrentUser(entry.user_id)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <div>
                        <div className="font-mono font-bold text-sm flex items-center gap-2">
                          {entry.user_name}
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            UID:{entry.user_uid}
                          </Badge>
                          {user?.id === entry.user_id && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-4">
                              YOU
                            </Badge>
                          )}
                          {entry.is_premium && (
                            <Badge variant="default" className="text-xs px-2 py-0 h-4 bg-green-600 text-white">
                              DEGEN
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-xs px-2 py-0 h-4 ${userTitle.color}`}>
                            {userTitle.title}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          Rank #{entry.rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-accent font-mono">{entry.total_points.toLocaleString()} pts</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {entry.login_streak} logins • * donations
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="brutalist-button"
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm font-mono px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="brutalist-button"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
