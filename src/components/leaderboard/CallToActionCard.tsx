
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const CallToActionCard = () => {
  const navigate = useNavigate();

  const handleInviteFriends = () => {
    navigator.clipboard.writeText('https://numoraq.com');
    toast({
      title: "Link Copied!",
              description: "Numoraq.com has been copied to your clipboard",
    });
  };

  const handleSupportPlatform = () => {
    navigate('/donation');
  };

  return (
    <Card className="brutalist-card border-accent bg-accent/5">
      <CardContent className="p-6 text-center space-y-4">
        <h3 className="text-lg font-bold font-mono text-accent">CLIMB THE RANKS</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Stay engaged, support the platform, and help grow our community to earn more fidelity points!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleSupportPlatform}
            className="brutalist-button bg-accent text-accent-foreground"
          >
            <Gift size={16} className="mr-2" />
            Support Platform
          </Button>
          <Button 
            onClick={handleInviteFriends}
            variant="outline" 
            className="brutalist-button"
          >
            <Users size={16} className="mr-2" />
            Invite Friends
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
