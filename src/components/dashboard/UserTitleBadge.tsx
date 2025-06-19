
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Star, Gift, Coins, Info } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

interface UserTitleBadgeProps {
  userName: string;
}

export const UserTitleBadge: React.FC<UserTitleBadgeProps> = ({ userName }) => {
  const { data, updateUserProfile } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donorWallet, setDonorWallet] = useState(data.userProfile?.donorWallet || '');
  const [donationAmount, setDonationAmount] = useState(data.userProfile?.totalDonated || 0);

  const getTitleData = (amount: number) => {
    if (amount >= 1000) return { title: 'Diamond Supporter', icon: Crown, color: 'bg-gradient-to-r from-cyan-400 to-blue-600' };
    if (amount >= 500) return { title: 'Gold Supporter', icon: Star, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
    if (amount >= 100) return { title: 'Silver Supporter', icon: Gift, color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
    if (amount >= 25) return { title: 'Bronze Supporter', icon: Coins, color: 'bg-gradient-to-r from-orange-600 to-red-600' };
    return { title: 'Community Member', icon: Star, color: 'bg-gradient-to-r from-green-400 to-blue-500' };
  };

  const titleData = getTitleData(donationAmount);
  const TitleIcon = titleData.icon;

  const handleSaveDonorInfo = () => {
    updateUserProfile({
      donorWallet,
      totalDonated: donationAmount
    });
    setIsDialogOpen(false);
    toast({
      title: "Donor info updated",
      description: `Your title has been updated to ${titleData.title}`
    });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Badge className={`${titleData.color} text-white cursor-pointer hover:opacity-80 transition-opacity font-mono`}>
            <TitleIcon size={12} className="mr-1" />
            {titleData.title}
            <Info size={10} className="ml-1" />
          </Badge>
        </DialogTrigger>
        <DialogContent className="bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase flex items-center gap-2">
              <Crown size={20} />
              Support Open Findash
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              <p className="mb-2">🎯 <strong>Support the project and rank up!</strong></p>
              <ul className="text-xs space-y-1">
                <li>• Donate to fund development</li>
                <li>• Receive exclusive NFT airdrops</li>
                <li>• Unlock premium themes & features</li>
                <li>• Get priority support</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold uppercase">Donor Wallet Address</label>
                <Input
                  value={donorWallet}
                  onChange={(e) => setDonorWallet(e.target.value)}
                  placeholder="0x... or crypto address"
                  className="bg-input border-2 border-border font-mono text-xs"
                />
              </div>
              
              <div>
                <label className="text-xs font-mono font-bold uppercase">Total Donated ($USD)</label>
                <Input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-input border-2 border-border font-mono text-xs"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-3 rounded">
              <strong>Title Tiers:</strong><br />
              • $0+ Community Member<br />
              • $25+ Bronze Supporter<br />
              • $100+ Silver Supporter<br />
              • $500+ Gold Supporter<br />
              • $1000+ Diamond Supporter
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveDonorInfo} className="flex-1 brutalist-button">
                Update Title
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="brutalist-button">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
