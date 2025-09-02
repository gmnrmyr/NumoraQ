import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, XCircle, Info, Copy, ExternalLink, Zap, CreditCard, Gift, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  data?: any;
  error?: any;
}

export const PaymentSystemDiagnostic = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any>(null);
  const [testCode, setTestCode] = useState('');
  const [testPoints, setTestPoints] = useState('100');

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const copyAllResults = () => {
    const reportText = `# NumoraQ Payment System Diagnostic Report
Generated: ${new Date().toISOString()}
User: ${user?.email || 'Not logged in'}

## Test Results:
${results.map(r => `
### ${r.name} - ${r.status.toUpperCase()}
${r.message}
${r.data ? `Data: ${JSON.stringify(r.data, null, 2)}` : ''}
${r.error ? `Error: ${JSON.stringify(r.error, null, 2)}` : ''}
`).join('\n')}

## Raw Data:
${JSON.stringify(rawData, null, 2)}
`;

    navigator.clipboard.writeText(reportText).then(() => {
      toast({
        title: "Report Copied! 📋",
        description: "Diagnostic report copied to clipboard",
        duration: 3000
      });
    });
  };

  const testPremiumCode = async () => {
    if (!testCode.trim()) {
      toast({
        title: "Enter Code",
        description: "Please enter a premium code to test",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to test premium codes",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/premium-codes/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          code: testCode,
          userEmail: user?.email 
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Code Activated! ✅",
          description: `Premium code activated: ${result.codeType}`,
          duration: 5000
        });
        // Re-run diagnostics to see changes
        runDiagnostics();
      } else {
        toast({
          title: "Code Failed ❌",
          description: result.error || "Failed to activate code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const addTestPoints = async () => {
    const points = parseInt(testPoints);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Invalid Points",
        description: "Please enter a valid positive number",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to add test points",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_points')
        .insert({
          user_id: user.id,
          points: points,
          activity_type: 'manual',
          activity_date: new Date().toISOString().split('T')[0],
          points_source: 'diagnostic_test',
          source_details: JSON.stringify({
            test: true,
            reason: 'Diagnostic test points',
            timestamp: new Date().toISOString()
          })
        });

      if (error) throw error;

      toast({
        title: "Points Added! 🎉",
        description: `Added ${points} test points`,
        duration: 3000
      });
      
      // Re-run diagnostics to see changes
      runDiagnostics();
    } catch (error) {
      toast({
        title: "Points Failed ❌",
        description: error instanceof Error ? error.message : "Failed to add points",
        variant: "destructive"
      });
    }
  };

  const openStripePayment = () => {
    // This would open the payment page - adjust URL as needed
    window.open('/payment', '_blank');
  };

  const openAdminPanel = () => {
    // Trigger the admin panel - this might need to be adjusted based on your implementation
    toast({
      title: "Admin Panel",
      description: "Use CTRL+SHIFT+E to open admin panel",
      duration: 3000
    });
  };

  const checkRLSPolicies = async () => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to check RLS policies",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    addResult({ name: 'RLS Policy Deep Check', status: 'info', message: 'Running comprehensive RLS policy tests...' });

    try {
      // Test specific operations that commonly fail due to RLS
      const tests = [
        {
          name: 'Insert user_points (self)',
          test: () => supabase.from('user_points').insert({
            user_id: user.id,
            points: 1,
            activity_type: 'rls_deep_test',
            activity_date: new Date().toISOString().split('T')[0]
          }).select()
        },
        {
          name: 'Insert user_points (other user)',
          test: () => supabase.from('user_points').insert({
            user_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
            points: 1,
            activity_type: 'rls_deep_test',
            activity_date: new Date().toISOString().split('T')[0]
          }).select()
        },
        {
          name: 'Update user_premium_status (self)',
          test: () => supabase.from('user_premium_status').update({
            updated_at: new Date().toISOString()
          }).eq('user_id', user.id).select()
        },
        {
          name: 'Select from premium_codes',
          test: () => supabase.from('premium_codes').select('id, code_type, is_active').limit(1)
        },
        {
          name: 'Select from profiles (self)',
          test: () => supabase.from('profiles').select('*').eq('id', user.id).single()
        },
        {
          name: 'Select from profiles (all users)',
          test: () => supabase.from('profiles').select('id, name').limit(5)
        }
      ];

      for (const testCase of tests) {
        try {
          const result = await testCase.test();
          
          if (result.error) {
            addResult({
              name: `RLS: ${testCase.name}`,
              status: 'error',
              message: `BLOCKED: ${result.error.message}`,
              error: result.error,
              data: { operation: testCase.name, blocked: true }
            });
          } else {
            addResult({
              name: `RLS: ${testCase.name}`,
              status: 'success',
              message: `ALLOWED: Operation successful`,
              data: { operation: testCase.name, blocked: false, resultCount: Array.isArray(result.data) ? result.data.length : (result.data ? 1 : 0) }
            });

            // Clean up test data
            if (testCase.name.includes('Insert user_points') && result.data?.[0]?.id) {
              await supabase.from('user_points').delete().eq('id', result.data[0].id);
            }
          }
        } catch (error) {
          addResult({
            name: `RLS: ${testCase.name}`,
            status: 'error',
            message: `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error,
            data: { operation: testCase.name, blocked: true }
          });
        }
      }

      toast({
        title: "RLS Check Complete! 🔒",
        description: "Check results tab for detailed policy analysis",
        duration: 3000
      });

    } catch (error) {
      addResult({
        name: 'RLS Policy Deep Check',
        status: 'error',
        message: `Failed to complete RLS check: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    setLoading(false);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    setRawData({});
    const diagnosticData: any = {};

    try {
      // Test 1: Current User Premium Status
      addResult({ name: 'User Authentication', status: 'info', message: `Testing with user: ${user?.email || 'Not logged in'}` });

      if (!user) {
        addResult({ name: 'Authentication', status: 'error', message: 'No user logged in - cannot run user-specific tests' });
        setLoading(false);
        return;
      }

      // Test 2: Check current user's premium status
      const { data: userPremiumStatus, error: premiumError } = await supabase
        .from('user_premium_status')
        .select('*')
        .eq('user_id', user.id);
      
      diagnosticData.userPremiumStatus = { data: userPremiumStatus, error: premiumError };
      
      if (premiumError) {
        addResult({ 
          name: 'User Premium Status Query', 
          status: 'error', 
          message: `Database error: ${premiumError.message}`,
          error: premiumError 
        });
      } else if (!userPremiumStatus || userPremiumStatus.length === 0) {
        addResult({ 
          name: 'User Premium Status', 
          status: 'warning', 
          message: 'No premium status record found for current user',
          data: userPremiumStatus 
        });
      } else {
        const status = userPremiumStatus[0];
        const isExpired = status.expires_at ? new Date(status.expires_at) < new Date() : false;
        addResult({ 
          name: 'User Premium Status', 
          status: 'success', 
          message: `Found premium status: ${status.premium_type}, Premium: ${status.is_premium}, Expires: ${status.expires_at}${isExpired ? ' (EXPIRED)' : ''}`,
          data: status 
        });
      }

      // Test 3: Check current user's points
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      diagnosticData.userPoints = { data: userPoints, error: pointsError };
      
      if (pointsError) {
        addResult({ 
          name: 'User Points Query', 
          status: 'error', 
          message: `Database error: ${pointsError.message}`,
          error: pointsError 
        });
      } else {
        const totalPoints = userPoints?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
        addResult({ 
          name: 'User Points', 
          status: 'success', 
          message: `Found ${userPoints?.length || 0} point records, Total: ${totalPoints} points`,
          data: { totalPoints, records: userPoints } 
        });
      }

      // Test 4: Check payment sessions for current user
      const { data: paymentSessions, error: paymentError } = await supabase
        .from('payment_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      diagnosticData.paymentSessions = { data: paymentSessions, error: paymentError };
      
      if (paymentError) {
        addResult({ 
          name: 'Payment Sessions Query', 
          status: 'error', 
          message: `Database error: ${paymentError.message}`,
          error: paymentError 
        });
      } else {
        addResult({ 
          name: 'Payment Sessions', 
          status: 'success', 
          message: `Found ${paymentSessions?.length || 0} payment sessions`,
          data: paymentSessions 
        });
      }

      // Test 5: Check premium codes (admin view)
      const { data: premiumCodes, error: codesError } = await supabase
        .from('premium_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      diagnosticData.premiumCodes = { data: premiumCodes, error: codesError };
      
      if (codesError) {
        addResult({ 
          name: 'Premium Codes Query', 
          status: 'error', 
          message: `Database error: ${codesError.message}`,
          error: codesError 
        });
      } else {
        const activeCodes = premiumCodes?.filter(c => c.is_active && !c.used_by).length || 0;
        addResult({ 
          name: 'Premium Codes', 
          status: 'success', 
          message: `Found ${premiumCodes?.length || 0} total codes, ${activeCodes} active unused`,
          data: premiumCodes 
        });
      }

      // Test 6: Check database schema by attempting to query with new columns
      const { data: schemaTest, error: schemaError } = await supabase
        .from('user_premium_status')
        .select('activation_source, source_details, activated_by_admin')
        .limit(1);
      
      if (schemaError) {
        addResult({ 
          name: 'Database Schema (New Columns)', 
          status: 'error', 
          message: `New columns not available: ${schemaError.message}`,
          error: schemaError 
        });
      } else {
        addResult({ 
          name: 'Database Schema (New Columns)', 
          status: 'success', 
          message: 'New tracking columns are available in database',
          data: schemaTest 
        });
      }

      // Test 7: Check if 30-day trial trigger is working
      const { data: recentUsers, error: recentError } = await supabase
        .from('user_premium_status')
        .select('user_id, premium_type, activation_source, created_at')
        .eq('premium_type', '30day_trial')
        .order('created_at', { ascending: false })
        .limit(5);
      
      diagnosticData.recentTrials = { data: recentUsers, error: recentError };
      
      if (recentError) {
        addResult({ 
          name: '30-Day Trial System', 
          status: 'error', 
          message: `Cannot check trials: ${recentError.message}`,
          error: recentError 
        });
      } else {
        addResult({ 
          name: '30-Day Trial System', 
          status: recentUsers && recentUsers.length > 0 ? 'success' : 'warning', 
          message: `Found ${recentUsers?.length || 0} recent 30-day trials`,
          data: recentUsers 
        });
      }

      // Test 8: Check admin status and permissions
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('admin_role, admin_level, name')
        .eq('id', user.id)
        .single();
      
      diagnosticData.userProfile = { data: userProfile, error: profileError };
      
      if (profileError) {
        addResult({ 
          name: 'User Profile & Admin Status', 
          status: 'error', 
          message: `Cannot check admin status: ${profileError.message}`,
          error: profileError 
        });
      } else {
        const isAdmin = userProfile?.admin_role === true;
        addResult({ 
          name: 'User Profile & Admin Status', 
          status: isAdmin ? 'success' : 'info', 
          message: `Admin Role: ${isAdmin ? 'YES' : 'NO'}, Admin Level: ${userProfile?.admin_level || 'None'}, Name: ${userProfile?.name || 'Not set'}`,
          data: userProfile 
        });
      }

      // Test 9: RLS Policy Tests - Test basic operations that might be blocked
      addResult({ name: 'RLS Policy Tests', status: 'info', message: 'Testing Row Level Security policies...' });

      // Test 9a: Can we insert into user_points?
      try {
        const testPointsInsert = await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            points: 0,
            activity_type: 'rls_test',
            activity_date: new Date().toISOString().split('T')[0],
            points_source: 'rls_diagnostic_test'
          })
          .select();

        if (testPointsInsert.error) {
          addResult({ 
            name: 'RLS Test: user_points INSERT', 
            status: 'error', 
            message: `Cannot insert points: ${testPointsInsert.error.message}`,
            error: testPointsInsert.error 
          });
        } else {
          // Clean up the test record
          await supabase
            .from('user_points')
            .delete()
            .eq('id', testPointsInsert.data[0].id);
          
          addResult({ 
            name: 'RLS Test: user_points INSERT', 
            status: 'success', 
            message: 'Can insert points - RLS policy allows',
            data: testPointsInsert.data 
          });
        }
      } catch (error) {
        addResult({ 
          name: 'RLS Test: user_points INSERT', 
          status: 'error', 
          message: `RLS blocking points insert: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error 
        });
      }

      // Test 9b: Can we update user_premium_status?
      try {
        const testPremiumUpdate = await supabase
          .from('user_premium_status')
          .update({ updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .select();

        if (testPremiumUpdate.error) {
          addResult({ 
            name: 'RLS Test: user_premium_status UPDATE', 
            status: 'error', 
            message: `Cannot update premium status: ${testPremiumUpdate.error.message}`,
            error: testPremiumUpdate.error 
          });
        } else {
          addResult({ 
            name: 'RLS Test: user_premium_status UPDATE', 
            status: 'success', 
            message: 'Can update premium status - RLS policy allows',
            data: testPremiumUpdate.data 
          });
        }
      } catch (error) {
        addResult({ 
          name: 'RLS Test: user_premium_status UPDATE', 
          status: 'error', 
          message: `RLS blocking premium status update: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error 
        });
      }

      // Test 9c: Can we read from admin-only tables?
      try {
        const adminTablesTest = await supabase
          .from('premium_codes')
          .select('count')
          .limit(1);

        if (adminTablesTest.error) {
          addResult({ 
            name: 'RLS Test: Admin Tables Access (premium_codes)', 
            status: 'warning', 
            message: `Limited access to admin tables: ${adminTablesTest.error.message}`,
            error: adminTablesTest.error 
          });
        } else {
          addResult({ 
            name: 'RLS Test: Admin Tables Access (premium_codes)', 
            status: 'success', 
            message: 'Can access admin tables - elevated permissions detected',
            data: adminTablesTest.data 
          });
        }
      } catch (error) {
        addResult({ 
          name: 'RLS Test: Admin Tables Access (premium_codes)', 
          status: 'warning', 
          message: `No admin table access: ${error instanceof Error ? error.message : 'Expected for non-admin users'}`,
          error: error 
        });
      }

      // Test 9d: Service Role vs User Role detection
      try {
        // Try to access auth.users table (only possible with service role or elevated permissions)
        const authUsersTest = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        const isServiceRole = !authUsersTest.error;
        addResult({ 
          name: 'Authentication Context', 
          status: 'info', 
          message: `Using ${isServiceRole ? 'Service Role or Admin' : 'Regular User'} context`,
          data: { isServiceRole, hasElevatedPermissions: isServiceRole || userProfile?.admin_role } 
        });
      } catch (error) {
        addResult({ 
          name: 'Authentication Context', 
          status: 'info', 
          message: 'Using regular user authentication context',
          data: { isServiceRole: false, hasElevatedPermissions: userProfile?.admin_role } 
        });
      }

      // Test 9e: Check if Edge Functions are accessible
      try {
        const edgeFunctionTest = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/premium-codes/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({})
        });

        if (edgeFunctionTest.ok) {
          addResult({ 
            name: 'Edge Functions Access', 
            status: 'success', 
            message: 'Edge functions are accessible and responding',
            data: { status: edgeFunctionTest.status } 
          });
        } else {
          addResult({ 
            name: 'Edge Functions Access', 
            status: 'warning', 
            message: `Edge functions responding with status: ${edgeFunctionTest.status}`,
            data: { status: edgeFunctionTest.status } 
          });
        }
      } catch (error) {
        addResult({ 
          name: 'Edge Functions Access', 
          status: 'error', 
          message: `Edge functions not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error 
        });
      }

      // Test 10: Test tier calculation logic
      if (userPoints && userPoints.length > 0) {
        const totalPoints = userPoints.reduce((sum, p) => sum + (p.points || 0), 0);
        let expectedTier = 'NEWCOMER';
        
        if (totalPoints >= 50000) expectedTier = 'WHALE';
        else if (totalPoints >= 10000) expectedTier = 'LEGEND';
        else if (totalPoints >= 5000) expectedTier = 'PATRON';
        else if (totalPoints >= 2000) expectedTier = 'CHAMPION';
        else if (totalPoints >= 1000) expectedTier = 'SUPPORTER';
        else if (totalPoints >= 500) expectedTier = 'BACKER';
        else if (totalPoints >= 100) expectedTier = 'DONOR';
        else if (totalPoints >= 50) expectedTier = 'CONTRIBUTOR';
        else if (totalPoints >= 25) expectedTier = 'HELPER';
        else if (totalPoints >= 20) expectedTier = 'FRIEND';
        else if (totalPoints >= 10) expectedTier = 'SUPPORTER-BASIC';
        
        addResult({ 
          name: 'Tier Calculation', 
          status: 'info', 
          message: `With ${totalPoints} points, user should be tier: ${expectedTier}`,
          data: { totalPoints, expectedTier, currentTier: 'Unknown - not stored in user_points' } 
        });
      }

      setRawData(diagnosticData);

    } catch (error) {
      addResult({ 
        name: 'Diagnostic Error', 
        status: 'error', 
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error 
      });
    }

    setLoading(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      info: 'outline'
    } as const;
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Payment System Diagnostics
          {user && <Badge variant="outline">User: {user.email}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Zap size={16} />
              {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Button>
            
            {results.length > 0 && (
              <Button 
                onClick={copyAllResults}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                Copy Report
              </Button>
            )}
            
            <Button 
              onClick={checkRLSPolicies}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {loading ? 'Checking RLS...' : 'Check RLS Policies'}
            </Button>
          </div>

          {/* Quick Actions Panel */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                ⚡ Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Test Premium Code */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Test Premium Code</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter premium code..."
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    className="text-xs"
                  />
                  <Button 
                    onClick={testPremiumCode}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Gift size={14} />
                    Test
                  </Button>
                </div>
              </div>

              {/* Add Test Points */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Add Test Points</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    placeholder="Points"
                    value={testPoints}
                    onChange={(e) => setTestPoints(e.target.value)}
                    className="text-xs"
                  />
                  <Button 
                    onClick={addTestPoints}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Zap size={14} />
                    Add
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={openStripePayment}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <CreditCard size={14} />
                  Payment
                </Button>
                <Button 
                  onClick={openAdminPanel}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Users size={14} />
                  Admin
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  Reload
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {results.length > 0 && (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{result.name}</span>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">View Data</summary>
                          <pre className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 rounded mt-1 overflow-auto max-h-40 border">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                      {result.error && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-red-600 hover:text-red-800">View Error</summary>
                          <pre className="text-xs bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 p-2 rounded mt-1 overflow-auto max-h-40 border border-red-200 dark:border-red-800">
                            {JSON.stringify(result.error, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Manual Database Operations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">🔧 Manual Operations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={async () => {
                          if (!user) return;
                          try {
                            const { error } = await supabase
                              .from('user_premium_status')
                              .upsert({
                                user_id: user.id,
                                is_premium: false,
                                premium_type: '30day_trial',
                                activated_at: new Date().toISOString(),
                                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                                activation_source: 'diagnostic_manual',
                                source_details: JSON.stringify({
                                  created_by: 'diagnostic_tool',
                                  reason: 'Manual 30-day trial creation'
                                })
                              });

                            if (error) throw error;

                            toast({
                              title: "Trial Created! 🎉",
                              description: "30-day trial activated for current user",
                              duration: 3000
                            });
                            runDiagnostics();
                          } catch (error) {
                            toast({
                              title: "Failed to Create Trial",
                              description: error instanceof Error ? error.message : "Unknown error",
                              variant: "destructive"
                            });
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                      >
                        Create 30-Day Trial
                      </Button>
                      
                      <Button 
                        onClick={async () => {
                          if (!user) return;
                          try {
                            const { error } = await supabase
                              .from('user_points')
                              .delete()
                              .eq('user_id', user.id)
                              .in('points_source', ['diagnostic_test', 'rls_diagnostic_test', 'rls_deep_test']);

                            if (error) throw error;

                            toast({
                              title: "Test Points Cleared! 🧹",
                              description: "All diagnostic test points removed",
                              duration: 3000
                            });
                            runDiagnostics();
                          } catch (error) {
                            toast({
                              title: "Failed to Clear Points",
                              description: error instanceof Error ? error.message : "Unknown error",
                              variant: "destructive"
                            });
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                      >
                        Clear Test Points
                      </Button>

                      <Button 
                        onClick={async () => {
                          if (!user) return;
                          try {
                            const { error } = await supabase
                              .from('profiles')
                              .update({ admin_role: true, admin_level: 'diagnostic_admin' })
                              .eq('id', user.id);

                            if (error) throw error;

                            toast({
                              title: "Admin Role Granted! 👑",
                              description: "Current user now has admin privileges",
                              duration: 3000
                            });
                            runDiagnostics();
                          } catch (error) {
                            toast({
                              title: "Failed to Grant Admin",
                              description: error instanceof Error ? error.message : "RLS policy may be blocking this",
                              variant: "destructive"
                            });
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                      >
                        Make Me Admin (Test)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">🔗 Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => window.open('https://supabase.com/dashboard/project/hcnoxyfztviuwkiysitm/editor', '_blank')}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs flex items-center gap-2"
                      >
                        <ExternalLink size={12} />
                        Supabase Database
                      </Button>
                      
                      <Button 
                        onClick={() => window.open('https://dashboard.stripe.com/test/payments', '_blank')}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs flex items-center gap-2"
                      >
                        <ExternalLink size={12} />
                        Stripe Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Summary Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">📊 Quick Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {results.filter(r => r.status === 'success').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Success</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">
                          {results.filter(r => r.status === 'error').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Errors</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-600">
                          {results.filter(r => r.status === 'warning').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Warnings</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {results.filter(r => r.status === 'info').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Info</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="raw">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Raw Diagnostic Data</span>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
                        toast({ title: "Raw Data Copied!", duration: 2000 });
                      }}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Copy size={12} />
                      Copy JSON
                    </Button>
                  </div>
                  <pre className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded overflow-auto max-h-96 border">
                    {JSON.stringify(rawData, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
