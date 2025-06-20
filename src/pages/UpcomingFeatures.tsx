
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Construction, Star, Zap } from 'lucide-react';

const UpcomingFeatures = () => {
  const { settings } = useProjectSettings();
  const [activeTab, setActiveTab] = React.useState('');

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-accent uppercase tracking-wider flex items-center justify-center gap-3">
              <Construction size={40} />
              Upcoming Features
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay tuned for exciting new features coming to {settings.website_name}!
            </p>
          </div>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono uppercase flex items-center gap-2">
                <Star size={20} />
                What's Coming Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 border border-border rounded">
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {settings.upcoming_features_text || 'Exciting new features coming soon!'}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-600">
              <CardHeader>
                <CardTitle className="font-mono text-blue-400">🚀 Auto-Wallet Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  Automatic wallet value fetching for BTC, EVM, and Solana chains with real-time portfolio updates.
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-600">
              <CardHeader>
                <CardTitle className="font-mono text-purple-400">💎 NFT Floor Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  Integration with OpenSea to track NFT collection floor prices and portfolio valuation.
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-600">
              <CardHeader>
                <CardTitle className="font-mono text-green-400">📊 Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  Enhanced portfolio analytics with profit/loss tracking and performance metrics.
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-600">
              <CardHeader>
                <CardTitle className="font-mono text-yellow-400">🎯 Goal Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                  Set financial goals and track progress with detailed projections and milestones.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-accent/10 p-6 border-2 border-accent rounded">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-accent" />
              <h3 className="font-mono font-bold text-accent">Stay Updated</h3>
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              Follow our development progress and get early access to new features by supporting the project. 
              Premium users get priority access to beta features!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpcomingFeatures;
