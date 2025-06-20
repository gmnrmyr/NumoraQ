
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, User, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { DonationLinks } from "@/components/navbar/DonationLinks";

interface DesktopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
}

export const DesktopNavigation = ({ activeTab, onTabChange, onProfileClick }: DesktopNavigationProps) => {
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

  if (!user) return null;

  return (
    <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-accent/5">
      <div className="flex items-center gap-2">
        {/* Dashboard Navigation */}
        <div className="flex items-center gap-1 px-3 py-1 bg-background/50 border border-accent/20 rounded-lg">
          <span className="text-xs font-mono uppercase text-muted-foreground mr-2">Dashboard:</span>
          {dashboardItems.map(item => {
            const Icon = item.icon;
            return <Button key={item.id} variant={activeTab === item.id ? "default" : "ghost"} onClick={() => onTabChange(item.id)} size="sm" className="font-mono brutalist-button text-xs px-2 py-1 h-8">
              <Icon size={14} className="mr-1" />
              {item.label}
            </Button>;
          })}
        </div>
        
        {/* Community Navigation */}
        <div className="flex items-center gap-1 px-3 py-1 bg-background/50 border border-accent/20 rounded-lg">
          <span className="text-xs font-mono uppercase text-muted-foreground mr-2">Community:</span>
          <Button variant={isLeaderboardActive ? "default" : "ghost"} onClick={() => onTabChange('leaderboard')} size="sm" className="font-mono brutalist-button text-xs px-2 py-1 h-8">
            <Trophy size={14} className="mr-1" />
            Leaderboard
          </Button>
        </div>
      </div>
      
      {/* Right side - Profile and Support */}
      <div className="flex items-center gap-2">
        <Button 
          onClick={onProfileClick}
          variant="ghost" 
          size="sm" 
          className="font-mono brutalist-button text-xs px-2 py-1 h-8"
        >
          <User size={14} className="mr-1" />
          Profile
        </Button>
        <DonationLinks />
      </div>
    </div>
  );
};
