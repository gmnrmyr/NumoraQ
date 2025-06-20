
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SecureAdminPanel } from "@/components/SecureAdminPanel";
import { useSecureAdminAuth } from "@/hooks/useSecureAdminAuth";
import { NavbarHeader } from "@/components/navbar/NavbarHeader";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdmin } = useSecureAdminAuth();
  const navigate = useNavigate();

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

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-background/70 backdrop-blur-xl border-b-2 border-border/50' : 'bg-background/80 backdrop-blur-lg border-b-2 border-border'}`}>
        {/* Simple Header with Logo and Settings */}
        <NavbarHeader onTitleClick={handleTitleClick} />
      </div>

      {/* Secure Admin Panel */}
      <SecureAdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </>
  );
};
