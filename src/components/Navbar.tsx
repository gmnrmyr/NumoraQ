
import { useState, useEffect } from 'react';
import { User, DollarSign, BarChart3, Home, Signal, ChevronDown, UserPlus, Trash2, LogOut, LogIn, Globe, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLivePrices } from '@/hooks/useLivePrices';
import { useTranslation } from '@/contexts/TranslationContext';
import { EditableValue } from '@/components/ui/editable-value';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { VersionBadge } from '@/components/VersionBadge';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data, updateUserProfile, resetData, importFromJSON } = useFinancialData();
  const { user, signOut } = useAuth();
  const { loading: pricesLoading, isLiveDataEnabled, timeSinceLastUpdate, fetchLivePrices } = useLivePrices();
  const { language, t, setLanguage } = useTranslation();

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

  const getCurrencyDisplay = (currency: string) => {
    switch (currency) {
      case 'BRL': return { symbol: 'R$', flag: '🇧🇷' };
      case 'USD': return { symbol: '$', flag: '🇺🇸' };
      case 'EUR': return { symbol: '€', flag: '🇪🇺' };
      default: return { symbol: currency, flag: '' };
    }
  };

  const createNewUser = (currency: 'BRL' | 'USD') => {
    const templates = {
      BRL: {
        userProfile: {
          name: "",
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
          name: "",
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

  const currencyDisplay = getCurrencyDisplay(data.userProfile.defaultCurrency);
  
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
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Languages size={16} className="mr-1" />
                    {language.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white z-50">
                  <DropdownMenuLabel>{t.defaultCurrency}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('pt')}>
                    🇧🇷 Português
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('es')}>
                    🇪🇸 Español
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('fr')}>
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('de')}>
                    🇩🇪 Deutsch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Authentication Status */}
              {!user ? (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn size={16} className="mr-2" />
                    <span className="hidden sm:inline">{t.signIn}</span>
                  </Button>
                </Link>
              ) : (
                <>
                  {/* User Management Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer hover:bg-gray-100/70 px-1 sm:px-2 py-1 rounded-lg transition-colors">
                        <User className="text-gray-600" size={18} />
                        <EditableValue
                          value={data.userProfile.name || user.email || "User"}
                          onSave={(value) => updateUserProfile({ name: String(value) })}
                          type="text"
                          className="text-gray-800 font-medium text-sm"
                          placeholder="Enter your name"
                        />
                        <ChevronDown size={12} className="text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56 bg-white z-50">
                      <DropdownMenuLabel>{t.userProfile}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => createNewUser('BRL')} className="cursor-pointer">
                        <UserPlus size={16} className="mr-2" />
                        New User (BRL 🇧🇷)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => createNewUser('USD')} className="cursor-pointer">
                        <UserPlus size={16} className="mr-2" />
                        New User (USD 🇺🇸)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={resetData} className="cursor-pointer text-red-600 hover:text-red-700">
                        <Trash2 size={16} className="mr-2" />
                        {t.resetData}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 hover:text-red-700">
                        <LogOut size={16} className="mr-2" />
                        {t.signOut}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Currency Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-100/70 px-1 sm:px-2 py-1 rounded-lg transition-colors">
                        <DollarSign size={14} />
                        <span className="flex items-center space-x-1">
                          <span>{currencyDisplay.flag}</span>
                          <span className="hidden sm:inline">{currencyDisplay.symbol}</span>
                        </span>
                        <ChevronDown size={10} className="text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 sm:w-48 bg-white z-50">
                      <DropdownMenuLabel>{t.defaultCurrency}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCurrencyChange('BRL')} className="cursor-pointer">
                        <Globe size={16} className="mr-2" />
                        🇧🇷 Real (BRL)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCurrencyChange('USD')} className="cursor-pointer">
                        <Globe size={16} className="mr-2" />
                        🇺🇸 Dollar (USD)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCurrencyChange('EUR')} className="cursor-pointer">
                        <Globe size={16} className="mr-2" />
                        🇪🇺 Euro (EUR)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* Live Numbers Status */}
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
