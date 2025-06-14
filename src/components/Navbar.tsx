
import { useState, useEffect } from 'react';
import { User, DollarSign, BarChart3, Home, Github } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { EditableValue } from '@/components/ui/editable-value';

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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-transform duration-300 ${
        isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
      onMouseEnter={() => setIsVisible(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-gray-800">FinanceTracker</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="text-gray-600" size={20} />
              <EditableValue
                value={data.userProfile.name}
                onSave={(value) => updateUserProfile({ name: String(value) })}
                className="text-gray-800 font-medium"
              />
            </div>

            {/* Currency Indicator */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <DollarSign size={16} />
              <span>{data.userProfile.defaultCurrency}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Go to top"
              >
                <Home size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
