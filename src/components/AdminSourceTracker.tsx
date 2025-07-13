import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Gift, CreditCard, User, Calendar, Database, Search, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PremiumStatusRecord {
  user_id: string;
  name: string;
  user_uid: string;
  is_premium: boolean;
  premium_type: string;
  activated_at: string;
  expires_at: string;
  activation_source: string;
  source_details: any;
  activated_code: string;
  activated_by_admin: string;
  status: string;
  days_remaining: number;
}

interface PointsRecord {
  user_id: string;
  name: string;
  user_uid: string;
  points: number;
  activity_type: string;
  activity_date: string;
  points_source: string;
  source_details: any;
  assigned_by_admin: string;
  assigned_by_admin_name: string;
  created_at: string;
}

export const AdminSourceTracker = () => {
  const [premiumRecords, setPremiumRecords] = useState<PremiumStatusRecord[]>([]);
  const [pointsRecords, setPointsRecords] = useState<PointsRecord[]>([]);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPremium, setFilteredPremium] = useState<PremiumStatusRecord[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<PointsRecord[]>([]);

  useEffect(() => {
    loadPremiumRecords();
    loadPointsRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchQuery, premiumRecords, pointsRecords]);

  const loadPremiumRecords = async () => {
    setLoadingPremium(true);
    try {
      const { data, error } = await supabase
        .from('admin_premium_status')
        .select('*')
        .order('activated_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPremiumRecords(data || []);
    } catch (error) {
      console.error('Error loading premium records:', error);
      toast({
        title: "Error",
        description: "Failed to load premium status records",
        variant: "destructive"
      });
    } finally {
      setLoadingPremium(false);
    }
  };

  const loadPointsRecords = async () => {
    setLoadingPoints(true);
    try {
      const { data, error } = await supabase
        .from('admin_user_points')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setPointsRecords(data || []);
    } catch (error) {
      console.error('Error loading points records:', error);
      toast({
        title: "Error",
        description: "Failed to load points records",
        variant: "destructive"
      });
    } finally {
      setLoadingPoints(false);
    }
  };

  const filterRecords = () => {
    if (!searchQuery.trim()) {
      setFilteredPremium(premiumRecords);
      setFilteredPoints(pointsRecords);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const filteredP = premiumRecords.filter(record => 
      record.name.toLowerCase().includes(query) ||
      record.user_uid.toLowerCase().includes(query) ||
      record.activation_source.toLowerCase().includes(query) ||
      record.premium_type.toLowerCase().includes(query)
    );

    const filteredPt = pointsRecords.filter(record => 
      record.name.toLowerCase().includes(query) ||
      record.user_uid.toLowerCase().includes(query) ||
      record.points_source.toLowerCase().includes(query) ||
      record.activity_type.toLowerCase().includes(query)
    );

    setFilteredPremium(filteredP);
    setFilteredPoints(filteredPt);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'stripe_payment':
        return <CreditCard size={16} className="text-green-500" />;
      case 'premium_code':
        return <Gift size={16} className="text-purple-500" />;
      case 'auto_trial':
        return <Zap size={16} className="text-blue-500" />;
      case 'admin_assigned':
        return <Crown size={16} className="text-yellow-500" />;
      case 'daily_login':
        return <Calendar size={16} className="text-orange-500" />;
      default:
        return <Database size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string, isPremium: boolean) => {
    switch (status) {
      case 'Active Premium':
        return <Badge className="bg-green-600 text-white">Active Premium</Badge>;
      case 'Trial':
        return <Badge className="bg-blue-600 text-white">Trial</Badge>;
      case 'Expired':
        return <Badge className="bg-red-600 text-white">Expired</Badge>;
      case 'Lifetime':
        return <Badge className="bg-purple-600 text-white">Lifetime</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSourceDetails = (details: any) => {
    if (!details) return '';
    
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    } catch {
      return String(details);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <Database size={20} />
            Source Tracking Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Search size={16} />
            <Input
              placeholder="Search by name, UID, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-mono max-w-sm"
            />
            <Button
              onClick={() => {
                loadPremiumRecords();
                loadPointsRecords();
              }}
              variant="outline"
              size="sm"
              className="font-mono"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="premium" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="premium" className="font-mono">
            <Crown size={16} className="mr-2" />
            Premium Status ({filteredPremium.length})
          </TabsTrigger>
          <TabsTrigger value="points" className="font-mono">
            <Zap size={16} className="mr-2" />
            Points History ({filteredPoints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="premium" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Premium Status Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPremium ? (
                <div className="text-center p-8">
                  <div className="font-mono text-muted-foreground">Loading premium records...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-mono">User</TableHead>
                        <TableHead className="font-mono">Status</TableHead>
                        <TableHead className="font-mono">Type</TableHead>
                        <TableHead className="font-mono">Source</TableHead>
                        <TableHead className="font-mono">Activated</TableHead>
                        <TableHead className="font-mono">Expires</TableHead>
                        <TableHead className="font-mono">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPremium.map((record) => (
                        <TableRow key={`${record.user_id}-${record.activated_at}`}>
                          <TableCell className="font-mono">
                            <div>
                              <div className="font-semibold">{record.name}</div>
                              <div className="text-sm text-muted-foreground">{record.user_uid}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(record.status, record.is_premium)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {record.premium_type}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSourceIcon(record.activation_source)}
                              <span className="font-mono text-sm">{record.activation_source}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatDate(record.activated_at)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {record.expires_at ? formatDate(record.expires_at) : 'Never'}
                          </TableCell>
                          <TableCell className="font-mono text-xs max-w-xs">
                            <div className="truncate" title={formatSourceDetails(record.source_details)}>
                              {formatSourceDetails(record.source_details)}
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

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Points History & Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPoints ? (
                <div className="text-center p-8">
                  <div className="font-mono text-muted-foreground">Loading points records...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-mono">User</TableHead>
                        <TableHead className="font-mono">Points</TableHead>
                        <TableHead className="font-mono">Type</TableHead>
                        <TableHead className="font-mono">Source</TableHead>
                        <TableHead className="font-mono">Date</TableHead>
                        <TableHead className="font-mono">Admin</TableHead>
                        <TableHead className="font-mono">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPoints.map((record, index) => (
                        <TableRow key={`${record.user_id}-${record.created_at}-${index}`}>
                          <TableCell className="font-mono">
                            <div>
                              <div className="font-semibold">{record.name}</div>
                              <div className="text-sm text-muted-foreground">{record.user_uid}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono font-bold">
                            +{record.points}
                          </TableCell>
                          <TableCell className="font-mono">
                            {record.activity_type}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSourceIcon(record.points_source)}
                              <span className="font-mono text-sm">{record.points_source}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatDate(record.created_at)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {record.assigned_by_admin_name || 'System'}
                          </TableCell>
                          <TableCell className="font-mono text-xs max-w-xs">
                            <div className="truncate" title={formatSourceDetails(record.source_details)}>
                              {formatSourceDetails(record.source_details)}
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
      </Tabs>
    </div>
  );
}; 