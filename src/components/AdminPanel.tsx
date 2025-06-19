import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, X, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe, Github, Twitter, Link, Image, Upload } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useDonorWallet } from '@/hooks/useDonorWallet';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { isAdminMode, enterAdminMode, exitAdminMode, generateDegenCode, codes, getActiveCodeStats } = useAdminMode();
  const { data, updateUserProfile } = useFinancialData();
  const { addFakeDonation } = useDonorWallet();
  const [password, setPassword] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [projectWallet, setProjectWallet] = useState(localStorage.getItem('projectWallet') || '');
  const [testDonationAmount, setTestDonationAmount] = useState(0);
  const [testWalletAddress, setTestWalletAddress] = useState('');
  
  // CMS Configuration
  const [websiteName, setWebsiteName] = useState(localStorage.getItem('websiteName') || 'Open Findash');
  const [websiteVersion, setWebsiteVersion] = useState(localStorage.getItem('websiteVersion') || '1.0.0');
  const [githubLink, setGithubLink] = useState(localStorage.getItem('githubLink') || '');
  const [twitterLink, setTwitterLink] = useState(localStorage.getItem('twitterLink') || '');
  const [websiteDescription, setWebsiteDescription] = useState(localStorage.getItem('websiteDescription') || 'Open source personal finance dashboard');
  const [supportEmail, setSupportEmail] = useState(localStorage.getItem('supportEmail') || '');
  
  // Logo Management
  const [verticalLogo, setVerticalLogo] = useState(localStorage.getItem('verticalLogo') || '');
  const [horizontalLogo, setHorizontalLogo] = useState(localStorage.getItem('horizontalLogo') || '');
  const [symbolLogo, setSymbolLogo] = useState(localStorage.getItem('symbolLogo') || '');

  const handleLogin = () => {
    if (enterAdminMode(password)) {
      toast({
        title: "CMS/Admin Mode Activated",
        description: "You now have full administrative privileges."
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

  const handleUpdateSiteConfig = () => {
    // Store all configuration in localStorage
    localStorage.setItem('websiteName', websiteName);
    localStorage.setItem('websiteVersion', websiteVersion);
    localStorage.setItem('githubLink', githubLink);
    localStorage.setItem('twitterLink', twitterLink);
    localStorage.setItem('websiteDescription', websiteDescription);
    localStorage.setItem('supportEmail', supportEmail);
    localStorage.setItem('projectWallet', projectWallet);
    localStorage.setItem('verticalLogo', verticalLogo);
    localStorage.setItem('horizontalLogo', horizontalLogo);
    localStorage.setItem('symbolLogo', symbolLogo);
    
    toast({
      title: "Site Configuration Updated",
      description: "All website settings have been saved successfully.",
    });
  };

  const handleLogoUpload = (type: 'vertical' | 'horizontal' | 'symbol', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        switch (type) {
          case 'vertical':
            setVerticalLogo(svgContent);
            break;
          case 'horizontal':
            setHorizontalLogo(svgContent);
            break;
          case 'symbol':
            setSymbolLogo(svgContent);
            break;
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload an SVG file.",
        variant: "destructive"
      });
    }
  };

  const getCurrentConfig = () => ({
    name: localStorage.getItem('websiteName') || 'Open Findash',
    version: localStorage.getItem('websiteVersion') || '1.0.0',
    theme: data.userProfile.theme || 'default',
    github: localStorage.getItem('githubLink') || 'Not set',
    twitter: localStorage.getItem('twitterLink') || 'Not set',
    description: localStorage.getItem('websiteDescription') || 'Open source personal finance dashboard',
    supportEmail: localStorage.getItem('supportEmail') || 'Not set',
    projectWallet: localStorage.getItem('projectWallet') || 'Not set'
  });

  const codeStats = getActiveCodeStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-3 border-border max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase brutalist-heading">
            <Shield size={20} className="text-accent" />
            CMS / Admin Control Panel
          </DialogTitle>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter admin password to access CMS and administrative features:
            </div>
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="font-mono brutalist-input"
            />
            <div className="flex gap-2">
              <Button onClick={handleLogin} className="brutalist-button flex-1">
                Login to CMS
              </Button>
              <Button onClick={onClose} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="site" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="site">CMS</TabsTrigger>
              <TabsTrigger value="branding">Logos</TabsTrigger>
              <TabsTrigger value="codes">Codes</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="site" className="space-y-4">
              <Card className="bg-background/50 border-3 border-accent brutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-accent flex items-center gap-2 text-sm font-mono uppercase brutalist-heading">
                    <Globe size={16} />
                    Website CMS Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Website Name:</label>
                      <Input
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        placeholder="Enter website name"
                        className="font-mono brutalist-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Version:</label>
                      <Input
                        value={websiteVersion}
                        onChange={(e) => setWebsiteVersion(e.target.value)}
                        placeholder="1.0.0"
                        className="font-mono brutalist-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">GitHub Repository:</label>
                      <Input
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="font-mono brutalist-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Twitter/X Link:</label>
                      <Input
                        value={twitterLink}
                        onChange={(e) => setTwitterLink(e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="font-mono brutalist-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Support Email:</label>
                      <Input
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="support@example.com"
                        className="font-mono brutalist-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Project Wallet:</label>
                      <Input
                        value={projectWallet}
                        onChange={(e) => setProjectWallet(e.target.value)}
                        placeholder="Project donation wallet address"
                        className="font-mono brutalist-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-mono uppercase">Website Description:</label>
                    <Textarea
                      value={websiteDescription}
                      onChange={(e) => setWebsiteDescription(e.target.value)}
                      placeholder="Describe your application..."
                      className="font-mono brutalist-input"
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleUpdateSiteConfig} className="brutalist-button w-full">
                    <Settings size={16} className="mr-2" />
                    Update Website Configuration
                  </Button>
                  
                  <div className="bg-muted p-4 border-3 border-border brutalist-card">
                    <h4 className="font-mono font-bold text-xs mb-2 uppercase brutalist-heading">Current Live Configuration:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                      <div>• Name: {getCurrentConfig().name}</div>
                      <div>• Version: {getCurrentConfig().version}</div>
                      <div>• Theme: {getCurrentConfig().theme}</div>
                      <div>• GitHub: {getCurrentConfig().github !== 'Not set' ? '✓ Set' : '✗ Not set'}</div>
                      <div>• Twitter: {getCurrentConfig().twitter !== 'Not set' ? '✓ Set' : '✗ Not set'}</div>
                      <div>• Support: {getCurrentConfig().supportEmail !== 'Not set' ? '✓ Set' : '✗ Not set'}</div>
                      <div>• Wallet: {getCurrentConfig().projectWallet !== 'Not set' ? '✓ Set' : '✗ Not set'}</div>
                      <div className="md:col-span-2">• Description: {getCurrentConfig().description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <Card className="bg-background/50 border-3 border-purple-600 brutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 flex items-center gap-2 text-sm font-mono uppercase brutalist-heading">
                    <Image size={16} />
                    Logo & Branding Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Vertical Logo (SVG):</label>
                      <Input
                        type="file"
                        accept=".svg"
                        onChange={(e) => handleLogoUpload('vertical', e)}
                        className="font-mono brutalist-input"
                      />
                      {verticalLogo && (
                        <div className="w-16 h-20 border-2 border-border bg-muted flex items-center justify-center">
                          <div dangerouslySetInnerHTML={{ __html: verticalLogo }} className="w-12 h-16" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Horizontal Logo (SVG):</label>
                      <Input
                        type="file"
                        accept=".svg"
                        onChange={(e) => handleLogoUpload('horizontal', e)}
                        className="font-mono brutalist-input"
                      />
                      {horizontalLogo && (
                        <div className="w-20 h-16 border-2 border-border bg-muted flex items-center justify-center">
                          <div dangerouslySetInnerHTML={{ __html: horizontalLogo }} className="w-16 h-12" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-mono uppercase">Symbol Only (SVG):</label>
                      <Input
                        type="file"
                        accept=".svg"
                        onChange={(e) => handleLogoUpload('symbol', e)}
                        className="font-mono brutalist-input"
                      />
                      {symbolLogo && (
                        <div className="w-16 h-16 border-2 border-border bg-muted flex items-center justify-center">
                          <div dangerouslySetInnerHTML={{ __html: symbolLogo }} className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 border-3 border-border brutalist-card">
                    <h4 className="font-mono font-bold text-xs mb-2 uppercase brutalist-heading">Logo Usage Guidelines:</h4>
                    <div className="text-xs font-mono space-y-1">
                      <div>• Vertical: Main navigation, mobile headers</div>
                      <div>• Horizontal: Footer, wide headers, banners</div>
                      <div>• Symbol: Favicon, small spaces, loading screens</div>
                      <div>• All logos should be SVG format for best quality</div>
                      <div>• If no custom logo is set, default branding will be used</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="codes" className="space-y-4">
              <Card className="bg-background/50 border-3 border-green-600 brutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase brutalist-heading">
                    <Key size={16} />
                    Degen Code Management & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Code Statistics */}
                  <div className="bg-muted p-4 border-3 border-border brutalist-card">
                    <h4 className="font-mono font-bold text-xs mb-3 uppercase brutalist-heading">Code Analytics:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{codeStats.total}</div>
                        <div className="text-muted-foreground">Total Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{codeStats.active}</div>
                        <div className="text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{codeStats.used}</div>
                        <div className="text-muted-foreground">Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{codeStats.expired}</div>
                        <div className="text-muted-foreground">Expired</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">By Duration:</div>
                        <div className="space-y-1">
                          <div className="text-xs">Lifetime: {codeStats.byDuration.lifetime}</div>
                          <div className="text-xs">5 Years: {codeStats.byDuration.fiveYears}</div>
                          <div className="text-xs">1 Year: {codeStats.byDuration.oneYear}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">By Source:</div>
                        <div className="space-y-1">
                          <div className="text-xs">Admin: {codeStats.bySource.admin}</div>
                          <div className="text-xs">Donation: {codeStats.bySource.donation}</div>
                          <div className="text-xs">Payment: {codeStats.bySource.payment}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Codes */}
                  {codes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-mono uppercase">Recent Codes (Last 10):</div>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {codes.slice(0, 10).map((code, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 border-2 border-border font-mono text-xs brutalist-card">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{code.code}</span>
                              <span className={`px-1 text-xs ${
                                code.duration === 'lifetime' ? 'text-yellow-400' :
                                code.duration === '5years' ? 'text-purple-400' : 'text-blue-400'
                              }`}>
                                {code.duration}
                              </span>
                              {code.grantedVia && (
                                <span className="text-muted-foreground">({code.grantedVia})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {new Date(code.createdAt).toLocaleDateString()}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(code.code)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donors" className="space-y-4">
              <Card className="bg-background/50 border-3 border-yellow-600 brutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm font-mono uppercase brutalist-heading">
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
                      className="font-mono text-xs brutalist-input"
                    />
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground font-mono uppercase mb-2">Add Fake Donation (Testing):</div>
                    
                    <div className="space-y-2">
                      <Input
                        value={testWalletAddress}
                        onChange={(e) => setTestWalletAddress(e.target.value)}
                        placeholder="Wallet address to add donation to"
                        className="font-mono text-xs brutalist-input"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={testDonationAmount}
                          onChange={(e) => setTestDonationAmount(Number(e.target.value))}
                          placeholder="Amount"
                          className="font-mono text-xs brutalist-input"
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
                        className="font-mono text-xs brutalist-input"
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
                  
                  <div className="bg-muted p-3 border-3 border-border brutalist-card">
                    <h4 className="font-mono font-bold text-xs mb-2 uppercase brutalist-heading">Title Hierarchy:</h4>
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
                  Exit CMS/Admin Mode
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
