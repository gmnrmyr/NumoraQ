
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift, Users } from "lucide-react";

export const PointCategoriesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="brutalist-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-mono">
            <Calendar className="text-accent" size={16} />
            FIDELITY POINTS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground font-mono">
            • Daily Login: +1 pt<br/>
            • Weekly Streak: +50 pts<br/>
            • Monthly Streak: +200 pts
          </div>
        </CardContent>
      </Card>

      <Card className="brutalist-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-mono">
            <Gift className="text-accent" size={16} />
            PLATFORM SUPPORT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground font-mono">
            • Donation: +100 pts<br/>
            • Feature Request: +25 pts<br/>
            • Bug Report: +50 pts
          </div>
        </CardContent>
      </Card>

      <Card className="brutalist-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-mono">
            <Users className="text-accent" size={16} />
            COMMUNITY GROWTH
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground font-mono">
            • Referral Signup: +150 pts<br/>
            • Active Referral: +300 pts<br/>
            • Community Helper: +75 pts
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
