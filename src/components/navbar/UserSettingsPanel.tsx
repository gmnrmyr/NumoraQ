
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, Trophy, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { DonationLinks } from './DonationLinks';

export const UserSettingsPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    console.log('Attempting to navigate to tab:', tab);
    
    if (tab === 'leaderboard') {
      navigate('/leaderboard');
      return;
    }
    
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dashboardTabChange', {
          detail: { tab }
        }));
        
        const element = document.querySelector(`[data-section="${tab}"]`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
    } else {
      window.dispatchEvent(new CustomEvent('dashboardTabChange', {
        detail: { tab }
      }));
      
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${tab}"]`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button">
          <Settings size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-2 border-border z-50">
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
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground font-mono uppercase">
          Settings
        </DropdownMenuLabel>
        
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground">Language:</span>
            <LanguageSelector variant="outline" size="sm" showLabel={false} />
          </div>
        </div>
        
        <CurrencySelector onClose={() => {}} />
        
        <DropdownMenuSeparator className="bg-border" />
        
        <div className="px-2 py-1.5">
          <DonationLinks />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
