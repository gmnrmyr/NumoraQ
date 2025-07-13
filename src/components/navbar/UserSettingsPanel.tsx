
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, User, LogIn, LogOut, Trophy, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useDashboardMode } from '@/contexts/DashboardModeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { DonationLinks } from './DonationLinks';
import { UserFeedbackDialog } from '@/components/UserFeedbackDialog';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

export const UserSettingsPanel = () => {
  const { user, signOut } = useAuth();
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const { mode, setMode, isSimpleMode } = useDashboardMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState<string>('');

  // Load user profile name from Supabase
  useEffect(() => {
    const loadProfileName = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          if (!error && profile?.name) {
            setProfileName(profile.name);
          }
        } catch (error) {
          console.error('Error loading profile name:', error);
        }
      }
    };

    loadProfileName();
  }, [user]);

  const displayName = profileName || user?.email || "User";

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
        // Dispatch custom event to change tabs
        window.dispatchEvent(new CustomEvent('dashboardTabChange', {
          detail: { tab }
        }));
        
        const element = document.querySelector(`[data-section="${tab}"]`);
        console.log('Looking for element with data-section:', tab, 'Found:', element);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
    } else {
      setIsOpen(false);
      // We're already on dashboard, dispatch event and scroll
      window.dispatchEvent(new CustomEvent('dashboardTabChange', {
        detail: { tab }
      }));
      
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${tab}"]`);
        console.log('Looking for element with data-section:', tab, 'Found:', element);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const handleProfileClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setIsOpen(false);
      // Navigate to portfolio section which contains USER_INFO_CONFIG_UI
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dashboardTabChange', {
          detail: { tab: 'portfolio' }
        }));
        
        // Scroll to the top of the page first, then to portfolio section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          const element = document.querySelector('[data-section="portfolio"]');
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 200);
      }, 300);
    } else {
      setIsOpen(false);
      // We're already on dashboard
      window.dispatchEvent(new CustomEvent('dashboardTabChange', {
        detail: { tab: 'portfolio' }
      }));
      
      // Scroll to the top first, then to portfolio
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const element = document.querySelector('[data-section="portfolio"]');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 200);
    }
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
    { id: 'portfolio', label: t.portfolio, icon: Briefcase },
    { id: 'income', label: t.income, icon: TrendingUp },
    { id: 'expenses', label: t.expenses, icon: DollarSign },
    { id: 'assets', label: t.assets, icon: Home },
    { id: 'tasks', label: t.tasks, icon: CheckSquare },
    { id: 'debt', label: t.debt, icon: CreditCard }
  ];

  // Auth Action Component for reuse
  const AuthActionItem = () => (
    <>
      <DropdownMenuItem 
        onClick={handleAuthAction}
        className="text-primary hover:text-primary-foreground hover:bg-primary font-mono"
      >
        {user ? <LogOut size={16} className="mr-2" /> : <LogIn size={16} className="mr-2" />}
        {user ? t.signOut : t.signIn}
      </DropdownMenuItem>
      
      {!user && (
        <p className="text-xs text-muted-foreground font-mono text-center px-2 py-1">
          Demo Mode - Sign in for cloud sync
        </p>
      )}
    </>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-card border-2 border-border z-50 max-h-[80vh] overflow-y-auto md:max-h-none md:overflow-y-visible"
      >
        {/* Mobile: Auth Action at top */}
        <div className="block md:hidden">
          <AuthActionItem />
          <DropdownMenuSeparator className="bg-border" />
        </div>

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
        
        {/* Dashboard Mode Toggle - Available for all users */}
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">Dashboard Mode:</span>
              {isSimpleMode && (
                <span className="text-xs bg-yellow-500/20 text-yellow-600 px-1.5 py-0.5 rounded font-mono">
                  BETA
                </span>
              )}
            </div>
            <Switch
              checked={isSimpleMode}
              onCheckedChange={(checked) => setMode(checked ? 'simple' : 'advanced')}
              className="data-[state=checked]:bg-primary"
            />
          </div>
                      <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-mono text-muted-foreground">
                {isSimpleMode ? 'Simple' : 'Advanced'}
              </span>
              {isSimpleMode && (
                <span className="text-xs text-muted-foreground font-mono">
                  For beginners
                </span>
              )}
            </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Dashboard Navigation - Available for all users */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-mono uppercase">
          {t.dashboardSections}
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
          {t.communityFeatures}
        </DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleTabChange('leaderboard')}
          className="hover:bg-accent hover:text-accent-foreground font-mono"
        >
          <Trophy size={16} className="mr-2" />
          Leaderboard
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleProfileClick}
          className="hover:bg-accent hover:text-accent-foreground font-mono"
        >
          <User size={16} className="mr-2" />
          {t.userProfile}
        </DropdownMenuItem>
        
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
        <div className="px-2 py-1.5 space-y-2">
          <DonationLinks />
          <UserFeedbackDialog />
        </div>
        
        {/* Desktop: Auth Action at bottom */}
        <div className="hidden md:block">
          <DropdownMenuSeparator className="bg-border" />
          <AuthActionItem />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
