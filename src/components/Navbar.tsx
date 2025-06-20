import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Trophy, LogIn, Menu, Heart } from "lucide-react";
import { LanguageSelector } from './navbar/LanguageSelector';
import { CurrencySelector } from './navbar/CurrencySelector';
import { UserActions } from './navbar/UserActions';
import { UserSettingsPanel } from './navbar/UserSettingsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from "@/contexts/TranslationContext";

interface NavbarProps {
  activeTab: 'home' | 'dashboard' | 'leaderboard' | 'support' | string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showUserPanel, setShowUserPanel] = useState(false);

  const handleNavigation = (path: string, tab: string) => {
    navigate(path);
    onTabChange(tab as any);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/89c457c6-e2ea-43c9-b3b5-7b544e95d75b.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-xl font-bold font-mono text-accent tracking-tight">
                  OPEN FINDASH
                </h1>
                <div className="text-xs text-muted-foreground font-mono tracking-wider hidden sm:block">
                  FINANCIAL COMMAND CENTER
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation('/', 'home')}
              className="brutalist-button text-xs font-mono"
            >
              <Home size={14} className="mr-1" />
              HOME
            </Button>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation('/dashboard', 'dashboard')}
              className="brutalist-button text-xs font-mono"
            >
              <BarChart3 size={14} className="mr-1" />
              DASHBOARD
            </Button>
            <Button
              variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation('/leaderboard', 'leaderboard')}
              className="brutalist-button text-xs font-mono"
            >
              <Trophy size={14} className="mr-1" />
              LEADERBOARD
            </Button>
            <Button
              variant={activeTab === 'support' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation('/support', 'support')}
              className="brutalist-button text-xs font-mono"
            >
              <Heart size={14} className="mr-1" />
              SUPPORT
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language & Currency Selectors */}
            <div className="hidden sm:flex items-center gap-1">
              <LanguageSelector />
              <CurrencySelector />
            </div>

            {/* User Authentication */}
            {user ? (
              <UserActions showUserPanel={showUserPanel} setShowUserPanel={setShowUserPanel} />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleNavigation('/auth', 'auth')}
                  size="sm"
                  variant="outline"
                  className="brutalist-button text-xs font-mono"
                >
                  <LogIn size={12} className="sm:mr-1" />
                  <span className="hidden sm:inline">LOGIN</span>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserPanel(!showUserPanel)}
                className="brutalist-button"
              >
                <Menu size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showUserPanel && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-1 p-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  handleNavigation('/', 'home');
                  setShowUserPanel(false);
                }}
                className="brutalist-button text-xs font-mono justify-start"
              >
                <Home size={14} className="mr-2" />
                HOME
              </Button>
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  handleNavigation('/dashboard', 'dashboard');
                  setShowUserPanel(false);
                }}
                className="brutalist-button text-xs font-mono justify-start"
              >
                <BarChart3 size={14} className="mr-2" />
                DASHBOARD
              </Button>
              <Button
                variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  handleNavigation('/leaderboard', 'leaderboard');
                  setShowUserPanel(false);
                }}
                className="brutalist-button text-xs font-mono justify-start"
              >
                <Trophy size={14} className="mr-2" />
                LEADERBOARD
              </Button>
              <Button
                variant={activeTab === 'support' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  handleNavigation('/support', 'support');
                  setShowUserPanel(false);
                }}
                className="brutalist-button text-xs font-mono justify-start"
              >
                <Heart size={14} className="mr-2" />
                SUPPORT
              </Button>
              {!user && (
                <Button
                  onClick={() => {
                    handleNavigation('/auth', 'auth');
                    setShowUserPanel(false);
                  }}
                  size="sm"
                  variant="outline"
                  className="brutalist-button text-xs font-mono justify-start"
                >
                  <LogIn size={14} className="mr-2" />
                  LOGIN
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Settings Panel */}
      {showUserPanel && user && (
        <UserSettingsPanel onClose={() => setShowUserPanel(false)} />
      )}
    </nav>
  );
};
