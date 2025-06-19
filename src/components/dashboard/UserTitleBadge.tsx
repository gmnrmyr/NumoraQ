
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Gift, Crown, Star, Zap } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

export const UserTitleBadge = () => {
  const { data, updateUserProfile } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donorWallet, setDonorWallet] = useState(data.userProfile.donorWallet || '');
  const [totalDonated, setTotalDonated] = useState(data.userProfile.totalDonated || 0);

  const getTitleInfo = (amount: number) => {
    if (amount >= 1000) return { title: 'PATRON', icon: Crown, color: 'text-yellow-400' };
    if (amount >= 500) return { title: 'SUPPORTER', icon: Star, color: 'text-purple-400' };
    if (amount >= 100) return { title: 'BACKER', icon: Zap, color: 'text-blue-400' };
    if (amount >= 10) return { title: 'DONOR', icon: Gift, color: 'text-green-400' };
    return { title: 'USER', icon: Info, color: 'text-muted-foreground' };
  };

  const currentTitle = getTitleInfo(totalDonated);
  const TitleIcon = currentTitle.icon;

  const handleSaveDonorInfo = () => {
    updateUserProfile({
      donorWallet,
      totalDonated
    });
    toast({
      title: "Donor info updated!",
      description: "Your donation status has been saved to your profile.",
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Badge 
          variant="outline" 
          className={`cursor-pointer hover:bg-accent/10 transition-colors font-mono ${currentTitle.color}`}
        >
          <TitleIcon size={12} className="mr-1" />
          {currentTitle.title}
        </Badge>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-border">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Gift size={20} />
            Donor Status & Rewards
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono">
            Support Open Findash development and unlock exclusive features!
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="donorWallet" className="font-mono">Donor Wallet Address</Label>
            <Input
              id="donorWallet"
              value={donorWallet}
              onChange={(e) => setDonorWallet(e.target.value)}
              placeholder="0x... or bc1..."
              className="bg-input border-2 border-border font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalDonated" className="font-mono">Total Donated ($USD)</Label>
            <Input
              id="totalDonated"
              type="number"
              value={totalDonated}
              onChange={(e) => setTotalDonated(Number(e.target.value))}
              placeholder="0"
              className="bg-input border-2 border-border font-mono"
            />
          </div>
          
          <div className="bg-muted p-3 border-2 border-border">
            <h4 className="font-mono font-bold text-sm mb-2">TITLE RANKS:</h4>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-yellow-400">• PATRON ($1000+) - All features + NFT airdrops</div>
              <div className="text-purple-400">• SUPPORTER ($500+) - Premium themes + early access</div>
              <div className="text-blue-400">• BACKER ($100+) - Advanced features unlocked</div>
              <div className="text-green-400">• DONOR ($10+) - Supporter badge + thanks</div>
              <div className="text-muted-foreground">• USER ($0) - Basic features</div>
            </div>
          </div>
          
          <Button onClick={handleSaveDonorInfo} className="w-full brutalist-button">
            Save Donor Information
          </Button>
          
          <div className="text-xs text-center text-muted-foreground font-mono">
            Donations help fund development, hosting, and new features!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
