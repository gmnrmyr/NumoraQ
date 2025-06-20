
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, Code, Gift, Crown, Settings, Globe, Upload, Wallet } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumCodes } from '@/hooks/usePremiumCodes';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectSettingsPanel } from './cms/ProjectSettingsPanel';

export const AdminPanel = () => {
  const { user } = useAuth();
  const { 
    generatePremiumCode,
    loading: premiumLoading
  } = useAdminMode();
  
  const {
    codes,
    loading: codesLoading,
    createCode,
    deactivateCode
  } = usePremiumCodes();

  const [newCodeType, setNewCodeType] = useState('degen');
  const [newCodeEmail, setNewCodeEmail] = useState('');

  const handleGenerateCode = async () => {
    if (!newCodeEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    const success = await generatePremiumCode(newCodeType, newCodeEmail);
    if (success) {
      setNewCodeEmail('');
      alert('Premium code generated and sent!');
    }
  };

  const handleCreateCode = async () => {
    if (!newCodeEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    await createCode(newCodeType, newCodeEmail);
    setNewCodeEmail('');
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono text-accent">
            <Shield size={24} />
            ADMIN CONTROL PANEL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono text-muted-foreground">
            Authorized Administrator: {user.email}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cms" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-border">
          <TabsTrigger value="cms" className="font-mono">
            <Settings size={16} className="mr-2" />
            CMS Settings
          </TabsTrigger>
          <TabsTrigger value="codes" className="font-mono">
            <Gift size={16} className="mr-2" />
            Premium Codes
          </TabsTrigger>
          <TabsTrigger value="users" className="font-mono">
            <Users size={16} className="mr-2" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cms" className="space-y-4">
          <ProjectSettingsPanel />
        </TabsContent>

        <TabsContent value="codes" className="space-y-4">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">Generate Premium Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="codeType" className="font-mono">Code Type</Label>
                  <select 
                    id="codeType"
                    value={newCodeType} 
                    onChange={(e) => setNewCodeType(e.target.value)}
                    className="w-full p-2 border border-border rounded bg-background font-mono"
                  >
                    <option value="degen">Degen Mode</option>
                    <option value="premium">Premium Access</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="email" className="font-mono">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCodeEmail}
                    onChange={(e) => setNewCodeEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="font-mono"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleCreateCode}
                    disabled={codesLoading || !newCodeEmail.trim()}
                    className="w-full font-mono"
                  >
                    <Gift size={16} className="mr-2" />
                    Generate Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">Active Premium Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {codesLoading ? (
                <div className="font-mono text-muted-foreground">Loading codes...</div>
              ) : (
                <div className="space-y-2">
                  {codes.length === 0 ? (
                    <div className="font-mono text-muted-foreground">No codes generated yet</div>
                  ) : (
                    codes.map((code) => (
                      <div key={code.id} className="flex items-center justify-between p-3 border border-border rounded">
                        <div className="font-mono">
                          <div className="font-bold">{code.code}</div>
                          <div className="text-sm text-muted-foreground">
                            {code.user_email} - {code.code_type}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={code.is_active ? "default" : "secondary"}>
                            {code.is_active ? "Active" : "Used"}
                          </Badge>
                          {code.is_active && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deactivateCode(code.id)}
                              className="font-mono"
                            >
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-muted-foreground">
                User management features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
