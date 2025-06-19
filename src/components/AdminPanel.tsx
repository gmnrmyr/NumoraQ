import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, X, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe, Users, TrendingUp, Clock, Trash2 } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useDonorWallet } from '@/hooks/useDonorWallet';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
    isAdminMode, 
    enterAdminMode, 
    exitAdminMode, 
    generateDegenCode, 
    degenCodes,
    getCodeStats,
    deleteCode,
    projectSettings,
    updateProjectSettings
  } = useAdminMode();
  
  const { data, updateUserProfile } = useFinancialData();
  const { addFakeDonation } = useDonorWallet();
  const [password, setPassword] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [testDonationAmount, setTestDonationAmount] = useState(0);
  const [testWalletAddress, setTestWalletAddress] = useState('');
  const [websiteName, setWebsiteName] = useState('Open Findash');
  const [newWalletAddress, setNewWalletAddress] = useState(projectSettings.walletAddress);

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
      title: "Premium Code Generated",
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

  const handleDeleteCode = (codeId: string) => {
    deleteCode(codeId);
    toast({
      title: "Code Deleted",
      description: "Premium code has been removed."
    });
  };

  const handleUpdateWallet = () => {
    updateProjectSettings({ walletAddress: newWalletAddress });
    toast({
      title: "Wallet Updated",
      description: "Project wallet address has been updated."
    });
  };

  const handleToggleCrypto = (enabled: boolean) => {
    updateProjectSettings({ enableCryptoDonations: enabled });
    toast({
      title: enabled ? "Crypto Donations Enabled" : "Crypto Donations Disabled",
      description: `Crypto donations are now ${enabled ? 'active' : 'inactive'}.`
    });
  };

  const handleTogglePayPal = (enabled: boolean) => {
    updateProjectSettings({ enablePayPalDonations: enabled });
    toast({
      title: enabled ? "PayPal Donations Enabled" : "PayPal Donations Disabled", 
      description: `PayPal donations are now ${enabled ? 'active' : 'inactive'}.`
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

  const codeStats = getCodeStats();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase">
            <Shield size={16} className="text-accent" />
            CMS Premium Control Panel
            <Badge variant="outline" className="ml-auto font-mono">v2.0</Badge>
          </DialogTitle>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter admin password to access premium CMS:
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
                Access CMS
              </Button>
              <Button onClick={onClose} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="premium" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="codes">Codes</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="premium" className="space-y-4">
              {/* Premium System Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-green-500/10 border-green-500">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">{codeStats.total}</div>
                    <div className="text-xs text-muted-foreground font-mono">Total Codes</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 font-mono">{codeStats.used}</div>
                    <div className="text-xs text-muted-foreground font-mono">Active Users</div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-500/10 border-yellow-500">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 font-mono">{codeStats.unused}</div>
                    <div className="text-xs text-muted-foreground font-mono">Unused Codes</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/10 border-purple-500">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 font-mono">{codeStats.recentActivations}</div>
                    <div className="text-xs text-muted-foreground font-mono">This Week</div>
                  </CardContent>
                </Card>
              </div>

              {/* Code Generation */}
              <Card className="bg-background/50 border-2 border-green-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Key size={16} />
                    Premium Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleGenerateCode('1year')}
                      className="brutalist-button bg-blue-600 hover:bg-blue-700 text-xs"
                    >
                      1 Year ($99)
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('5years')}
                      className="brutalist-button bg-purple-600 hover:bg-purple-700 text-xs"
                    >
                      5 Years ($299)
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('lifetime')}
                      className="brutalist-button bg-yellow-600 hover:bg-yellow-700 text-xs"
                    >
                      Lifetime ($499)
                    </Button>
                  </div>
                  
                  {generatedCodes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-mono uppercase">Fresh Codes:</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {generatedCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded font-mono text-xs">
                            <span className="text-green-400">{code}</span>
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

            <TabsContent value="wallet" className="space-y-4">
              <Card className="bg-background/50 border-2 border-blue-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Wallet size={16} />
                    Project Wallet Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Current Project Wallet:</Label>
                    <div className="p-3 bg-muted border-2 border-border font-mono text-xs break-all">
                      {projectSettings.walletAddress}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Update Wallet Address:</Label>
                    <Input
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      placeholder="0x... or bc1... or wallet address"
                      className="font-mono text-xs"
                    />
                    <Button onClick={handleUpdateWallet} className="brutalist-button bg-blue-600 hover:bg-blue-700 w-full">
                      Update Project Wallet
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Donation Controls:</div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-mono">Crypto Donations</Label>
                        <div className="text-xs text-muted-foreground">BTC, ETH, USDC, etc.</div>
                      </div>
                      <Switch 
                        checked={projectSettings.enableCryptoDonations}
                        onCheckedChange={handleToggleCrypto}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-mono">PayPal Donations</Label>
                        <div className="text-xs text-muted-foreground">Traditional payments</div>
                      </div>
                      <Switch 
                        checked={projectSettings.enablePayPalDonations}
                        onCheckedChange={handleTogglePayPal}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 border-2 border-border">
                    <div className="text-xs font-mono">
                      <div className="font-bold mb-1">Status:</div>
                      <div>• Crypto: {projectSettings.enableCryptoDonations ? '✅ Active' : '❌ Disabled'}</div>
                      <div>• PayPal: {projectSettings.enablePayPalDonations ? '✅ Active' : '❌ Disabled'}</div>
                      <div>• Wallet: {projectSettings.walletAddress ? '✅ Set' : '❌ Not Set'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="codes" className="space-y-4">
              <Card className="bg-background/50 border-2 border-purple-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Crown size={16} />
                    All Premium Codes ({degenCodes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {degenCodes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Key size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-mono">No premium codes generated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {degenCodes.map((code) => (
                        <div key={code.code} className="flex items-center justify-between bg-muted p-3 rounded border">
                          <div className="space-y-1">
                            <div className="font-mono font-bold text-sm">{code.code}</div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Duration: {code.duration}</span>
                              <span>Created: {formatDate(code.createdAt)}</span>
                              {code.used && code.usedAt && (
                                <span>Used: {formatTimeAgo(code.usedAt)}</span>
                              )}
                            </div>
                            {code.used && code.userEmail && (
                              <div className="text-xs text-green-400 font-mono">
                                User: {code.userEmail}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={code.used ? "default" : "outline"}
                              className={`font-mono text-xs ${code.used ? 'bg-green-600' : 'border-yellow-600 text-yellow-400'}`}
                            >
                              {code.used ? 'Active' : 'Unused'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code.code)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCode(code.code)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="bg-background/50 border-2 border-yellow-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Users size={16} />
                    User Testing & Donation Management
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
