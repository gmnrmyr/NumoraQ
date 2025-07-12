
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Users, Code, Gift, Crown, Settings, Globe, Upload, Wallet, Zap } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumCodes } from '@/hooks/usePremiumCodes';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectSettingsPanel } from './cms/ProjectSettingsPanel';
import { toast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const { user } = useAuth();
  const { 
    generatePremiumCode,
    premiumCodesLoading
  } = useAdminMode();
  
  const {
    codes,
    loading: codesLoading,
    generateCode,
    deleteCode
  } = usePremiumCodes();

  const { addManualPoints } = useUserPoints();

  const [newCodeType, setNewCodeType] = useState('1year');
  const [newCodeEmail, setNewCodeEmail] = useState('');
  const [pointsUserId, setPointsUserId] = useState('');
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsReason, setPointsReason] = useState('');

  // User title requirements (hardcoded for reference)
  const titleRequirements = [
    { title: 'LEGEND', points: 10000, donation: '$10,000+' },
    { title: 'PATRON', points: 5000, donation: '$5,000+' },
    { title: 'CHAMPION', points: 2000, donation: '$2,000+' },
    { title: 'SUPPORTER', points: 1000, donation: '$1,000+' },
    { title: 'BACKER', points: 500, donation: '$500+' },
    { title: 'DONOR', points: 100, donation: '$100+' },
    { title: 'CONTRIBUTOR', points: 50, donation: '$50+' },
    { title: 'HELPER', points: 25, donation: '$25+' },
    { title: 'FRIEND', points: 20, donation: '$20+' },
    { title: 'SUPPORTER', points: 10, donation: '$10+' }
  ];

  const handleGenerateCode = async () => {
    if (!newCodeEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    const success = await generateCode(newCodeType as '1year' | '5years' | 'lifetime');
    if (success) {
      setNewCodeEmail('');
      toast({
        title: "Code Generated! ✅",
        description: "Premium code generated successfully!",
        duration: 5000
      });
    }
  };

  const handleCreateCode = async () => {
    if (!newCodeEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await generateCode(newCodeType as '1year' | '5years' | 'lifetime');
      
      if (success) {
        // Clear form fields after successful submission
        setNewCodeEmail('');
        
        toast({
          title: "Degen Code Generated! ✅",
          description: `${newCodeType} premium code created successfully and is ready for sharing!`,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Failed to Generate Code ❌",
        description: "Failed to generate premium code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddPoints = async () => {
    if (!pointsUserId.trim() || !pointsAmount.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both user ID and points amount",
        variant: "destructive"
      });
      return;
    }

    const points = parseInt(pointsAmount);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Invalid Points",
        description: "Please enter a valid positive number for points",
        variant: "destructive"
      });
      return;
    }

    try {
      await addManualPoints(pointsUserId, points, pointsReason || 'Manual admin assignment');
      
      // Clear form fields after successful submission
      setPointsUserId('');
      setPointsAmount('');
      setPointsReason('');
      
      // Note: Toast notification is handled by the addManualPoints hook
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Failed to Add Points ❌",
        description: "Failed to add points. Please try again.",
        variant: "destructive"
      });
    }
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
        <TabsList className="grid w-full grid-cols-4 bg-card border-2 border-border">
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
          <TabsTrigger value="points" className="font-mono">
            <Zap size={16} className="mr-2" />
            Points System
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
                    <option value="1year">1 Year</option>
                    <option value="5years">5 Years</option>
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
                              onClick={() => deleteCode(code.id)}
                              className="font-mono"
                            >
                              Delete
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

        <TabsContent value="points" className="space-y-4">
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">Manual Points Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="userId" className="font-mono">User ID</Label>
                  <Input
                    id="userId"
                    value={pointsUserId}
                    onChange={(e) => setPointsUserId(e.target.value)}
                    placeholder="Enter user UUID"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="points" className="font-mono">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                    placeholder="100"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reason" className="font-mono">Reason</Label>
                  <Input
                    id="reason"
                    value={pointsReason}
                    onChange={(e) => setPointsReason(e.target.value)}
                    placeholder="Manual assignment"
                    className="font-mono"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddPoints}
                    disabled={!pointsUserId.trim() || !pointsAmount.trim()}
                    className="w-full font-mono"
                  >
                    <Zap size={16} className="mr-2" />
                    Add Points
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted border border-border rounded">
                <h4 className="font-mono font-bold mb-2">Quick Reference - User ID for deckard.hardsurface@gmail.com:</h4>
                <code className="text-xs bg-background p-2 rounded block">
                  You can find user UUIDs in the Supabase Auth panel or by checking the browser console when users log in
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">Title Requirements (Hardcoded Reference)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titleRequirements.map((req, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-border rounded">
                    <div className="font-mono">
                      <div className="font-bold text-accent">{req.title}</div>
                      <div className="text-sm text-muted-foreground">{req.donation}</div>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {req.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-accent/10 border border-accent rounded">
                <div className="text-sm font-mono text-accent">
                  <Crown size={16} className="inline mr-2" />
                  <strong>CHAMPION Role (Black Hole Animation):</strong> 2,000+ points required
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
