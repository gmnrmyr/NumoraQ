
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
  const { language, setLanguage } = useTranslation();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'pt' as const, name: 'Português', flag: '🇧🇷' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Globe size={16} />
          {showLabel && <span className="hidden sm:inline">Language</span>}
          {currentLanguage && (
            <span className="text-sm">
              {currentLanguage.flag} {showLabel ? '' : currentLanguage.code.toUpperCase()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white z-50">
        <DropdownMenuLabel className="text-xs text-gray-500 flex items-center gap-2">
          <Globe size={12} />
          Language / Idioma
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check size={16} className="text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
</DropdownMenu>

Now let's update the UserSettingsPanel to use the new LanguageSelector and remove the duplicate language selection:

<lov-write file_path="src/components/navbar/UserSettingsPanel.tsx">
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, DollarSign, User, UserPlus, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLivePrices } from '@/hooks/useLivePrices';
import { LanguageSelector } from '@/components/LanguageSelector';

export const UserSettingsPanel = () => {
  const { user, signOut } = useAuth();
  const { data, updateUserProfile, resetData, importFromJSON } = useFinancialData();
  const { language, t } = useTranslation();
  const { fetchLivePrices, isLiveDataEnabled } = useLivePrices();

  const createNewUser = (currency: 'BRL' | 'USD') => {
    const userEmail = user?.email || '';
    const templates = {
      BRL: {
        userProfile: {
          name: userEmail,
          defaultCurrency: 'BRL' as const,
          language: language
        },
        projectionMonths: 12,
        exchangeRates: {
          brlToUsd: 0.18,
          usdToBrl: 5.54,
          btcPrice: 588300,
          ethPrice: 14000,
          lastUpdated: new Date().toISOString()
        },
        liquidAssets: [],
        illiquidAssets: [],
        passiveIncome: [],
        activeIncome: [],
        expenses: [],
        tasks: [],
        debts: [],
        properties: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      },
      USD: {
        userProfile: {
          name: userEmail,
          defaultCurrency: 'USD' as const,
          language: language
        },
        projectionMonths: 12,
        exchangeRates: {
          brlToUsd: 0.18,
          usdToBrl: 5.54,
          btcPrice: 100000,
          ethPrice: 2500,
          lastUpdated: new Date().toISOString()
        },
        liquidAssets: [],
        illiquidAssets: [],
        passiveIncome: [],
        activeIncome: [],
        expenses: [],
        tasks: [],
        debts: [],
        properties: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };

    const templateJson = JSON.stringify(templates[currency]);
    importFromJSON(templateJson);
  };

  const handleCurrencyChange = async (newCurrency: 'BRL' | 'USD' | 'EUR') => {
    console.log('Currency changed to:', newCurrency);
    updateUserProfile({ defaultCurrency: newCurrency });
    
    if (user && isLiveDataEnabled) {
      console.log('Fetching prices for new currency:', newCurrency);
      await fetchLivePrices(newCurrency);
    }
  };

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'BRL': return { symbol: 'R$', flag: '🇧🇷' };
      case 'USD': return { symbol: '$', flag: '🇺🇸' };
      case 'EUR': return { symbol: '€', flag: '🇪🇺' };
      default: return { symbol: currency, flag: '' };
    }
  };

  const currencyDisplay = getCurrencyDisplay(data.userProfile.defaultCurrency);
  const displayName = data.userProfile.name || user?.email || "User";

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector variant="outline" size="sm" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">{t.userProfile}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white z-50">
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-2">
            <User size={16} />
            <span className="truncate">{displayName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Currency Selection */}
          <DropdownMenuLabel className="text-xs text-gray-500 flex items-center gap-2">
            <DollarSign size={12} />
            {t.defaultCurrency}: {currencyDisplay.flag} {currencyDisplay.symbol}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleCurrencyChange('BRL')}>
            🇧🇷 Real (BRL)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCurrencyChange('USD')}>
            🇺🇸 Dollar (USD)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCurrencyChange('EUR')}>
            🇪🇺 Euro (EUR)
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* User Management */}
          <DropdownMenuItem onClick={() => createNewUser('BRL')}>
            <UserPlus size={16} className="mr-2" />
            Novo Usuário (BRL 🇧🇷)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createNewUser('USD')}>
            <UserPlus size={16} className="mr-2" />
            New User (USD 🇺🇸)
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={resetData} className="text-red-600 hover:text-red-700">
            <Trash2 size={16} className="mr-2" />
            {t.resetData}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="text-red-600 hover:text-red-700">
            <LogOut size={16} className="mr-2" />
            {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
</DropdownMenu>

Finally, let's update the Navbar to show the language selector for non-authenticated users:

<lov-write file_path="src/components/Navbar.tsx">
import { useState, useEffect } from 'react';
import { BarChart3, Home, Signal, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLivePrices } from '@/hooks/useLivePrices';
import { useTranslation } from '@/contexts/TranslationContext';
import { EditableValue } from '@/components/ui/editable-value';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { VersionBadge } from '@/components/VersionBadge';
import { UserSettingsPanel } from '@/components/navbar/UserSettingsPanel';
import { LanguageSelector } from '@/components/LanguageSelector';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data, updateUserProfile } = useFinancialData();
  const { user } = useAuth();
  const { loading: pricesLoading, isLiveDataEnabled, timeSinceLastUpdate } = useLivePrices();
  const { t } = useTranslation();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const getLiveDataStatus = () => {
    if (!user) return { status: 'off', color: 'text-gray-500' };
    if (!isLiveDataEnabled) return { status: 'off', color: 'text-orange-500' };
    if (pricesLoading) return { status: 'updating', color: 'text-yellow-500 animate-pulse' };
    return { status: 'on', color: 'text-green-500' };
  };

  const liveDataInfo = getLiveDataStatus();

  return (
    <TooltipProvider>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-transform duration-300 ${
          isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <BarChart3 className="text-blue-600" size={20} />
                <span className="text-lg sm:text-xl font-bold text-gray-800">{t.appName}</span>
              </Link>
              <VersionBadge />
            </div>

            {/* User Profile and Status */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Name (Editable) */}
              {user && (
                <div className="hidden sm:flex items-center space-x-2">
                  <EditableValue
                    value={data.userProfile.name || user.email || "User"}
                    onSave={(value) => updateUserProfile({ name: String(value) })}
                    type="text"
                    className="text-gray-800 font-medium text-sm max-w-32"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              {/* Authentication Status */}
              {!user ? (
                <div className="flex items-center gap-2">
                  <LanguageSelector variant="outline" size="sm" />
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      <LogIn size={16} className="mr-2" />
                      <span className="hidden sm:inline">{t.signIn}</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <UserSettingsPanel />
              )}

              {/* Live Numbers Status */}
              {user && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Signal 
                    size={14} 
                    className={`transition-colors duration-300 ${liveDataInfo.color}`} 
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help hidden sm:block">
                        <span className={`text-xs font-medium transition-colors duration-300 ${liveDataInfo.color}`}>
                          {t.liveNumbers}: {liveDataInfo.status}
                        </span>
                        {timeSinceLastUpdate && liveDataInfo.status === 'on' && (
                          <div className="text-xs text-gray-500">
                            {t.lastUpdated} {timeSinceLastUpdate}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {liveDataInfo.status === 'off' 
                          ? 'Sign in to enable live price updates from real markets.'
                          : liveDataInfo.status === 'updating'
                            ? 'Live data is currently being updated...'
                            : `Live data fetching is enabled. Prices update automatically every 5 minutes.${timeSinceLastUpdate ? ` Last updated ${timeSinceLastUpdate}.` : ''}`
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-2 rounded-lg hover:bg-gray-100/70 transition-colors"
                  title="Go to top"
                >
                  <Home size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
};
