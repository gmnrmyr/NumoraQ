
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";
import { DailyLoginButton } from '@/components/DailyLoginButton';

interface LeaderboardHeaderProps {
  onRefresh: () => void;
}

export const LeaderboardHeader = ({ onRefresh }: LeaderboardHeaderProps) => {
  return (
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
      <div className="flex justify-center gap-2">
        <DailyLoginButton />
        <Button 
          onClick={onRefresh}
          variant="outline" 
          size="sm"
          className="brutalist-button"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
