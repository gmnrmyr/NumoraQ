
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, ChevronDown, ChevronUp, Calendar, Gift, Users } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Leaderboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userStats, leaderboard } = useLeaderboard();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" size={20} />;
      case 1: return <Medal className="text-gray-400" size={20} />;
      case 2: return <Award className="text-amber-600" size={20} />;
      default: return <Star className="text-muted-foreground" size={16} />;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/95 backdrop-blur-md border-2 border-accent">
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <CardTitle className="text-accent font-mono uppercase text-sm flex items-center gap-2">
                <Trophy size={16} />
                Leaderboard
              </CardTitle>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* User Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-background/50 border border-border rounded">
                <div className="text-lg font-bold text-accent font-mono">{userStats.points}</div>
                <div className="text-xs text-muted-foreground font-mono">Points</div>
              </div>
              <div className="text-center p-2 bg-background/50 border border-border rounded">
                <div className="text-lg font-bold text-green-500 font-mono flex items-center justify-center gap-1">
                  <Calendar size={14} />
                  {userStats.dailyLogins}
                </div>
                <div className="text-xs text-muted-foreground font-mono">Daily Logins</div>
              </div>
              <div className="text-center p-2 bg-background/50 border border-border rounded">
                <div className="text-lg font-bold text-blue-500 font-mono flex items-center justify-center gap-1">
                  <Gift size={14} />
                  {userStats.donations}
                </div>
                <div className="text-xs text-muted-foreground font-mono">Donations</div>
              </div>
              <div className="text-center p-2 bg-background/50 border border-border rounded">
                <div className="text-lg font-bold text-purple-500 font-mono flex items-center justify-center gap-1">
                  <Users size={14} />
                  {userStats.referrals}
                </div>
                <div className="text-xs text-muted-foreground font-mono">Referrals</div>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono text-muted-foreground uppercase">Top Users</h3>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.userId} className="flex items-center justify-between p-2 bg-background/30 border border-border rounded">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div>
                      <div className="font-medium font-mono text-sm">{entry.username}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {entry.dailyLogins} logins • {entry.donations} donations • {entry.referrals} referrals
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {entry.points} pts
                  </Badge>
                </div>
              ))}
            </div>

            {/* Points Info */}
            <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
              💡 Earn points: Daily login (+10), Donations (+50), Referrals (+25)
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
