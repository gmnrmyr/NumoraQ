
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown, Shield } from "lucide-react";
import { useUserTitle } from "@/hooks/useUserTitle";
import { DonationInterface } from "./DonationInterface";

export const UserTitleBadge = () => {
  const { userTitle, loading } = useUserTitle();
  const [showDonationInterface, setShowDonationInterface] = useState(false);
  
  if (loading) {
    return (
      <Badge variant="outline" className="bg-muted/50 border-border font-mono text-xs">
        <Shield size={10} className="mr-1" />
        Loading...
      </Badge>
    );
  }

  const isDonationTitle = userTitle.level <= 100;

  return (
    <>
      <Badge 
        variant="outline" 
        className={`bg-background/50 border-accent/30 ${userTitle.color} font-mono text-xs cursor-pointer hover:bg-accent/10 transition-colors`}
        onClick={() => setShowDonationInterface(true)}
      >
        {isDonationTitle ? <Crown size={10} className="mr-1" /> : <Shield size={10} className="mr-1" />}
        {userTitle.title}
      </Badge>
      
      <DonationInterface 
        isOpen={showDonationInterface}
        onClose={() => setShowDonationInterface(false)}
      />
    </>
  );
};
