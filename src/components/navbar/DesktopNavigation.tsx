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
export const DesktopNavigation = ({
  activeTab,
  onTabChange,
  onProfileClick
}: DesktopNavigationProps) => {
  const {
    user
  } = useAuth();
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
  return;
};