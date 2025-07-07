
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { NavbarLogo } from "@/components/ui/logo";
import { UserSettingsPanel } from "@/components/navbar/UserSettingsPanel";
import { useAuth } from '@/contexts/AuthContext';

interface NavbarHeaderProps {
  onTitleClick: () => void;
}

export const NavbarHeader = ({
  onTitleClick
}: NavbarHeaderProps) => {
  return <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
      <div className="flex items-center gap-4">
        <NavbarLogo onClick={onTitleClick} />
      </div>

      {/* Universal Settings Button */}
      <div className="flex items-center">
        <UserSettingsPanel />
      </div>
    </div>;
};
