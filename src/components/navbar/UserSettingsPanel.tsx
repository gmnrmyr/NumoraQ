
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, User, LogIn, LogOut, Trophy, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { DonationLinks } from './DonationLinks';

export const UserSettingsPanel = () => {
  const { user, signOut } = useAuth();
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = data.userProfile.name || user?.email || "User";

  const handleTabChange = (tab: string) => {
    console.log('Attempting to navigate to tab:', tab);
    
    if (tab === 'leaderboard') {
      navigate('/leaderboard');
      setIsOpen(false);
      return;
    }
    
    // Always navigate to dashboard first
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setIsOpen(false);
      // Use a longer timeout to ensure page loads
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${tab}"]`);
        console.log('Looking for element with data-section:', tab, 'Found:', element);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // If data-section doesn't work, try to trigger tab change via the Tabs component
          const tabTrigger = document.querySelector(`[value="${tab}"]`);
          console.log('Looking for tab trigger with value:', tab, 'Found:', tabTrigger);
          if (tabTrigger) {
            (tabTrigger as HTMLElement).click();
          }
        }
      }, 500);
    } else {
      setIsOpen(false);
      // We're already on dashboard, try to navigate to the section
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${tab}"]`);
        console.log('Looking for element with data-section:', tab, 'Found:', element);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // If data-section doesn't work, try to trigger tab change via the Tabs component
          const tabTrigger = document.querySelector(`[value="${tab}"]`);
          console.log('Looking for tab trigger with value:', tab, 'Found:', tabTrigger);
          if (tabTrigger) {
            (tabTrigger as HTMLElement).click();
          }
        }
      }, 100);
    }
  };

  const handleProfileClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    setIsOpen(false);
    setTimeout(() => {
      const element = document.querySelector(`[data-section="portfolio"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
    setIsOpen(false);
  };

  const dashboardItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'assets', label: 'Assets', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'debt', label: 'Debt', icon: CreditCard }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-2 border-border z-50">
        {/* User Info */}
        {user && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 font-mono">
              <User size={16} />
              <span className="truncate">{displayName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
          </>
        )}
        
        {/* Dashboard Navigation - Available for all users */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-mono uppercase">
          Dashboard
        </DropdownMenuLabel>
        {dashboardItems.map(item => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem 
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className="hover:bg-accent hover:text-accent-foreground font-mono"
            >
              <Icon size={16} className="mr-2" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Community */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-mono uppercase">
          Community
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleTabChange('leaderboard')}
          className="hover:bg-accent hover:text-accent-foreground font-mono"
        >
          <Trophy size={16} className="mr-2" />
          Leaderboard
        </DropdownMenuItem>
        
        {user && (
          <DropdownMenuItem 
            onClick={handleProfileClick}
            className="hover:bg-accent hover:text-accent-foreground font-mono"
          >
            <User size={16} className="mr-2" />
            Profile
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Settings */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-mono uppercase">
          Settings
        </DropdownMenuLabel>
        
        {/* Language Selection */}
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground">Language:</span>
            <LanguageSelector variant="outline" size="sm" showLabel={false} />
          </div>
        </div>
        
        {/* Currency Selection */}
        <CurrencySelector onClose={() => setIsOpen(false)} />
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Support */}
        <div className="px-2 py-1.5">
          <DonationLinks />
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Auth Action */}
        <DropdownMenuItem 
          onClick={handleAuthAction}
          className="text-primary hover:text-primary-foreground hover:bg-primary font-mono"
        >
          {user ? <LogOut size={16} className="mr-2" /> : <LogIn size={16} className="mr-2" />}
          {user ? 'Sign Out' : 'Sign In'}
        </DropdownMenuItem>
        
        {!user && (
          <p className="text-xs text-muted-foreground font-mono text-center px-2 py-1">
            Demo Mode - Sign in for cloud sync
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
