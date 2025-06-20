
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
import { toast } from "@/hooks/use-toast";

export const UserTitleBadge = () => {
  const { data, updateUserProfile } = useFinancialData();
  const { fetchDonationData, isLoading } = useDonorWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donorWallet, setDonorWallet] = useState(data.userProfile.donorWallet || '');

  const getTitleInfo = (amount: number) => {
    if (amount >= 1000) return { title: 'PATRON', icon: Crown, color: 'text-yellow-400' };
    if (amount >= 500) return { title: 'SUPPORTER', icon: Star, color: 'text-purple-400' };
    if (amount >= 100) return { title: 'BACKER', icon: Zap, color: 'text-blue-400' };
    if (amount >= 10) return { title: 'DONOR', icon: Gift, color: 'text-green-400' };
    return { title: 'USER', icon: Info, color: 'text-muted-foreground' };
  };

  const currentTitle = getTitleInfo(data.userProfile.totalDonated || 0);
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
    toast({
      title: "Crypto Payment",
      description: "Crypto payment integration coming soon! Use the wallet address feature for now.",
    });
  };

  const handleDonateWithPayPal = () => {
    toast({
      title: "PayPal Payment",
      description: "PayPal integration coming soon! Contact support for donation instructions.",
    });
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
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Gift size={20} />
            Donor Status & Rewards
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
                <h4 className="font-mono font-bold text-sm">CURRENT STATUS:</h4>
                <span className={`font-mono text-sm ${currentTitle.color}`}>
                  ${data.userProfile.totalDonated || 0}
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-yellow-400">• PATRON ($1000+) - All features + NFT airdrops</div>
                <div className="text-purple-400">• SUPPORTER ($500+) - Premium themes + early access</div>
                <div className="text-blue-400">• BACKER ($100+) - Advanced features unlocked</div>
                <div className="text-green-400">• DONOR ($10+) - Supporter badge + thanks</div>
                <div className="text-muted-foreground">• USER ($0) - Basic features</div>
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
