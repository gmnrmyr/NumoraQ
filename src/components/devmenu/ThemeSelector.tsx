
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Crown, Lock, Zap, Waves } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ThemeSelectorProps {
  onApplyTheme: (theme: string) => void;
  getDonationAmount: () => number;
  isChampionUser: boolean;
}

export const ThemeSelector = ({ onApplyTheme, getDonationAmount, isChampionUser }: ThemeSelectorProps) => {
  const isThemeLocked = (requiredAmount: number) => getDonationAmount() < requiredAmount;

  const ThemeButton = ({ theme, label, requiredAmount = 0, icon: Icon = Palette, championOnly = false, whalesOnly = false }: { 
    theme: string; 
    label: string; 
    requiredAmount?: number;
    icon?: any;
    championOnly?: boolean;
    whalesOnly?: boolean;
  }) => {
    const locked = isThemeLocked(requiredAmount) || (championOnly && !isChampionUser) || (whalesOnly && getDonationAmount() < 10000);
    
    return (
      <Button
        onClick={() => locked ? null : onApplyTheme(theme)}
        disabled={locked}
        className={`brutalist-button text-xs h-8 ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
        variant="outline"
      >
        <Icon size={12} className="mr-1" />
        {label}
        {locked && <Lock size={10} className="ml-1" />}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground font-mono">
        Customize your dashboard appearance:
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <ThemeButton theme="default" label="Default" />
        <ThemeButton theme="monochrome" label="Monochrome" />
        <ThemeButton theme="neon" label="Neon" />
        <ThemeButton theme="dual-tone" label="Dual Tone" />
        <ThemeButton theme="high-contrast" label="High Contrast" />
        <ThemeButton 
          theme="cyberpunk" 
          label="Cyberpunk" 
          requiredAmount={100}
          icon={Crown}
        />
        <ThemeButton 
          theme="matrix" 
          label="Matrix" 
          requiredAmount={500}
          icon={Crown}
        />
        <ThemeButton 
          theme="gold" 
          label="Gold Rush" 
          requiredAmount={1000}
          icon={Crown}
        />
        <ThemeButton 
          theme="black-hole" 
          label="Black Hole" 
          championOnly={true}
          icon={Zap}
        />
        <ThemeButton 
          theme="dark-dither" 
          label="Dark Dither" 
          whalesOnly={true}
          icon={Waves}
        />
      </div>
      
      <div className="bg-muted p-3 border-2 border-border">
        <div className="text-xs font-mono">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={12} className="text-yellow-400" />
            <span className="font-bold">Premium Themes</span>
          </div>
          <div>• Cyberpunk ($100+ donated)</div>
          <div>• Matrix ($500+ donated)</div>
          <div>• Gold Rush ($1000+ donated)</div>
          <div className="flex items-center gap-1 mt-1">
            <Zap size={12} className="text-orange-400" />
            <span className="font-bold text-orange-400">Champion Only:</span>
          </div>
          <div>• Black Hole (CHAMPION role)</div>
          <div className="flex items-center gap-1 mt-1">
            <Waves size={12} className="text-purple-400" />
            <span className="font-bold text-purple-400">Whales+ Only:</span>
          </div>
          <div>• Dark Dither (10,000+ points)</div>
        </div>
      </div>
    </div>
  );
};
