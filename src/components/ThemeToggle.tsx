
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="glass-card border-white/40 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-300 text-gray-900 dark:text-gray-100"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="ml-2 hidden sm:inline font-medium">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </Button>
  );
};
