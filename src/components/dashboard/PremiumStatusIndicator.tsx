
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Zap, Timer } from "lucide-react";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useFinancialData } from "@/contexts/FinancialDataContext";

export const PremiumStatusIndicator = () => {
  const { isPremiumUser } = usePremiumStatus();
  const { data } = useFinancialData();
  
  if (!isPremiumUser) return null;

  const expiresAt = data.userProfile.premiumExpiresAt;
  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Expired';
      if (diffDays === 0) return 'Expires today';
      if (diffDays === 1) return 'Expires tomorrow';
      if (diffDays < 30) return `${diffDays} days left`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
      return `${Math.ceil(diffDays / 365)} years left`;
    } catch {
      return 'Active';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-600/20 border-green-600 text-green-400 font-mono">
        <Zap size={12} className="mr-1" />
        DEGEN MODE
      </Badge>
      {expiresAt && (
        <Badge variant="outline" className="bg-yellow-600/20 border-yellow-600 text-yellow-400 font-mono">
          <Timer size={12} className="mr-1" />
          {formatExpiryDate(expiresAt)}
        </Badge>
      )}
    </div>
  );
};
