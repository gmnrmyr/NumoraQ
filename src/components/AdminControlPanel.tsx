
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, X, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe, Github, ExternalLink } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useDonorWallet } from '@/hooks/useDonorWallet';
import { toast } from '@/hooks/use-toast';

interface AdminControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SiteConfig {
  websiteName: string;
  version: string;
  githubLink: string;
  socialLinks: {
    twitter: string;
    discord: string;
    telegram: string;
  };
  description: string;
  tagline: string;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({ isOpen, onClose }) => {
  const { isAdminMode, enterAdminMode, exitAdminMode, generateDegenCode, degenCodes } = useAdminMode();
  const { data, updateUserProfile } = useFinancialData();
  const { addFakeDonation } = useDonorWallet();
  const [password, setPassword] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [testDonationAmount, setTestDonationAmount] = useState(0);
  const [testWalletAddress, setTestWalletAddress] = useState('');
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    websiteName: 'Open Findash',
    version: '1.0.0',
    githubLink: '',
    socialLinks: {
      twitter: '',
      discord: '',
      telegram: ''
    },
    description: 'Open-source personal finance dashboard',
    tagline: 'Take control of your financial future'
  });

  useEffect(() => {
    // Load site config from localStorage
    const savedConfig = localStorage.getItem('siteConfig');
    if (savedConfig) {
      try {
        setSiteConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading site config:', error);
      }
    }
  }, []);

  const handleLogin = () => {
    if (enterAdminMode(password)) {
      toast({
        title: "Admin Mode Activated",
        description: "You now have access to CMS features."
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
      title: "Code Generated",
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
      
      if (testWalletAddress === data.userProfile.donorWallet) {
        updateUserProfile({
          totalDonated: donationData.totalDonated
        });
      }

      toast({
        title: "Test Donation Added",
        description: `Added $${testDonationAmount} to wallet ${testWalletAddress.substring(0, 10)}...`,
      });
      setTestDonationAmount(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add test donation.",
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

  const handleUpdateSiteConfig = () => {
    localStorage.setItem('siteConfig', JSON.stringify(siteConfig));
    toast({
      title: "Site Configuration Updated",
      description: "All settings have been saved successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase">
            <Shield size={16} className="text-accent" />
            CMS / Admin Control Panel
          </DialogTitle>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter admin password to access CMS features:
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="codes">Codes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
              <TabsTrigger value="site">Site Config</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="codes" className="space-y-4">
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
                          <div key={index} className="flex items-center justify-between bg-muted p-2 border-2 border-border font-mono text-xs">
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

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-mono uppercase">All Generated Codes:</div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {degenCodes.map((codeData, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 border-2 border-border font-mono text-xs">
                          <div className="flex-1">
                            <div className="font-bold">{codeData.code}</div>
                            <div className="text-muted-foreground">
                              {codeData.duration} • {codeData.used ? `Used by ${codeData.usedBy || 'Unknown'}` : 'Available'}
                            </div>
                            <div className="text-xs">Created: {new Date(codeData.createdAt).toLocaleDateString()}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(codeData.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-background/50 border-2 border-blue-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-400 text-sm font-mono">Total Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">{degenCodes.length}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-2 border-green-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 text-sm font-mono">Used Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">{degenCodes.filter(c => c.used).length}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/50 border-2 border-orange-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-orange-400 text-sm font-mono">Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">{degenCodes.filter(c => !c.used).length}</div>
                  </CardContent>
                </Card>
              </div>
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
                  <div className="border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Add Test Donation:</div>
                    
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
                          Add Test $
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Website Name:</label>
                      <Input
                        value={siteConfig.websiteName}
                        onChange={(e) => setSiteConfig({...siteConfig, websiteName: e.target.value})}
                        placeholder="Enter website name"
                        className="font-mono text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Version:</label>
                      <Input
                        value={siteConfig.version}
                        onChange={(e) => setSiteConfig({...siteConfig, version: e.target.value})}
                        placeholder="e.g., 1.0.0"
                        className="font-mono text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">GitHub Link:</label>
                      <Input
                        value={siteConfig.githubLink}
                        onChange={(e) => setSiteConfig({...siteConfig, githubLink: e.target.value})}
                        placeholder="https://github.com/user/repo"
                        className="font-mono text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Tagline:</label>
                      <Input
                        value={siteConfig.tagline}
                        onChange={(e) => setSiteConfig({...siteConfig, tagline: e.target.value})}
                        placeholder="Enter site tagline"
                        className="font-mono text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Twitter:</label>
                      <Input
                        value={siteConfig.socialLinks.twitter}
                        onChange={(e) => setSiteConfig({...siteConfig, socialLinks: {...siteConfig.socialLinks, twitter: e.target.value}})}
                        placeholder="@username"
                        className="font-mono text-xs"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Discord:</label>
                      <Input
                        value={siteConfig.socialLinks.discord}
                        onChange={(e) => setSiteConfig({...siteConfig, socialLinks: {...siteConfig.socialLinks, discord: e.target.value}})}
                        placeholder="Discord invite link"
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-mono uppercase">Description:</label>
                    <textarea
                      value={siteConfig.description}
                      onChange={(e) => setSiteConfig({...siteConfig, description: e.target.value})}
                      placeholder="Enter site description"
                      className="w-full p-2 bg-input border-2 border-border font-mono text-xs h-20 resize-none"
                    />
                  </div>
                  
                  <Button onClick={handleUpdateSiteConfig} className="brutalist-button bg-blue-600 hover:bg-blue-700">
                    <Settings size={16} className="mr-2" />
                    Update Configuration
                  </Button>
                  
                  <div className="bg-muted p-3 border-2 border-border">
                    <div className="text-xs font-mono">
                      <div className="font-bold mb-1">Current Configuration:</div>
                      <div>• Name: {siteConfig.websiteName}</div>
                      <div>• Version: {siteConfig.version}</div>
                      <div>• Theme: {data.userProfile.theme || 'default'}</div>
                      {siteConfig.githubLink && (
                        <div className="flex items-center gap-1">
                          • GitHub: 
                          <a href={siteConfig.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                            <Github size={10} />
                            View Repository
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
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
