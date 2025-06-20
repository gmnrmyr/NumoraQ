import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'outline',
  size = 'sm',
  showLabel = false
}) => {
  const {
    language,
    setLanguage
  } = useTranslation();
  const languages = [{
    code: 'en' as const,
    name: 'English',
    flag: '🇺🇸'
  }, {
    code: 'pt' as const,
    name: 'Português',
    flag: '🇧🇷'
  }, {
    code: 'es' as const,
    name: 'Español',
    flag: '🇪🇸'
  }, {
    code: 'fr' as const,
    name: 'Français',
    flag: '🇫🇷'
  }, {
    code: 'de' as const,
    name: 'Deutsch',
    flag: '🇩🇪'
  }];
  const currentLanguage = languages.find(lang => lang.code === language);
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-2 border-border z-50">
        <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2 font-mono uppercase">
          <Globe size={12} />
          Language / Idioma
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        {languages.map(lang => <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className="flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground font-mono">
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <Check size={16} className="text-accent" />}
          </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>;
};