
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Mail, LogOut, DollarSign, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { CurrencySelector } from './CurrencySelector';

export const NavbarUserProfile = () => {
  const { user, signOut } = useAuth();
  const { data } = useFinancialData();
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = data.userProfile.name || user?.email || "User";
  
  const truncateEmail = (email: string) => {
    if (email.length <= 20) return email;
    return email.substring(0, 17) + '...';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'pt' | 'es' | 'fr' | 'de') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (!user) return null;

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'pt' as const, name: 'Português', flag: '🇧🇷' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button bg-stone-900 hover:bg-stone-800 text-slate-50">
          <User size={16} />
          <span className="hidden sm:inline font-mono uppercase truncate max-w-24">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-2 border-border z-50">
        {/* User Info */}
        <DropdownMenuLabel className="font-mono">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span className="font-medium">{displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail size={12} />
              <span>{truncateEmail(user.email)}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Currency Selection */}
        <CurrencySelector onClose={() => setIsOpen(false)} />
        
        {/* Language Selection */}
        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2 font-mono uppercase">
          <Globe size={12} />
          Language: {currentLanguage?.flag} {currentLanguage?.name}
        </DropdownMenuLabel>
        {languages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)} 
            className="hover:bg-accent hover:text-accent-foreground font-mono text-sm"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <span className="ml-auto text-accent">✓</span>}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive font-mono"
        >
          <LogOut size={16} className="mr-2" />
          {t.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
