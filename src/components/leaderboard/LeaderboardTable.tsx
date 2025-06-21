
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Award, Trophy } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  profiles: {
    name: string | null;
    user_uid: string | null;
  } | null;
  total_points: number;
  rank: number;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={16} />;
      case 2:
        return <Medal className="text-gray-400" size={16} />;
      case 3:
        return <Award className="text-orange-400" size={16} />;
      default:
        return <Trophy className="text-muted-foreground" size={16} />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-black";
      case 2:
        return "bg-gray-400 text-black";
      case 3:
        return "bg-orange-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.profiles?.name) {
      return entry.profiles.name;
    }
    if (entry.profiles?.user_uid) {
      return `User ${entry.profiles.user_uid}`;
    }
    return 'Anonymous User';
  };

  return (
    <div className="brutalist-card bg-card border-2 border-border p-6">
      <h3 className="text-xl font-bold font-mono text-accent uppercase tracking-wider mb-6 flex items-center gap-2">
        <Trophy size={20} />
        Global Leaderboard
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="font-mono text-accent">Rank</TableHead>
              <TableHead className="font-mono text-accent">User</TableHead>
              <TableHead className="font-mono text-accent text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    <Badge 
                      className={`font-mono text-xs px-2 py-1 ${getRankBadgeColor(entry.rank)}`}
                    >
                      #{entry.rank}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {getDisplayName(entry)}
                    </span>
                    {entry.profiles?.user_uid && (
                      <span className="text-xs text-muted-foreground">
                        UID: {entry.profiles.user_uid}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-right font-semibold text-accent">
                  {entry.total_points.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-muted-foreground font-mono">
          No leaderboard data available yet.
          <br />
          Start earning points to appear here!
        </div>
      )}
    </div>
  );
};
