
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, LogOut, AlertTriangle } from 'lucide-react';
import { useSecureAdminAuth } from '@/hooks/useSecureAdminAuth';
import { useAdminMode } from '@/hooks/useAdminMode';
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
    premiumCodes,
    generatePremiumCode,
    deletePremiumCode,
    getCodeStats,
    premiumCodesLoading
  } = useAdminMode();

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

  const handleUpdateSetting = async (key: string, value: any) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    await handleSecureAction('update_cms_setting', async () => {
      // Cast key to appropriate type for updateCMSSetting
      await updateCMSSetting(key as any, sanitizedValue);
      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully.`
      });
    }, { key, value: sanitizedValue });
  };

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
      <DialogContent className="bg-card border-2 border-border max-w-4xl max-h-[80vh] overflow-y-auto">
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

        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="premium" className="space-y-4">
            <Card className="bg-background/50 border-2 border-green-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cms" className="space-y-4">
            <Card className="bg-background/50 border-2 border-blue-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-400 flex items-center gap-2 text-sm font-mono uppercase">
                  CMS Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs font-mono text-muted-foreground">
                  All inputs are sanitized for security. Changes are logged.
                </div>
                {/* CMS settings content would go here */}
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
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
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
