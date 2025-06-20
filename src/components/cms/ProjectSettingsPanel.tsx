import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Upload, Copy, Check, Globe, Palette } from 'lucide-react';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { useCMSLogos } from '@/hooks/useCMSLogos';
import { toast } from '@/hooks/use-toast';

export const ProjectSettingsPanel = () => {
  const { settings, updateSetting, updateMultipleSettings, loading } = useProjectSettings();
  const { logos, updateLogo } = useCMSLogos();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localLogos, setLocalLogos] = useState(logos);
  const [copiedWallet, setCopiedWallet] = useState<string>('');

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    setLocalLogos(logos);
  }, [logos]);

  const handleSaveBasicSettings = async () => {
    await updateMultipleSettings({
      website_name: localSettings.website_name,
      version: localSettings.version,
      upcoming_features_text: localSettings.upcoming_features_text,
      main_color_scheme: localSettings.main_color_scheme
    });
  };

  const handleSaveWallets = async () => {
    await updateMultipleSettings({
      project_wallet_evm: localSettings.project_wallet_evm,
      project_wallet_solana: localSettings.project_wallet_solana,
      project_wallet_btc: localSettings.project_wallet_btc,
      project_wallet_bch: localSettings.project_wallet_bch,
      project_paypal_email: localSettings.project_paypal_email
    });
  };

  const handleSaveLogos = async () => {
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
  };

  const copyWallet = (wallet: string, type: string) => {
    navigator.clipboard.writeText(wallet);
    setCopiedWallet(type);
    setTimeout(() => setCopiedWallet(''), 2000);
    toast({
      title: "Copied!",
      description: `${type} wallet address copied to clipboard`
    });
  };

  // Match DevMenu color schemes exactly
  const colorSchemes = [
    { value: 'default', label: 'Default' },
    { value: 'monochrome', label: 'Monochrome (Default)' },
    { value: 'neon', label: 'Neon' },
    { value: 'dual-tone', label: 'Dual Tone' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'cyberpunk', label: 'Cyberpunk (Premium)' },
    { value: 'matrix', label: 'Matrix (Premium)' },
    { value: 'gold', label: 'Gold Rush (Premium)' }
  ];

  if (loading) return <div>Loading CMS settings...</div>;

  return (
    <div className="space-y-6">
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
                  onClick={() => copyWallet(localSettings.project_wallet_evm, 'EVM')}
                  className="font-mono"
                >
                  {copiedWallet === 'EVM' ? <Check size={16} /> : <Copy size={16} />}
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
                  onClick={() => copyWallet(localSettings.project_wallet_solana, 'Solana')}
                  className="font-mono"
                >
                  {copiedWallet === 'Solana' ? <Check size={16} /> : <Copy size={16} />}
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
                  onClick={() => copyWallet(localSettings.project_wallet_btc, 'Bitcoin')}
                  className="font-mono"
                >
                  {copiedWallet === 'Bitcoin' ? <Check size={16} /> : <Copy size={16} />}
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
                  onClick={() => copyWallet(localSettings.project_wallet_bch, 'Bitcoin Cash')}
                  className="font-mono"
                >
                  {copiedWallet === 'Bitcoin Cash' ? <Check size={16} /> : <Copy size={16} />}
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
                  onClick={() => copyWallet(localSettings.project_paypal_email, 'PayPal')}
                  className="font-mono"
                >
                  {copiedWallet === 'PayPal' ? <Check size={16} /> : <Copy size={16} />}
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
    </div>
  );
};
