
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  
  const tabs = [
    { value: 'portfolio', label: t.portfolio, icon: Briefcase },
    { value: 'income', label: t.income, icon: TrendingUp },
    { value: 'expenses', label: t.expenses, icon: TrendingDown },
    { value: 'assets', label: t.assets, icon: Home },
    { value: 'tasks', label: t.tasks, icon: Calendar },
    { value: 'debt', label: t.debt, icon: AlertCircle },
  ];

  return (
    <>
      {/* Regular tabs for larger screens only */}
      <div className="hidden md:block">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600"
              >
                <Icon size={14} />
                <span className="hidden sm:inline truncate">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </>
  );
};
