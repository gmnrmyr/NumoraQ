
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Menu } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useCMSLogos } from "@/hooks/useCMSLogos";

interface NavbarHeaderProps {
  onTitleClick: () => void;
  onProfileClick: () => void;
  onMenuToggle: () => void;
}

export const NavbarHeader = ({ onTitleClick, onProfileClick, onMenuToggle }: NavbarHeaderProps) => {
  const { user } = useAuth();
  const { logos } = useCMSLogos();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onTitleClick}>
          <img 
            src={logos.horizontal_logo_url} 
            alt="Open Findash Logo" 
            className="h-6 sm:h-7 md:h-8 w-auto object-contain flex-shrink-0 min-w-0" 
            style={{ maxWidth: '180px' }}
          />
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-3">
        <LanguageSelector variant="outline" size="sm" />
        
        {/* Profile Button for logged users */}
        {user && (
          <Button 
            onClick={onProfileClick}
            variant="outline" 
            size="sm" 
            className="brutalist-button"
          >
            <User size={16} />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="brutalist-button"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Actions - Only Menu Toggle */}
      <div className="flex lg:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          className="brutalist-button"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </Button>
      </div>
    </div>
  );
};
