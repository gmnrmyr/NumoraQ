
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Zap, Timer } from "lucide-react";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

export const PremiumStatusIndicator = () => {
  const { isPremiumUser, premiumDetails } = usePremiumStatus();
  
  if (!isPremiumUser) return null;

  const formatExpiryDate = () => {
    if (!premiumDetails) return 'Active';
    
    if (!premiumDetails.expiresAt) return 'Lifetime';
    
    const expiryDate = new Date(premiumDetails.expiresAt);
    const now = new Date();
    
    if (expiryDate.getFullYear() >= 2099) return 'Lifetime';
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 Day Left';
    if (diffDays <= 30) return `${diffDays} Days Left`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} Months Left`;
    
    return `${Math.ceil(diffDays / 365)} Years Left`;
  };

  const getPremiumTypeDisplay = () => {
    if (!premiumDetails?.type) return 'DEGEN MODE';
    
    switch (premiumDetails.type) {
      case '30day_trial': return 'FREE TRIAL';
      case '1year': return 'DEGEN 1Y';
      case '5years': return 'DEGEN 5Y';
      case 'lifetime': return 'DEGEN LIFE';
      case '1month': return 'DEGEN 1M';
      case '3months': return 'DEGEN 3M';
      case '6months': return 'DEGEN 6M';
      default: return 'DEGEN MODE';
    }
  };

  const getBadgeStyle = () => {
    if (premiumDetails?.type === '30day_trial') {
      return "bg-blue-600/20 border-blue-600 text-blue-400 font-mono";
    }
    return "bg-green-600/20 border-green-600 text-green-400 font-mono";
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={getBadgeStyle()}>
        <Zap size={12} className="mr-1" />
        {getPremiumTypeDisplay()}
      </Badge>
      <Badge variant="outline" className="bg-yellow-600/20 border-yellow-600 text-yellow-400 font-mono">
        <Timer size={12} className="mr-1" />
        {formatExpiryDate()}
      </Badge>
    </div>
  );
};
