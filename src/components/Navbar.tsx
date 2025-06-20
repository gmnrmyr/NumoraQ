
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { SecureAdminPanel } from "@/components/SecureAdminPanel";
import { useSecureAdminAuth } from "@/hooks/useSecureAdminAuth";
import { NavbarHeader } from "@/components/navbar/NavbarHeader";
import { DesktopNavigation } from "@/components/navbar/DesktopNavigation";
import { MobileNavigation } from "@/components/navbar/MobileNavigation";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useSecureAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin panel shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        if (isAdmin) {
          setShowAdminPanel(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

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

  const handleProfileClick = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    onTabChange('portfolio');
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

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-background/70 backdrop-blur-xl border-b-2 border-border/50' : 'bg-background/80 backdrop-blur-lg border-b-2 border-border'}`}>
        {/* Top Row - Brand & Basic Actions */}
        <NavbarHeader 
          onTitleClick={handleTitleClick}
          onProfileClick={handleProfileClick}
          onMenuToggle={() => setIsOpen(true)}
        />

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div style={{ display: 'none' }} />
          </SheetTrigger>
          <SheetContent className="bg-card/95 backdrop-blur-md border-l-2 border-border">
            <MobileNavigation 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onProfileClick={handleProfileClick}
              onGetStarted={handleGetStarted}
            />
          </SheetContent>
        </Sheet>

        {/* Bottom Row - Navigation (Desktop Only for logged users) */}
        <DesktopNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onProfileClick={handleProfileClick}
        />
      </div>

      {/* Secure Admin Panel */}
      <SecureAdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </>
  );
};
