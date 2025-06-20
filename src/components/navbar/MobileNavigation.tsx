
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, User, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { DonationLinks } from "@/components/navbar/DonationLinks";
import { LanguageSelector } from "@/components/LanguageSelector";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
  onGetStarted: () => void;
}

export const MobileNavigation = ({ activeTab, onTabChange, onProfileClick, onGetStarted }: MobileNavigationProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const dashboardItems = [{
    id: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase
  }, {
    id: 'income',
    label: 'Income',
    icon: TrendingUp
  }, {
    id: 'expenses',
    label: 'Expenses',
    icon: DollarSign
  }, {
    id: 'assets',
    label: 'Assets',
    icon: Home
  }, {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare
  }, {
    id: 'debt',
    label: 'Debt',
    icon: CreditCard
  }];

  const isLeaderboardActive = location.pathname === '/leaderboard';

  return (
    <div className="flex flex-col gap-4 mt-8">
      {/* First Line - Dashboard Navigation */}
      <div>
        <h2 className="font-bold text-lg font-mono uppercase text-accent mb-3">
          {user ? 'Dashboard' : 'Dashboard Preview'}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {dashboardItems.map(item => {
            const Icon = item.icon;
            return <Button 
              key={item.id} 
              variant={activeTab === item.id ? "default" : "ghost"} 
              onClick={() => onTabChange(item.id)} 
              className={`justify-start font-mono brutalist-button text-sm ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={!user}
              size="sm"
            >
              <Icon size={16} className="mr-2" />
              {item.label}
            </Button>;
          })}
        </div>
      </div>

      {/* Second Line - Community & Profile */}
      <div className="border-t border-border pt-4">
        <h3 className="font-bold text-sm font-mono uppercase text-accent mb-2">Community & Profile</h3>
        <div className="flex flex-col gap-2">
          <Button variant={isLeaderboardActive ? "default" : "ghost"} onClick={() => onTabChange('leaderboard')} className="justify-start font-mono brutalist-button w-full" size="sm">
            <Trophy size={16} className="mr-2" />
            Leaderboard
          </Button>
          
          {user && (
            <Button 
              onClick={onProfileClick}
              variant="ghost" 
              className="justify-start font-mono brutalist-button w-full"
              size="sm"
            >
              <User size={16} className="mr-2" />
              Profile
            </Button>
          )}
        </div>
      </div>

      {/* Third Line - Settings & Support */}
      <div className="border-t border-border pt-4">
        <h3 className="font-bold text-sm font-mono uppercase text-accent mb-2">Settings & Support</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground">Language:</span>
            <LanguageSelector variant="outline" size="sm" showLabel={false} />
          </div>
          
          <DonationLinks />
          
          {!user && (
            <>
              <Button onClick={onGetStarted} className="w-full font-mono brutalist-button mt-2">
                <LogIn size={16} className="mr-2" />
                Get Started
              </Button>
              <p className="text-xs text-muted-foreground font-mono text-center">
                Demo Mode - Sign in for cloud sync
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
