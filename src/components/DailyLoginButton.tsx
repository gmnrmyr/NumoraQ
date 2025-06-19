
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle } from "lucide-react";
import { useLeaderboard } from '@/hooks/useLeaderboard';

export const DailyLoginButton = () => {
  const [claiming, setClaiming] = useState(false);
  const { awardDailyLoginPoints } = useLeaderboard();

  const handleClaim = async () => {
    setClaiming(true);
    await awardDailyLoginPoints();
    setClaiming(false);
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={claiming}
      className="brutalist-button bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      {claiming ? (
        <CheckCircle size={16} className="mr-2" />
      ) : (
        <Gift size={16} className="mr-2" />
      )}
      {claiming ? 'Claiming...' : 'Daily +10'}
    </Button>
  );
};
