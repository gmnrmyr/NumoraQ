
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { ArrowLeft, Rocket, Zap, Star } from "lucide-react";

const UpcomingFeatures = () => {
  const { settings } = useProjectSettings();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="brutalist-button mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-display font-bold text-foreground mb-4 brutalist-heading">
            UPCOMING FEATURES
          </h1>
          <p className="text-muted-foreground font-mono">
            Here's what's coming to {settings.project_name} in future updates.
          </p>
        </div>

        <Card className="brutalist-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-display brutalist-heading">
              <Rocket className="text-accent" size={24} />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.upcoming_features ? (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {settings.upcoming_features}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground font-mono">
                <p>Upcoming features will be announced soon! Stay tuned for:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Enhanced portfolio tracking</li>
                  <li>Advanced analytics and insights</li>
                  <li>Mobile app development</li>
                  <li>Additional cryptocurrency integrations</li>
                  <li>Social features and community tools</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="brutalist-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display brutalist-heading text-sm">
                <Zap className="text-yellow-400" size={20} />
                Performance Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm font-mono">
                Faster loading times, better responsiveness, and smoother user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="brutalist-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display brutalist-heading text-sm">
                <Star className="text-purple-400" size={20} />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm font-mono">
                Exclusive tools and analytics for premium subscribers and donors.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground font-mono text-sm mb-4">
            Want to suggest a feature or contribute to development?
          </p>
          <Link to="/donation">
            <Button className="brutalist-button">
              <Rocket size={16} className="mr-2" />
              Support Development
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;
