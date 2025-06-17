
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
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn size={16} className="mr-2" />
                    <span className="hidden sm:inline">{t.signIn}</span>
                  </Button>
                </Link>
              ) : (
                <UserSettingsPanel />
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
