
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

interface MobileNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const tabs = [
    { value: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { value: 'income', label: 'Income', icon: TrendingUp },
    { value: 'expenses', label: 'Expenses', icon: TrendingDown },
    { value: 'assets', label: 'Assets', icon: Home },
    { value: 'tasks', label: 'Tasks', icon: Calendar },
    { value: 'debt', label: 'Debt', icon: AlertCircle },
  ];

  return (
    <>
      {/* Mobile hamburger menu for smaller screens */}
      <div className="md:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Menu size={16} className="mr-2" />
              {tabs.find(tab => tab.value === activeTab)?.label || 'Menu'}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <div className="grid grid-cols-2 gap-2 p-4">
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
                    className="flex items-center gap-2 p-3"
                  >
                    <Icon size={16} />
                    {tab.label}
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
                className="flex items-center gap-2 px-3 py-2"
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </>
  );
};
