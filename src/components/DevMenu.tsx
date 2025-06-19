
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, X, Palette, User, Download } from "lucide-react";
import { UserFeedbackDialog } from "./UserFeedbackDialog";
import { useFinancialData } from "@/contexts/FinancialDataContext";

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateUserProfile, exportToCSV, resetData } = useFinancialData();

  const handleColorChange = (theme: string) => {
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'dual-tone', 'monochrome', 'warm', 'ultra-contrast');
    
    // Add the new theme class
    if (theme !== 'dark') {
      document.documentElement.classList.add(theme);
    }
    
    // Store the theme preference
    localStorage.setItem('theme', theme);
  };

  const loadStarterProfile = () => {
    updateUserProfile({
      name: 'Crypto Chad',
      defaultCurrency: 'USD',
      language: 'en'
    });
    resetData();
  };

  const loadFernandaProfile = () => {
    updateUserProfile({
      name: 'Fernanda',
      defaultCurrency: 'BRL',
      language: 'pt'
    });
  };

  const exportToJSON = () => {
    const data = localStorage.getItem('financialData');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="brutalist-button shadow-lg"
        >
          <Code size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] w-full sm:w-96">
      <Card className="brutalist-card shadow-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm uppercase">Dev Tools</h3>
            <div className="flex gap-2">
              <UserFeedbackDialog />
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                size="sm"
                className="brutalist-button"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {/* Color Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase flex items-center gap-2">
              <Palette size={12} />
              Themes
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleColorChange('dark')}
                size="sm"
                variant="outline"
                className="text-xs font-mono bg-zinc-900 text-white hover:bg-zinc-800"
              >
                Default
              </Button>
              <Button
                onClick={() => handleColorChange('dual-tone')}
                size="sm"
                variant="outline"
                className="text-xs font-mono bg-gradient-to-r from-green-400 to-purple-600 text-white"
              >
                Dual Tone
              </Button>
              <Button
                onClick={() => handleColorChange('monochrome')}
                size="sm"
                variant="outline"
                className="text-xs font-mono bg-gray-800 text-gray-100 hover:bg-gray-700"
              >
                Monochrome
              </Button>
              <Button
                onClick={() => handleColorChange('warm')}
                size="sm"
                variant="outline"
                className="text-xs font-mono bg-gradient-to-r from-orange-600 to-red-600 text-white"
              >
                Warm
              </Button>
              <Button
                onClick={() => handleColorChange('ultra-contrast')}
                size="sm"
                variant="outline"
                className="text-xs font-mono bg-black text-white border-white hover:bg-white hover:text-black"
              >
                Ultra Contrast
              </Button>
            </div>
          </div>

          {/* Load Profiles */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase flex items-center gap-2">
              <User size={12} />
              Load Profile
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={loadStarterProfile}
                size="sm"
                variant="outline"
                className="text-xs font-mono"
              >
                Starter
              </Button>
              <Button
                onClick={loadFernandaProfile}
                size="sm"
                variant="outline"
                className="text-xs font-mono"
              >
                Fernanda
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase flex items-center gap-2">
              <Download size={12} />
              Export
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={exportToCSV}
                size="sm"
                variant="outline"
                className="text-xs font-mono"
              >
                CSV
              </Button>
              <Button
                onClick={exportToJSON}
                size="sm"
                variant="outline"
                className="text-xs font-mono"
              >
                JSON
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
            🛠️ <strong>Dev mode:</strong> Quick tools for testing and exporting data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
