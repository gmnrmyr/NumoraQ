
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Gift, Crown, Star, Zap, CreditCard, Wallet, RefreshCw } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useDonorWallet } from "@/hooks/useDonorWallet";
import { useUserTitles } from "@/hooks/useUserTitles";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const UserTitleBadge = () => {
  const { data, updateUserProfile } = useFinancialData();
  const { fetchDonationData, isLoading } = useDonorWallet();
  const { userTitle } = useUserTitles();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donorWallet, setDonorWallet] = useState(data.userProfile.donorWallet || '');

  const getTitleInfo = (title: string) => {
    const titleMap: Record<string, { icon: any, color: string }> = {
      'NEWBIE': { icon: Info, color: 'text-gray-400' },
      'BEGINNER': { icon: Info, color: 'text-green-400' },
      'APPRENTICE': { icon: Zap, color: 'text-blue-400' },
      'TRACKER': { icon: Star, color: 'text-purple-400' },
      'ANALYST': { icon: Crown, color: 'text-yellow-400' },
      'STRATEGIST': { icon: Crown, color: 'text-orange-400' },
      'EXPERT': { icon: Crown, color: 'text-red-400' },
      'MASTER': { icon: Crown, color: 'text-pink-400' },
      'LEGEND': { icon: Crown, color: 'text-indigo-400' },
      'MATRIX LORD': { icon: Crown, color: 'text-cyan-400' },
      'DEGEN OVERLORD': { icon: Crown, color: 'text-emerald-400' }
    };
    return titleMap[title] || { icon: Info, color: 'text-muted-foreground' };
  };

  const currentTitle = getTitleInfo(userTitle);
  const TitleIcon = currentTitle.icon;

  const handleFetchDonations = async () => {
    if (!donorWallet.trim()) {
      toast({
        title: "Wallet Required",
        description: "Please enter a wallet address first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const donationData = await fetchDonationData(donorWallet);
      updateUserProfile({
        donorWallet,
        totalDonated: donationData.totalDonated
      });
      toast({
        title: "Donations Fetched!",
        description: `Found $${donationData.totalDonated} in donations. Title updated!`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Could not fetch donation data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveDonorInfo = () => {
    updateUserProfile({
      donorWallet
    });
    toast({
      title: "Donor wallet saved!",
      description: "Your wallet address has been saved to your profile.",
    });
  };

  const handleDonateWithCrypto = () => {
    navigate('/donation');
    setIsDialogOpen(false);
  };

  const handleDonateWithPayPal = () => {
    navigate('/donation');
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
          {userTitle}
        </Badge>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Gift size={20} />
            User Title & Rewards
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
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
            
            <div className="flex gap-2">
              <Button 
                onClick={handleFetchDonations} 
                disabled={isLoading}
                className="brutalist-button flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <RefreshCw size={16} className="mr-2" />
                )}
                Fetch Donations
              </Button>
              <Button onClick={handleSaveDonorInfo} variant="outline" className="brutalist-button">
                Save
              </Button>
            </div>
            
            <div className="bg-muted p-3 border-2 border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-mono font-bold text-sm">CURRENT TITLE:</h4>
                <span className={`font-mono text-sm ${currentTitle.color}`}>
                  {userTitle}
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-emerald-400">• DEGEN OVERLORD (64000+)</div>
                <div className="text-cyan-400">• MATRIX LORD (32000+)</div>
                <div className="text-indigo-400">• LEGEND (16000+)</div>
                <div className="text-pink-400">• MASTER (8000+)</div>
                <div className="text-red-400">• EXPERT (4000+)</div>
                <div className="text-orange-400">• STRATEGIST (2000+)</div>
                <div className="text-yellow-400">• ANALYST (1000+)</div>
                <div className="text-purple-400">• TRACKER (600+)</div>
                <div className="text-blue-400">• APPRENTICE (300+)</div>
                <div className="text-green-400">• BEGINNER (100+)</div>
                <div className="text-gray-400">• NEWBIE (0+)</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="donate" className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Choose your preferred donation method:
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleDonateWithCrypto}
                className="w-full brutalist-button bg-orange-600 hover:bg-orange-700"
              >
                <Wallet size={16} className="mr-2" />
                Donate with Crypto
              </Button>
              
              <Button 
                onClick={handleDonateWithPayPal}
                className="w-full brutalist-button bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard size={16} className="mr-2" />
                Donate with PayPal
              </Button>
            </div>
            
            <div className="bg-muted p-3 border-2 border-border">
              <div className="text-xs font-mono">
                <div className="font-bold mb-1">Benefits of donating:</div>
                <div>• Unlock premium themes</div>
                <div>• Get early access to features</div>
                <div>• Receive NFT airdrops</div>
                <div>• Support open-source development</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-center text-muted-foreground font-mono">
          Donations help fund development, hosting, and new features!
        </div>
      </DialogContent>
    </Dialog>
  );
};
