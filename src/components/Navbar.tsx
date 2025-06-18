
import { useState, useEffect } from 'react';
import { BarChart3, Home, Signal, LogIn, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLivePrices } from '@/hooks/useLivePrices';
import { useTranslation } from '@/contexts/TranslationContext';
import { EditableValue } from '@/components/ui/editable-value';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { VersionBadge } from '@/components/VersionBadge';
import { UserSettingsPanel } from '@/components/navbar/UserSettingsPanel';
import { LanguageSelector } from '@/components/LanguageSelector';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
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

  // Navigation tabs for mobile
  const tabs = [
    { value: 'portfolio', label: t.portfolio, icon: BarChart3 },
    { value: 'income', label: t.income, icon: Signal },
    { value: 'expenses', label: t.expenses, icon: BarChart3 },
    { value: 'assets', label: t.assets, icon: Home },
    { value: 'tasks', label: t.tasks, icon: BarChart3 },
    { value: 'debt', label: t.debt, icon: BarChart3 },
  ];

  const currentTab = tabs.find(tab => tab.value === activeTab);

  return (
    <TooltipProvider>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-transform duration-300 ${
          isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Main Navbar */}
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

          {/* Mobile Navigation - Integrated below main navbar */}
          {user && activeTab && onTabChange && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/90">
              <div className="px-2 py-2">
                <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Menu size={16} />
                        {currentTab && (
                          <>
                            <currentTab.icon size={16} />
                            <span className="truncate">{currentTab.label}</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{t.tapToSwitch}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[80vh] bg-white z-50">
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <Button
                            key={tab.value}
                            variant={activeTab === tab.value ? "default" : "outline"}
                            onClick={() => {
                              onTabChange(tab.value);
                              setIsNavOpen(false);
                            }}
                            className="flex items-center gap-2 p-4 h-auto flex-col"
                          >
                            <Icon size={20} />
                            <span className="text-sm font-medium">{tab.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
};
