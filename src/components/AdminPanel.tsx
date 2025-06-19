
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, X, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useDonorWallet } from '@/hooks/useDonorWallet';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { isAdminMode, enterAdminMode, exitAdminMode, generateDegenCode } = useAdminMode();
  const { data, updateUserProfile } = useFinancialData();
  const { addFakeDonation } = useDonorWallet();
  const [password, setPassword] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [projectWallet, setProjectWallet] = useState('');
  const [testDonationAmount, setTestDonationAmount] = useState(0);
  const [testWalletAddress, setTestWalletAddress] = useState('');
  const [websiteName, setWebsiteName] = useState('Open Findash');

  const handleLogin = () => {
    if (enterAdminMode(password)) {
      toast({
        title: "Admin Mode Activated",
        description: "You now have admin privileges."
      });
      setPassword('');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin password.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateCode = (duration: '1year' | '5years' | 'lifetime') => {
    const code = generateDegenCode(duration);
    setGeneratedCodes(prev => [code, ...prev.slice(0, 9)]);
    toast({
      title: "Degen Code Generated",
      description: `Code: ${code} (${duration})`
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard."
    });
  };

  const handleAddFakeDonation = () => {
    if (!testWalletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address.",
        variant: "destructive"
      });
      return;
    }

    if (testDonationAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    try {
      const donationData = addFakeDonation(testWalletAddress, testDonationAmount);
      
      // If this is the current user's wallet, update their profile
      if (testWalletAddress === data.userProfile.donorWallet) {
        updateUserProfile({
          totalDonated: donationData.totalDonated
        });
      }

      toast({
        title: "Fake Donation Added",
        description: `Added $${testDonationAmount} to wallet ${testWalletAddress.substring(0, 10)}...`,
      });
      setTestDonationAmount(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fake donation.",
        variant: "destructive"
      });
    }
  };

  const handleTestDonation = () => {
    updateUserProfile({
      totalDonated: (data.userProfile.totalDonated || 0) + testDonationAmount
    });
    toast({
      title: "Test Donation Added",
      description: `Added $${testDonationAmount} to user's donation total.`
    });
    setTestDonationAmount(0);
  };

  const handleResetDonations = () => {
    updateUserProfile({
      totalDonated: 0
    });
    toast({
      title: "Donations Reset",
      description: "User donation total reset to $0."
    });
  };

  const handleUpdateWebsiteName = () => {
    // Store website name in localStorage for now
    localStorage.setItem('websiteName', websiteName);
    toast({
      title: "Website Name Updated",
      description: `Website name changed to: ${websiteName}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase">
            <Shield size={16} className="text-accent" />
            Admin Control Panel
          </DialogTitle>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter admin password to access admin features:
            </div>
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleLogin} className="brutalist-button flex-1">
                Login
              </Button>
              <Button onClick={onClose} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="codes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="codes">Codes</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
              <TabsTrigger value="site">Site</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="codes" className="space-y-4">
              <Card className="bg-background/50 border-2 border-green-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Key size={16} />
                    Degen Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleGenerateCode('1year')}
                      className="brutalist-button bg-blue-600 hover:bg-blue-700 text-xs"
                    >
                      1 Year
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('5years')}
                      className="brutalist-button bg-purple-600 hover:bg-purple-700 text-xs"
                    >
                      5 Years
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('lifetime')}
                      className="brutalist-button bg-yellow-600 hover:bg-yellow-700 text-xs"
                    >
                      Lifetime
                    </Button>
                  </div>
                  
                  {generatedCodes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-mono uppercase">Recent Codes:</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {generatedCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded font-mono text-xs">
                            <span>{code}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donors" className="space-y-4">
              <Card className="bg-background/50 border-2 border-yellow-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Gift size={16} />
                    Donor Management & Testing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-mono uppercase">Project Wallet Address:</label>
                    <Input
                      value={projectWallet}
                      onChange={(e) => setProjectWallet(e.target.value)}
                      placeholder="Enter project wallet address for donations"
                      className="font-mono text-xs"
                    />
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Add Fake Donation (Testing):</div>
                    
                    <div className="space-y-2">
                      <Input
                        value={testWalletAddress}
                        onChange={(e) => setTestWalletAddress(e.target.value)}
                        placeholder="Wallet address to add donation to"
                        className="font-mono text-xs"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={testDonationAmount}
                          onChange={(e) => setTestDonationAmount(Number(e.target.value))}
                          placeholder="Amount"
                          className="font-mono text-xs"
                        />
                        <Button onClick={handleAddFakeDonation} size="sm" className="brutalist-button bg-green-600">
                          <DollarSign size={12} className="mr-1" />
                          Add Fake $
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Current User Testing:</div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono">Current User Total:</span>
                      <span className="text-accent font-mono">${data.userProfile.totalDonated || 0}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={testDonationAmount}
                        onChange={(e) => setTestDonationAmount(Number(e.target.value))}
                        placeholder="Amount"
                        className="font-mono text-xs"
                      />
                      <Button onClick={handleTestDonation} size="sm" className="brutalist-button bg-green-600">
                        <DollarSign size={12} className="mr-1" />
                        Add Test $
                      </Button>
                    </div>
                    
                    <Button onClick={handleResetDonations} size="sm" variant="outline" className="brutalist-button w-full mt-2">
                      Reset User Donations
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-3 border-2 border-border">
                    <h4 className="font-mono font-bold text-xs mb-2 uppercase">Title Hierarchy:</h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-yellow-400">• PATRON ($1000+) - All features + NFT airdrops</div>
                      <div className="text-purple-400">• SUPPORTER ($500+) - Premium themes + early access</div>
                      <div className="text-blue-400">• BACKER ($100+) - Advanced features unlocked</div>
                      <div className="text-green-400">• DONOR ($10+) - Supporter badge + thanks</div>
                      <div className="text-muted-foreground">• USER ($0) - Basic features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="site" className="space-y-4">
              <Card className="bg-background/50 border-2 border-blue-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Globe size={16} />
                    Website Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-mono uppercase">Website Name:</label>
                    <Input
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="Enter website name"
                      className="font-mono text-xs"
                    />
                    <Button onClick={handleUpdateWebsiteName} className="brutalist-button bg-blue-600 hover:bg-blue-700">
                      Update Website Name
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-3 border-2 border-border">
                    <div className="text-xs font-mono">
                      <div className="font-bold mb-1">Current Configuration:</div>
                      <div>• Name: {localStorage.getItem('websiteName') || 'Open Findash'}</div>
                      <div>• Version: 1.0.0</div>
                      <div>• Theme: {data.userProfile.theme || 'default'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={exitAdminMode}
                  variant="outline" 
                  className="brutalist-button flex-1"
                >
                  Exit Admin Mode
                </Button>
                <Button onClick={onClose} variant="outline" className="brutalist-button">
                  <X size={16} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
