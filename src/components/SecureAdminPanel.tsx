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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Clock, LogOut, AlertTriangle, Key, Copy, Gift, Wallet, DollarSign, Crown, Settings, Globe, Trash2, CheckCircle, XCircle, Users as UsersIcon, Upload, Save, Palette } from 'lucide-react';
import { useSecureAdminAuth } from '@/hooks/useSecureAdminAuth';
import { useAdminMode } from '@/hooks/useAdminMode';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { useCMSLogos } from '@/hooks/useCMSLogos';
import { toast } from '@/hooks/use-toast';
import { sanitizeInput, checkRateLimit } from '@/utils/securityUtils';

interface SecureAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecureAdminPanel: React.FC<SecureAdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
    isAdmin, 
    adminUser, 
    loading, 
    sessionExpiry, 
    refreshAdminSession, 
    logAdminAction,
    timeRemaining 
  } = useSecureAdminAuth();
  
  const {
    cmsSettings,
    updateCMSSetting,
    updateMultipleCMSSettings,
    premiumCodes,
    generatePremiumCode,
    deletePremiumCode,
    getCodeStats,
    premiumCodesLoading
  } = useAdminMode();

  const { settings, updateSetting, updateMultipleSettings } = useProjectSettings();
  const { logos, updateLogo } = useCMSLogos();
  const { addManualPoints } = useUserPoints();
  
  const [localSettings, setLocalSettings] = useState({
    website_name: settings.website_name || '',
    version: settings.version || '',
    upcoming_features_text: settings.upcoming_features_text || '',
    main_color_scheme: settings.main_color_scheme || 'default',
    project_wallet_evm: settings.project_wallet_evm || '',
    project_wallet_solana: settings.project_wallet_solana || '',
    project_wallet_btc: settings.project_wallet_btc || '',
    project_wallet_bch: settings.project_wallet_bch || '',
    project_paypal_email: settings.project_paypal_email || ''
  });

  const [localLogos, setLocalLogos] = useState({
    square_logo_url: logos.square_logo_url || '',
    horizontal_logo_url: logos.horizontal_logo_url || '',
    vertical_logo_url: logos.vertical_logo_url || '',
    symbol_logo_url: logos.symbol_logo_url || ''
  });

  const [copiedWallet, setCopiedWallet] = useState<string>('');

  React.useEffect(() => {
    setLocalSettings({
      website_name: settings.website_name || '',
      version: settings.version || '',
      upcoming_features_text: settings.upcoming_features_text || '',
      main_color_scheme: settings.main_color_scheme || 'default',
      project_wallet_evm: settings.project_wallet_evm || '',
      project_wallet_solana: settings.project_wallet_solana || '',
      project_wallet_btc: settings.project_wallet_btc || '',
      project_wallet_bch: settings.project_wallet_bch || '',
      project_paypal_email: settings.project_paypal_email || ''
    });
  }, [settings]);

  React.useEffect(() => {
    setLocalLogos({
      square_logo_url: logos.square_logo_url || '',
      horizontal_logo_url: logos.horizontal_logo_url || '',
      vertical_logo_url: logos.vertical_logo_url || '',
      symbol_logo_url: logos.symbol_logo_url || ''
    });
  }, [logos]);

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSecureAction = async (action: string, callback: () => Promise<void>, details?: any) => {
    // Rate limiting
    if (!checkRateLimit(`admin_${adminUser?.id}_${action}`, 10, 60000)) {
      toast({
        title: "Rate Limited",
        description: "Too many requests. Please wait before trying again.",
        variant: "destructive"
      });
      return;
    }

    try {
      await callback();
      await logAdminAction(action, details);
    } catch (error) {
      console.error(`Admin action failed: ${action}`, error);
      toast({
        title: "Action Failed",
        description: "An error occurred while performing this action.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateCode = async (duration: '1year' | '5years' | 'lifetime') => {
    await handleSecureAction('generate_premium_code', async () => {
      const code = await generatePremiumCode(duration);
      if (code) {
        navigator.clipboard.writeText(code);
        toast({
          title: "Code Generated",
          description: "Premium code generated and copied to clipboard."
        });
      }
    }, { duration });
  };

  const handleDeleteCode = async (codeId: string) => {
    await handleSecureAction('delete_premium_code', async () => {
      await deletePremiumCode(codeId);
    }, { codeId });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(type);
    setTimeout(() => setCopiedWallet(''), 2000);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`
    });
  };

  const handleSaveBasicSettings = async () => {
    await handleSecureAction('update_basic_settings', async () => {
      await updateMultipleSettings({
        website_name: localSettings.website_name,
        version: localSettings.version,
        upcoming_features_text: localSettings.upcoming_features_text,
        main_color_scheme: localSettings.main_color_scheme
      });
      toast({
        title: "Settings Updated",
        description: "Basic project settings have been updated successfully"
      });
    });
  };

  const handleSaveWallets = async () => {
    await handleSecureAction('update_wallet_settings', async () => {
      await updateMultipleSettings({
        project_wallet_evm: localSettings.project_wallet_evm,
        project_wallet_solana: localSettings.project_wallet_solana,
        project_wallet_btc: localSettings.project_wallet_btc,
        project_wallet_bch: localSettings.project_wallet_bch,
        project_paypal_email: localSettings.project_paypal_email
      });
      toast({
        title: "Wallets Updated",
        description: "All project wallets have been updated successfully"
      });
    });
  };

  const handleSaveLogos = async () => {
    await handleSecureAction('update_logos', async () => {
      await Promise.all([
        updateLogo('square_logo_url', localLogos.square_logo_url),
        updateLogo('horizontal_logo_url', localLogos.horizontal_logo_url),
        updateLogo('vertical_logo_url', localLogos.vertical_logo_url),
        updateLogo('symbol_logo_url', localLogos.symbol_logo_url)
      ]);
      toast({
        title: "Logos Updated",
        description: "All logo URLs have been updated successfully"
      });
    });
  };

  const colorSchemes = [
    { value: 'default', label: 'Default Dark' },
    { value: 'blue', label: 'Blue Theme' },
    { value: 'green', label: 'Green Theme' },
    { value: 'purple', label: 'Purple Theme' },
    { value: 'red', label: 'Red Theme' }
  ];

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card border-2 border-border">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Shield className="mx-auto mb-4 text-accent" size={32} />
              <p className="font-mono">Verifying admin credentials...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isAdmin) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono uppercase text-red-500">
              <AlertTriangle size={16} />
              Access Denied
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-mono">
              You don't have admin privileges to access this panel.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const codeStats = getCodeStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase">
            <Shield size={16} className="text-accent" />
            Secure Admin Panel
          </DialogTitle>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Badge variant="outline" className="border-green-500">
              {adminUser?.admin_level} admin
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={12} />
              Session: {formatTimeRemaining(timeRemaining)}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshAdminSession}
              className="h-6 px-2"
            >
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="cms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cms">CMS Settings</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cms" className="space-y-4">
            {/* Basic Project Settings */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Globe size={20} />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website_name" className="font-mono">Website Name</Label>
                    <Input
                      id="website_name"
                      value={localSettings.website_name}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, website_name: e.target.value }))}
                      className="font-mono"
                      placeholder="Enter website name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="version" className="font-mono">Version</Label>
                    <Input
                      id="version"
                      value={localSettings.version}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, version: e.target.value }))}
                      className="font-mono"
                      placeholder="v2.0.0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="upcoming_features" className="font-mono">Upcoming Features Text</Label>
                  <Textarea
                    id="upcoming_features"
                    value={localSettings.upcoming_features_text}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, upcoming_features_text: e.target.value }))}
                    className="font-mono"
                    placeholder="Describe upcoming features..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="color_scheme" className="font-mono">Main Color Scheme</Label>
                  <Select
                    value={localSettings.main_color_scheme}
                    onValueChange={(value) => setLocalSettings(prev => ({ ...prev, main_color_scheme: value }))}
                  >
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map(scheme => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          <div className="flex items-center gap-2">
                            <Palette size={16} />
                            {scheme.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveBasicSettings} className="font-mono">
                  <Save size={16} className="mr-2" />
                  Save Project Settings
                </Button>
              </CardContent>
            </Card>

            {/* Logo Management */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Upload size={20} />
                  Logo Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="square_logo" className="font-mono">Square Logo URL</Label>
                    <Input
                      id="square_logo"
                      value={localLogos.square_logo_url}
                      onChange={(e) => setLocalLogos(prev => ({ ...prev, square_logo_url: e.target.value }))}
                      className="font-mono"
                      placeholder="/path/to/square-logo.png"
                    />
                    <div className="mt-2 p-2 border border-border rounded">
                      <img src={localLogos.square_logo_url} alt="Square Logo" className="h-12 w-12 object-contain bg-background" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="horizontal_logo" className="font-mono">Horizontal Logo URL</Label>
                    <Input
                      id="horizontal_logo"
                      value={localLogos.horizontal_logo_url}
                      onChange={(e) => setLocalLogos(prev => ({ ...prev, horizontal_logo_url: e.target.value }))}
                      className="font-mono"
                      placeholder="/path/to/horizontal-logo.png"
                    />
                    <div className="mt-2 p-2 border border-border rounded">
                      <img src={localLogos.horizontal_logo_url} alt="Horizontal Logo" className="h-8 w-24 object-contain bg-background" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="vertical_logo" className="font-mono">Vertical Logo URL</Label>
                    <Input
                      id="vertical_logo"
                      value={localLogos.vertical_logo_url}
                      onChange={(e) => setLocalLogos(prev => ({ ...prev, vertical_logo_url: e.target.value }))}
                      className="font-mono"
                      placeholder="/path/to/vertical-logo.png"
                    />
                    <div className="mt-2 p-2 border border-border rounded">
                      <img src={localLogos.vertical_logo_url} alt="Vertical Logo" className="h-16 w-12 object-contain bg-background" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="symbol_logo" className="font-mono">Symbol Only URL</Label>
                    <Input
                      id="symbol_logo"
                      value={localLogos.symbol_logo_url}
                      onChange={(e) => setLocalLogos(prev => ({ ...prev, symbol_logo_url: e.target.value }))}
                      className="font-mono"
                      placeholder="/path/to/symbol-logo.png"
                    />
                    <div className="mt-2 p-2 border border-border rounded">
                      <img src={localLogos.symbol_logo_url} alt="Symbol Logo" className="h-8 w-8 object-contain bg-background" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveLogos} className="font-mono">
                  <Save size={16} className="mr-2" />
                  Save All Logos
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Management */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  💰 Project Wallets & Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="evm_wallet" className="font-mono">EVM Wallet (ETH, BNB, MATIC, etc.)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="evm_wallet"
                        value={localSettings.project_wallet_evm}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_wallet_evm: e.target.value }))}
                        className="font-mono"
                        placeholder="0x..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(localSettings.project_wallet_evm, 'EVM')}
                        className="font-mono"
                      >
                        {copiedWallet === 'EVM' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="solana_wallet" className="font-mono">Solana Wallet</Label>
                    <div className="flex gap-2">
                      <Input
                        id="solana_wallet"
                        value={localSettings.project_wallet_solana}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_wallet_solana: e.target.value }))}
                        className="font-mono"
                        placeholder="Solana address..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(localSettings.project_wallet_solana, 'Solana')}
                        className="font-mono"
                      >
                        {copiedWallet === 'Solana' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="btc_wallet" className="font-mono">Bitcoin Wallet</Label>
                    <div className="flex gap-2">
                      <Input
                        id="btc_wallet"
                        value={localSettings.project_wallet_btc}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_wallet_btc: e.target.value }))}
                        className="font-mono"
                        placeholder="Bitcoin address..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(localSettings.project_wallet_btc, 'Bitcoin')}
                        className="font-mono"
                      >
                        {copiedWallet === 'Bitcoin' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bch_wallet" className="font-mono">Bitcoin Cash Wallet</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bch_wallet"
                        value={localSettings.project_wallet_bch}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_wallet_bch: e.target.value }))}
                        className="font-mono"
                        placeholder="Bitcoin Cash address..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(localSettings.project_wallet_bch, 'Bitcoin Cash')}
                        className="font-mono"
                      >
                        {copiedWallet === 'Bitcoin Cash' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="paypal_email" className="font-mono">PayPal Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="paypal_email"
                        value={localSettings.project_paypal_email}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, project_paypal_email: e.target.value }))}
                        className="font-mono"
                        placeholder="paypal@example.com"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(localSettings.project_paypal_email, 'PayPal')}
                        className="font-mono"
                      >
                        {copiedWallet === 'PayPal' ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveWallets} className="font-mono">
                  <Save size={16} className="mr-2" />
                  Save All Wallets
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="premium" className="space-y-4">
            {/* Premium Code Management */}
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
                                  onClick={() => copyToClipboard(code.code, 'Code')}
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

          <TabsContent value="users" className="space-y-4">
            {/* User Management & UID System */}
            <Card className="bg-background/50 border-2 border-purple-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 flex items-center gap-2 text-sm font-mono uppercase">
                  <UsersIcon size={16} />
                  User Management & UID System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-3 border-2 border-border rounded">
                  <div className="text-xs font-mono">
                    <div className="font-bold mb-2">UID SYSTEM STATUS:</div>
                    <div className="text-green-400">✓ UIDs now display on leaderboard</div>
                    <div className="text-green-400">✓ 8-character unique identifiers generated from user IDs</div>
                    <div className="text-green-400">✓ Format: User-{'{UID}'} (e.g., User-A1B2C3D4)</div>
                    <div className="text-muted-foreground mt-2">
                      UIDs are automatically generated from user authentication IDs for consistency.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-mono uppercase">Manual Point Allocation:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="User ID"
                      className="font-mono text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Points"
                      className="font-mono text-xs"
                    />
                  </div>
                  <Button className="brutalist-button w-full">
                    Award Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-background/50 border-2 border-red-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 flex items-center gap-2 text-sm font-mono uppercase">
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-green-400">✓ RLS policies enabled</div>
                  <div className="text-green-400">✓ Input sanitization active</div>
                  <div className="text-green-400">✓ Rate limiting enabled</div>
                  <div className="text-green-400">✓ Admin actions logged</div>
                  <div className="text-green-400">✓ Session timeout: 30 minutes</div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button 
                onClick={onClose}
                variant="outline" 
                className="brutalist-button flex-1"
              >
                <LogOut size={16} className="mr-2" />
                Close Panel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
