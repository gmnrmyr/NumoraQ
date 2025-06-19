
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export const AnalyticsTab: React.FC = () => {
  // Mock analytics data - in real app this would come from your analytics service
  const analytics = {
    totalUsers: 1247,
    activeUsers: 389,
    revenue: 2850,
    conversionRate: 3.2,
    topFeatures: [
      { name: 'Portfolio Tracking', usage: 89 },
      { name: 'Expense Management', usage: 76 },
      { name: 'Asset Management', usage: 65 },
      { name: 'Wallet Integration', usage: 52 }
    ],
    userGrowth: '+23%',
    revenueGrowth: '+15%'
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted p-4 border-2 border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm font-mono text-muted-foreground">Total Users</span>
          </div>
          <div className="text-2xl font-bold font-mono">{analytics.totalUsers.toLocaleString()}</div>
          <Badge className="bg-green-100 text-green-800 text-xs">{analytics.userGrowth}</Badge>
        </div>

        <div className="bg-muted p-4 border-2 border-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-500" />
            <span className="text-sm font-mono text-muted-foreground">Active Users</span>
          </div>
          <div className="text-2xl font-bold font-mono">{analytics.activeUsers}</div>
          <div className="text-xs text-muted-foreground font-mono">Last 30 days</div>
        </div>

        <div className="bg-muted p-4 border-2 border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-yellow-500" />
            <span className="text-sm font-mono text-muted-foreground">Revenue</span>
          </div>
          <div className="text-2xl font-bold font-mono">${analytics.revenue}</div>
          <Badge className="bg-green-100 text-green-800 text-xs">{analytics.revenueGrowth}</Badge>
        </div>

        <div className="bg-muted p-4 border-2 border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-purple-500" />
            <span className="text-sm font-mono text-muted-foreground">Conversion</span>
          </div>
          <div className="text-2xl font-bold font-mono">{analytics.conversionRate}%</div>
          <div className="text-xs text-muted-foreground font-mono">Signup to paid</div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="bg-muted p-4 border-2 border-border">
        <h3 className="font-mono font-bold mb-4">Feature Usage</h3>
        <div className="space-y-3">
          {analytics.topFeatures.map((feature) => (
            <div key={feature.name} className="flex items-center justify-between">
              <span className="font-mono text-sm">{feature.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-background rounded h-2">
                  <div 
                    className="bg-accent h-2 rounded" 
                    style={{ width: `${feature.usage}%` }}
                  />
                </div>
                <span className="font-mono text-sm w-12">{feature.usage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-yellow-50 border-2 border-yellow-200 p-3">
        <div className="text-sm font-mono text-yellow-800">
          📊 <strong>Analytics Integration:</strong> Connect Google Analytics, Mixpanel, or other analytics services for real-time data.
        </div>
      </div>
    </div>
  );
};
