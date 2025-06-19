import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Zap, Crown, Lock, Settings } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAdminMode } from '@/hooks/useAdminMode';
import { toast } from "@/hooks/use-toast";

export const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, updateUserProfile } = useFinancialData();
  const { activateDegenCode } = useAdminMode();
  const [degenCode, setDegenCode] = useState('');

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // Reset all themes first
    root.classList.remove('theme-neon', 'theme-monochrome', 'theme-dual-tone', 'theme-high-contrast', 'theme-cyberpunk', 'theme-matrix', 'theme-gold');
    
    switch (theme) {
      case 'neon':
        root.classList.add('theme-neon');
        break;
      case 'monochrome':
        root.classList.add('theme-monochrome');
        break;
      case 'dual-tone':
        root.classList.add('theme-dual-tone');
        break;
      case 'high-contrast':
        root.classList.add('theme-high-contrast');
        break;
      case 'cyberpunk':
        root.classList.add('theme-cyberpunk');
        break;
      case 'matrix':
        root.classList.add('theme-matrix');
        break;
      case 'gold':
        root.classList.add('theme-gold');
        break;
      default:
        // Keep default theme
        break;
    }
    
    // Save theme preference
    updateUserProfile({ theme });
    localStorage.setItem('selectedTheme', theme);
    
    toast({
      title: "Theme Applied",
      description: `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated.`
    });
  };

  const handleActivateDegenCode = () => {
    if (activateDegenCode(degenCode, data.userProfile.name)) {
      toast({
        title: "Degen Mode Activated!",
        description: "You now have access to premium features."
      });
      setDegenCode('');
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is invalid or already used.",
        variant: "destructive"
      });
    }
  };

  const getDonationAmount = () => data.userProfile.totalDonated || 0;
  const isThemeLocked = (requiredAmount: number) => getDonationAmount() < requiredAmount;

  const ThemeButton = ({ theme, label, requiredAmount = 0, icon: Icon = Palette }: { 
    theme: string; 
    label: string; 
    requiredAmount?: number;
    icon?: any;
  }) => {
    const locked = isThemeLocked(requiredAmount);
    
    return (
      <Button
        onClick={() => locked ? null : applyTheme(theme)}
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 brutalist-button bg-card border-2 border-border"
        >
          <Palette size={16} className="mr-1" />
          THEMES
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Palette size={16} />
            Theme Customizer
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Customize your dashboard appearance:
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <ThemeButton theme="default" label="Default" />
              <ThemeButton theme="neon" label="Neon" />
              <ThemeButton theme="monochrome" label="Monochrome" />
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Activate premium features:
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter premium code"
                value={degenCode}
                onChange={(e) => setDegenCode(e.target.value)}
                className="w-full p-2 bg-input border-2 border-border font-mono text-sm"
              />
              
              <Button 
                onClick={handleActivateDegenCode}
                className="w-full brutalist-button"
                disabled={!degenCode.trim()}
              >
                <Zap size={16} className="mr-2" />
                Activate Code
              </Button>
              
              <div className="text-center text-xs text-muted-foreground font-mono">
                OR
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => toast({ title: "Coming Soon", description: "Crypto payment integration in development." })}
                  className="w-full brutalist-button bg-orange-600 hover:bg-orange-700"
                >
                  Pay with Crypto
                </Button>
                
                <Button 
                  onClick={() => toast({ title: "Coming Soon", description: "PayPal integration in development." })}
                  className="w-full brutalist-button bg-blue-600 hover:bg-blue-700"
                >
                  Pay with PayPal
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
