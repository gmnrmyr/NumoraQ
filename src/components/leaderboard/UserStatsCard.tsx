
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface UserStatsCardProps {
  userStats: {
    points: number;
    rank: number;
    streak: number;
    donations: number;
  };
}

export const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
  return (
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
            <div className="text-xs text-muted-foreground font-mono">LOGINS</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-accent">*</div>
            <div className="text-xs text-muted-foreground font-mono">DONATIONS</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
