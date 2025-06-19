
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Eye, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SiteConfigTab: React.FC = () => {
  const [config, setConfig] = useState({
    siteName: 'OPEN FINDASH',
    version: '2.1.0',
    githubLink: 'https://github.com/yourusername/findash',
    twitterLink: 'https://twitter.com/findash',
    discordLink: 'https://discord.gg/findash',
    supportEmail: 'support@findash.com',
    description: 'Open-source financial dashboard for crypto and traditional assets',
    logoVertical: '',
    logoHorizontal: '',
    logoSymbol: '',
    maintenanceMode: false,
    featuredMessage: ''
  });

  const [logoPreview, setLogoPreview] = useState<{[key: string]: string}>({});

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (logoType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(prev => ({ ...prev, [logoType]: result }));
        handleConfigChange(logoType, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (logoType: string) => {
    setLogoPreview(prev => ({ ...prev, [logoType]: '' }));
    handleConfigChange(logoType, '');
  };

  const saveConfig = () => {
    localStorage.setItem('siteConfig', JSON.stringify(config));
    toast({
      title: "Configuration Saved!",
      description: "Site configuration has been updated.",
    });
  };

  const LogoUploadSection = ({ type, label }: { type: string; label: string }) => (
    <div className="space-y-2">
      <Label className="font-mono">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            onChange={(e) => handleLogoUpload(type, e)}
            className="font-mono"
          />
        </div>
        {logoPreview[type] && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 border-2 border-border flex items-center justify-center bg-muted">
              <img 
                src={logoPreview[type]} 
                alt={`${label} preview`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <Button
              onClick={() => removeLogo(type)}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <X size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic Site Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="siteName" className="font-mono">Site Name</Label>
          <Input
            id="siteName"
            value={config.siteName}
            onChange={(e) => handleConfigChange('siteName', e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version" className="font-mono">Version</Label>
          <Input
            id="version"
            value={config.version}
            onChange={(e) => handleConfigChange('version', e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-mono">Site Description</Label>
        <Textarea
          id="description"
          value={config.description}
          onChange={(e) => handleConfigChange('description', e.target.value)}
          className="font-mono"
          rows={3}
        />
      </div>

      {/* Logo Management */}
      <div className="bg-muted p-4 border-2 border-border space-y-4">
        <h3 className="font-mono font-bold">Logo Management</h3>
        <LogoUploadSection type="logoVertical" label="Vertical Logo" />
        <LogoUploadSection type="logoHorizontal" label="Horizontal Logo" />
        <LogoUploadSection type="logoSymbol" label="Symbol Only" />
        <div className="text-xs text-muted-foreground font-mono">
          Recommended: SVG format for best quality. Logos will appear in navigation, footer, and branding areas.
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-muted p-4 border-2 border-border space-y-4">
        <h3 className="font-mono font-bold">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="githubLink" className="font-mono">GitHub Repository</Label>
            <Input
              id="githubLink"
              value={config.githubLink}
              onChange={(e) => handleConfigChange('githubLink', e.target.value)}
              className="font-mono"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitterLink" className="font-mono">Twitter/X Profile</Label>
            <Input
              id="twitterLink"
              value={config.twitterLink}
              onChange={(e) => handleConfigChange('twitterLink', e.target.value)}
              className="font-mono"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discordLink" className="font-mono">Discord Server</Label>
            <Input
              id="discordLink"
              value={config.discordLink}
              onChange={(e) => handleConfigChange('discordLink', e.target.value)}
              className="font-mono"
              placeholder="https://discord.gg/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="font-mono">Support Email</Label>
            <Input
              id="supportEmail"
              value={config.supportEmail}
              onChange={(e) => handleConfigChange('supportEmail', e.target.value)}
              className="font-mono"
              placeholder="support@..."
            />
          </div>
        </div>
      </div>

      {/* Featured Message */}
      <div className="space-y-2">
        <Label htmlFor="featuredMessage" className="font-mono">Featured Announcement</Label>
        <Textarea
          id="featuredMessage"
          value={config.featuredMessage}
          onChange={(e) => handleConfigChange('featuredMessage', e.target.value)}
          className="font-mono"
          rows={2}
          placeholder="Optional: Display important announcements to users"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfig} className="brutalist-button">
          <Save size={16} className="mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
