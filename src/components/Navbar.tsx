
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard, LogIn, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useCMSLogos } from "@/hooks/useCMSLogos";
import { useProjectSettings } from "@/hooks/useProjectSettings";
import { useNavigate, useLocation } from "react-router-dom";
import { DonationLinks } from "@/components/navbar/DonationLinks";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({
  activeTab,
  onTabChange
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    user
  } = useAuth();
  const {
    logos
  } = useCMSLogos();
  const {
    settings
  } = useProjectSettings();
  const navigate = useNavigate();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === 'leaderboard') {
      navigate('/leaderboard');
      setIsOpen(false);
      return;
    }
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    onTabChange(tab);
    setIsOpen(false);
    setTimeout(() => {
      const element = document.querySelector(`[data-section="${tab}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const isLeaderboardActive = location.pathname === '/leaderboard';

  return <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-background/70 backdrop-blur-xl border-b-2 border-border/50' : 'bg-background/80 backdrop-blur-lg border-b-2 border-border'}`}>
      {/* Top Row - Brand & Basic Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleTitleClick}>
            <img src={logos.square_logo_url} alt={`${settings.website_name} Logo`} className="h-8 w-auto" />
            <h1 className="text-xl font-bold font-mono text-accent uppercase">
              {settings.website_name}
            </h1>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="outline" size="sm" />
          
          {/* Always show hamburger menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="brutalist-button">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card/95 backdrop-blur-md border-l-2 border-border">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="font-bold text-lg font-mono uppercase text-accent">
                  {user ? 'Dashboard' : 'Dashboard Preview'}
                </h2>
                {dashboardItems.map(item => {
                  const Icon = item.icon;
                  return <Button 
                    key={item.id} 
                    variant={activeTab === item.id ? "default" : "ghost"} 
                    onClick={() => handleTabChange(item.id)} 
                    className={`justify-start font-mono brutalist-button ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={!user}
                  >
                    <Icon size={16} className="mr-2" />
                    {item.label}
                  </Button>;
                })}

                <div className="border-t border-border pt-4 mt-2">
                  <h3 className="font-bold text-sm font-mono uppercase text-accent mb-2">Community</h3>
                  <Button variant={isLeaderboardActive ? "default" : "ghost"} onClick={() => navigate('/leaderboard')} className="justify-start font-mono brutalist-button w-full">
                    <Trophy size={16} className="mr-2" />
                    Leaderboard
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <DonationLinks />
                  {!user && (
                    <>
                      <Button onClick={handleGetStarted} className="w-full font-mono brutalist-button mt-4">
                        <LogIn size={16} className="mr-2" />
                        Get Started
                      </Button>
                      <p className="text-xs text-muted-foreground font-mono mt-2 text-center">
                        Demo Mode - Sign in for cloud sync
                      </p>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Row - Navigation (Desktop Only for logged users) */}
      {user && <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-accent/5">
          <div className="flex items-center gap-2">
            {/* Dashboard Navigation */}
            <div className="flex items-center gap-1 px-3 py-1 bg-background/50 border border-accent/20 rounded-lg">
              <span className="text-xs font-mono uppercase text-muted-foreground mr-2">Dashboard:</span>
              {dashboardItems.map(item => {
                const Icon = item.icon;
                return <Button key={item.id} variant={activeTab === item.id ? "default" : "ghost"} onClick={() => handleTabChange(item.id)} size="sm" className="font-mono brutalist-button text-xs px-2 py-1 h-8">
                  <Icon size={14} className="mr-1" />
                  {item.label}
                </Button>;
              })}
            </div>
            
            {/* Community Navigation */}
            <div className="flex items-center gap-1 px-3 py-1 bg-background/50 border border-accent/20 rounded-lg">
              <span className="text-xs font-mono uppercase text-muted-foreground mr-2">Community:</span>
              <Button variant={isLeaderboardActive ? "default" : "ghost"} onClick={() => handleTabChange('leaderboard')} size="sm" className="font-mono brutalist-button text-xs px-2 py-1 h-8">
                <Trophy size={14} className="mr-1" />
                Leaderboard
              </Button>
            </div>
          </div>
          
          {/* Right side - Support only */}
          <div className="flex items-center gap-2">
            <DonationLinks />
          </div>
        </div>}
    </div>;
};
