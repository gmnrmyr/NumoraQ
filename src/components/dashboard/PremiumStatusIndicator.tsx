
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Zap, Timer } from "lucide-react";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

export const PremiumStatusIndicator = () => {
  const { isPremiumUser } = usePremiumStatus();
  
  if (!isPremiumUser) return null;

  // For now, we'll show a simple active status
  // TODO: Implement expiration date tracking in the premium status system
  const formatExpiryDate = () => {
    return 'Active';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-600/20 border-green-600 text-green-400 font-mono">
        <Zap size={12} className="mr-1" />
        DEGEN MODE
      </Badge>
      <Badge variant="outline" className="bg-yellow-600/20 border-yellow-600 text-yellow-400 font-mono">
        <Timer size={12} className="mr-1" />
        {formatExpiryDate()}
      </Badge>
    </div>
  );
};
