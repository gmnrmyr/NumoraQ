
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, TrendingUp, DollarSign, Briefcase, CheckSquare, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useFinancialData();

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'assets', label: 'Assets', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'debt', label: 'Debt', icon: CreditCard },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  // Show hamburger menu for all users (including demo users)
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b-2 border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold font-mono text-accent">OPEN FINDASH</h1>
          {user?.email && (
            <Badge variant="outline" className="hidden sm:flex font-mono">
              {user.email}
            </Badge>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => handleTabChange(item.id)}
                className="font-mono brutalist-button"
                size="sm"
              >
                <Icon size={16} className="mr-1" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Mobile Navigation - Show for all users */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden brutalist-button">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card border-l-2 border-border">
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="font-bold text-lg font-mono uppercase text-accent">Navigation</h2>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => handleTabChange(item.id)}
                    className="justify-start font-mono brutalist-button"
                  >
                    <Icon size={16} className="mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
