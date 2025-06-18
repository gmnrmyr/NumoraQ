
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Calendar, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useTranslation } from '@/contexts/TranslationContext';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  const tabs = [
    { value: 'portfolio', label: t.portfolio, icon: Briefcase },
    { value: 'income', label: t.income, icon: TrendingUp },
    { value: 'expenses', label: t.expenses, icon: TrendingDown },
    { value: 'assets', label: t.assets, icon: Home },
    { value: 'tasks', label: t.tasks, icon: Calendar },
    { value: 'debt', label: t.debt, icon: AlertCircle },
  ];

  const currentTab = tabs.find(tab => tab.value === activeTab);

  return (
    <>
      {/* Mobile hamburger menu for smaller screens */}
      <div className="md:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                      setIsOpen(false);
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

      {/* Regular tabs for larger screens */}
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
