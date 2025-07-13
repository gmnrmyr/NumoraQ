import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Clock, CreditCard, Gift, User, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserTrackingData {
  user_id: string;
  user_name: string;
  user_email: string;
  premium_info: {
    is_premium: boolean;
    premium_type: string | null;
    activation_source: string | null;
    source_details: any;
    expires_at: string | null;
    activated_at: string | null;
  } | null;
  points_history: Array<{
    points: number;
    activity_type: string;
    points_source: string | null;
    source_details: any;
    activity_date: string;
    assigned_by_admin: string | null;
  }>;
  total_points: number;
}

export const AdminSourceTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchUser = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Search for user by email or name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .or(`name.ilike.%${searchQuery}%`)
        .single();

      if (profileError || !profile) {
        toast({
          title: "User Not Found",
          description: "Could not find user with that name or email",
          variant: "destructive"
        });
        return;
      }

      // Get premium status with source tracking
      const { data: premiumData, error: premiumError } = await supabase
        .from('user_premium_status')
        .select('is_premium, premium_type, activation_source, source_details, expires_at, activated_at')
        .eq('user_id', profile.id)
        .single();

      // Get points history with source tracking
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('points, activity_type, points_source, source_details, activity_date, assigned_by_admin')
        .eq('user_id', profile.id)
        .order('activity_date', { ascending: false });

      if (pointsError) {
        console.error('Points query error:', pointsError);
      }

      const totalPoints = (pointsData || []).reduce((sum, entry) => sum + (entry.points || 0), 0);

      setTrackingData({
        user_id: profile.id,
        user_name: profile.name || 'Unknown',
        user_email: searchQuery,
        premium_info: premiumData || null,
        points_history: pointsData || [],
        total_points: totalPoints
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Error searching for user data",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'stripe_payment':
      case 'stripe_donation':
        return <CreditCard size={14} className="text-blue-500" />;
      case 'premium_code':
        return <Gift size={14} className="text-purple-500" />;
      case 'trial_signup':
      case 'trial_backfill':
        return <Clock size={14} className="text-orange-500" />;
      case 'admin_assigned':
        return <User size={14} className="text-red-500" />;
      case 'daily_login':
        return <Clock size={14} className="text-green-500" />;
      default:
        return <Database size={14} className="text-gray-500" />;
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'stripe_payment':
      case 'stripe_donation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'premium_code':
        return 'bg-purple-500/20 text-purple-400 border-purple-500';
      case 'trial_signup':
      case 'trial_backfill':
        return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'admin_assigned':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'daily_login':
        return 'bg-green-500/20 text-green-400 border-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <Card className="bg-background/50 border-2 border-purple-600">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2 text-sm font-mono uppercase">
          <Database size={16} />
          User Source Tracking & Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Interface */}
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name..."
            className="font-mono bg-input border-2 border-border"
            onKeyDown={(e) => e.key === 'Enter' && searchUser()}
          />
          <Button
            onClick={searchUser}
            disabled={isSearching}
            className="brutalist-button"
          >
            <Search size={16} />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* User Tracking Data */}
        {trackingData && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="bg-muted p-4 border-2 border-border rounded">
              <div className="font-mono text-sm">
                <div className="font-bold text-accent mb-2">USER: {trackingData.user_name}</div>
                <div>ID: {trackingData.user_id}</div>
                <div>Total Points: {trackingData.total_points}</div>
              </div>
            </div>

            {/* Premium Status Tracking */}
            {trackingData.premium_info && (
              <div className="bg-muted p-4 border-2 border-border rounded">
                <div className="font-mono text-sm space-y-2">
                  <div className="font-bold text-green-400 mb-2">PREMIUM STATUS:</div>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <Badge className={trackingData.premium_info.is_premium ? 'bg-green-600' : 'bg-orange-600'}>
                      {trackingData.premium_info.is_premium ? 'PREMIUM' : 'TRIAL'}
                    </Badge>
                  </div>
                  <div>Type: {trackingData.premium_info.premium_type || 'None'}</div>
                  {trackingData.premium_info.activation_source && (
                    <div className="flex items-center gap-2">
                      <span>Source:</span>
                      {getSourceIcon(trackingData.premium_info.activation_source)}
                      <Badge className={getSourceBadgeColor(trackingData.premium_info.activation_source)}>
                        {trackingData.premium_info.activation_source}
                      </Badge>
                    </div>
                  )}
                  {trackingData.premium_info.expires_at && (
                    <div>Expires: {new Date(trackingData.premium_info.expires_at).toLocaleDateString()}</div>
                  )}
                  {trackingData.premium_info.source_details && (
                    <div className="text-xs text-muted-foreground">
                      Details: {JSON.stringify(trackingData.premium_info.source_details)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Points History */}
            <div className="bg-muted p-4 border-2 border-border rounded max-h-64 overflow-y-auto">
              <div className="font-mono text-sm">
                <div className="font-bold text-blue-400 mb-2">POINTS HISTORY:</div>
                {trackingData.points_history.length === 0 ? (
                  <div className="text-muted-foreground">No points history found</div>
                ) : (
                  <div className="space-y-2">
                    {trackingData.points_history.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-background/50 rounded border">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-accent">+{entry.points}</span>
                          <span>{entry.activity_type}</span>
                          {entry.points_source && (
                            <>
                              {getSourceIcon(entry.points_source)}
                              <Badge className={`${getSourceBadgeColor(entry.points_source)} text-xs`}>
                                {entry.points_source}
                              </Badge>
                            </>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {entry.activity_date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 