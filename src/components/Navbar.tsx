
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard, Settings, User, Cloud, CloudOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { Badge } from "@/components/ui/badge";
import { UserSettingsPanel } from "@/components/navbar/UserSettingsPanel";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data, syncState, lastSync } = useFinancialData();
  const navigate = useNavigate();

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'assets', label: 'Assets', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'debt', label: 'Debt', icon: CreditCard },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
    
    // Scroll to section with smooth behavior
    setTimeout(() => {
      const element = document.querySelector(`[data-section="${tab}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const getSyncIcon = () => {
    if (syncState === 'saving') return <CloudOff className="animate-spin" size={14} />;
    if (syncState === 'loading') return <CloudOff className="animate-spin" size={14} />;
    if (syncState === 'error') return <CloudOff size={14} className="text-red-500" />;
    return <Cloud size={14} className="text-green-500" />;
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never synced';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b-2 border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 
            className="text-xl font-bold font-mono text-accent cursor-pointer hover:text-accent/80 transition-colors"
            onClick={handleTitleClick}
          >
            OPEN FINDASH
          </h1>
          {user?.email && (
            <Badge variant="outline" className="hidden sm:flex font-mono items-center gap-2">
              {user.email}
              {user && (
                <div className="flex items-center gap-1" title={`Last sync: ${formatLastSync(lastSync)}`}>
                  {getSyncIcon()}
                </div>
              )}
            </Badge>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => handleTabChange(item.id)}
                className="font-mono brutalist-button"
                size="sm"
              >
                <Icon size={16} className="mr-1" />
                {item.label}
              </Button>
            );
          })}
          
          {/* Language selector for all users */}
          <LanguageSelector variant="outline" size="sm" />
          
          {/* User Settings for logged in users OR Login for logged out users */}
          {user ? (
            <UserSettingsPanel />
          ) : (
            <Button 
              onClick={handleGetStarted}
              className="font-mono brutalist-button"
              size="sm"
            >
              <LogIn size={16} className="mr-1" />
              Get Started
            </Button>
          )}
        </nav>

        {/* Mobile Navigation - Show for ALL users */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelector variant="outline" size="sm" />
          {user && <UserSettingsPanel />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="brutalist-button">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-l-2 border-border">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="font-bold text-lg font-mono uppercase text-accent">Navigation</h2>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      onClick={() => handleTabChange(item.id)}
                      className="justify-start font-mono brutalist-button"
                    >
                      <Icon size={16} className="mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
                
                {/* Mobile Login/Get Started if not logged in */}
                {!user && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full font-mono brutalist-button"
                    >
                      <LogIn size={16} className="mr-2" />
                      Get Started
                    </Button>
                    <p className="text-xs text-muted-foreground font-mono mt-2 text-center">
                      Demo Mode - Sign in for cloud sync
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
