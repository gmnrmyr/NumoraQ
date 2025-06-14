
import { useState, useEffect } from 'react';
import { User, DollarSign, BarChart3, Home, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { EditableValue } from '@/components/ui/editable-value';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data, updateUserProfile } = useFinancialData();

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

  const currencyDisplay = getCurrencyDisplay(data.userProfile.defaultCurrency);

  return (
    <TooltipProvider>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-transform duration-300 ${
          isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand - now clickable to go back to landing */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BarChart3 className="text-blue-600" size={24} />
              <span className="text-xl font-bold text-gray-800">FinanceTracker</span>
            </Link>

            {/* User Profile and Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <EditableValue
                  value={data.userProfile.name}
                  onSave={(value) => updateUserProfile({ name: String(value) })}
                  type="text"
                  className="text-gray-800 font-medium"
                  placeholder="Enter your name"
                />
              </div>

              {/* Currency Indicator with Flag and Tooltip */}
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <DollarSign size={16} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help flex items-center space-x-1">
                      <span>{currencyDisplay.flag}</span>
                      <span>{currencyDisplay.symbol}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Currency is set permanently to avoid data conversion issues.<br />More currencies available in future versions!</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Live Numbers Status */}
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Signal size={16} className="text-orange-500" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help text-orange-600 text-xs font-medium">live numbers: off</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>All prices (BTC, exchange rates, etc.) are manually input.<br />Live data integration coming in future versions.</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-2 rounded-lg hover:bg-gray-100/70 transition-colors"
                  title="Go to top"
                >
                  <Home size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
};
