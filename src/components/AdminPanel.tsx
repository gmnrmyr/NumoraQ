
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Key, X, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useUserPoints } from '@/hooks/useUserPoints';
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
    cmsSettings,
    updateCMSSetting,
    updateMultipleCMSSettings,
    premiumCodes,
    generatePremiumCode,
    deletePremiumCode,
    getCodeStats,
    premiumCodesLoading
  } = useAdminMode();
  
  const { addManualPoints } = useUserPoints();
  const [password, setPassword] = useState('');
  const [localSettings, setLocalSettings] = useState({
    website_name: '',
    project_wallet: '',
    donation_goal: 0
  });

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

  const handleGenerateCode = async (duration: '1year' | '5years' | 'lifetime') => {
    const code = await generatePremiumCode(duration);
    if (code) {
      copyToClipboard(code);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard."
    });
  };

  const handleDeleteCode = async (codeId: string) => {
    await deletePremiumCode(codeId);
  };

  const handleUpdateWebsiteName = async () => {
    if (localSettings.website_name.trim()) {
      await updateCMSSetting('website_name', localSettings.website_name);
      setLocalSettings(prev => ({ ...prev, website_name: '' }));
    }
  };

  const handleUpdateProjectWallet = async () => {
    if (localSettings.project_wallet.trim()) {
      await updateCMSSetting('project_wallet', localSettings.project_wallet);
      setLocalSettings(prev => ({ ...prev, project_wallet: '' }));
    }
  };

  const handleUpdateDonationGoal = async () => {
    if (localSettings.donation_goal > 0) {
      await updateCMSSetting('donation_goal', localSettings.donation_goal);
      setLocalSettings(prev => ({ ...prev, donation_goal: 0 }));
    }
  };

  const codeStats = getCodeStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-4xl max-h-[80vh] overflow-y-auto">
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
          <Tabs defaultValue="premium" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="site">Site</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="premium" className="space-y-4">
              <Card className="bg-background/50 border-2 border-green-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase">
                    <Crown size={16} />
                    Premium Code Management
                  </CardTitle>
                  <div className="flex gap-4 text-xs font-mono">
                    <span>Total: <Badge variant="outline">{codeStats.total}</Badge></span>
                    <span>Active: <Badge variant="outline" className="border-green-500">{codeStats.active}</Badge></span>
                    <span>Used: <Badge variant="outline" className="border-red-500">{codeStats.used}</Badge></span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleGenerateCode('1year')}
                      className="brutalist-button bg-blue-600 hover:bg-blue-700 text-xs"
                      disabled={premiumCodesLoading}
                    >
                      Generate 1 Year
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('5years')}
                      className="brutalist-button bg-purple-600 hover:bg-purple-700 text-xs"
                      disabled={premiumCodesLoading}
                    >
                      Generate 5 Years
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCode('lifetime')}
                      className="brutalist-button bg-yellow-600 hover:bg-yellow-700 text-xs"
                      disabled={premiumCodesLoading}
                    >
                      Generate Lifetime
                    </Button>
                  </div>
                  
                  {premiumCodes.length > 0 && (
                    <div className="max-h-64 overflow-y-auto border border-border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-mono text-xs">Code</TableHead>
                            <TableHead className="font-mono text-xs">Duration</TableHead>
                            <TableHead className="font-mono text-xs">Status</TableHead>
                            <TableHead className="font-mono text-xs">Used By</TableHead>
                            <TableHead className="font-mono text-xs">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {premiumCodes.map((code) => (
                            <TableRow key={code.id}>
                              <TableCell className="font-mono text-xs">{code.code}</TableCell>
                              <TableCell className="font-mono text-xs">{code.code_type}</TableCell>
                              <TableCell>
                                {code.used_by ? (
                                  <Badge variant="outline" className="border-red-500 text-red-500">
                                    <XCircle size={12} className="mr-1" />
                                    Used
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-green-500 text-green-500">
                                    <CheckCircle size={12} className="mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {code.used_by ? (
                                  <div>
                                    <div>{code.user_email || 'Unknown'}</div>
                                    <div className="text-muted-foreground">
                                      {code.used_at ? new Date(code.used_at).toLocaleDateString() : ''}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(code.code)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy size={12} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteCode(code.id)}
                                    className="h-6 w-6 p-0 hover:bg-red-50"
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                    Project Wallet Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Current Project Wallet:</Label>
                    <div className="font-mono text-xs p-2 bg-muted rounded border">
                      {cmsSettings.project_wallet}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Update Project Wallet:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={localSettings.project_wallet}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_wallet: e.target.value }))}
                        className="font-mono text-xs"
                        placeholder="0x..."
                      />
                      <Button onClick={handleUpdateProjectWallet} className="brutalist-button">
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-mono uppercase">Crypto Donations</Label>
                      <Switch
                        checked={cmsSettings.crypto_donations_enabled}
                        onCheckedChange={(checked) => updateCMSSetting('crypto_donations_enabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-mono uppercase">PayPal Donations</Label>
                      <Switch
                        checked={cmsSettings.paypal_donations_enabled}
                        onCheckedChange={(checked) => updateCMSSetting('paypal_donations_enabled', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Current Goal: ${cmsSettings.donation_goal?.toLocaleString()}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={localSettings.donation_goal || ''}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, donation_goal: Number(e.target.value) }))}
                        className="font-mono text-xs"
                        placeholder="10000"
                      />
                      <Button onClick={handleUpdateDonationGoal} className="brutalist-button">
                        Update Goal
                      </Button>
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
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Current Website Name:</Label>
                    <div className="font-mono text-xs p-2 bg-muted rounded border">
                      {cmsSettings.website_name}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-mono uppercase">Update Website Name:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={localSettings.website_name}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, website_name: e.target.value }))}
                        placeholder="Enter new website name"
                        className="font-mono text-xs"
                      />
                      <Button onClick={handleUpdateWebsiteName} className="brutalist-button">
                        Update Name
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 border-2 border-border rounded">
                    <div className="text-xs font-mono">
                      <div className="font-bold mb-1">Current Configuration:</div>
                      <div>• Name: {cmsSettings.website_name}</div>
                      <div>• Wallet: {cmsSettings.project_wallet}</div>
                      <div>• Crypto: {cmsSettings.crypto_donations_enabled ? 'Enabled' : 'Disabled'}</div>
                      <div>• PayPal: {cmsSettings.paypal_donations_enabled ? 'Enabled' : 'Disabled'}</div>
                      <div>• Goal: ${cmsSettings.donation_goal?.toLocaleString()}</div>
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
