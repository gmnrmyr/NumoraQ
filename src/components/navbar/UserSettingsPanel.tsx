
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { UserActions } from './UserActions';

export const UserSettingsPanel = () => {
  const { user } = useAuth();
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = data.userProfile.name || user?.email || "User";

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector variant="outline" size="sm" />
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button bg-stone-900 hover:bg-stone-800 text-slate-50">
            <Settings size={16} />
            <span className="hidden sm:inline font-mono uppercase">{t.userProfile}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-2 border-border z-50">
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-2 font-mono">
            <User size={16} />
            <span className="truncate">{displayName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          
          {/* Currency Selection */}
          <CurrencySelector onClose={() => setIsOpen(false)} />
          
          {/* User Management */}
          <UserActions onClose={() => setIsOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
