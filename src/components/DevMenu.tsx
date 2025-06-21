import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAdminMode } from '@/hooks/useAdminMode';
import { toast } from "@/hooks/use-toast";
import { useUserTitle } from '@/hooks/useUserTitle';
import { ThemeSelector } from './devmenu/ThemeSelector';
import { DegenModePanel } from './devmenu/DegenModePanel';

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, updateUserProfile } = useFinancialData();
  const { activatePremiumCode } = useAdminMode();
  const { userTitle } = useUserTitle();

  // Check if user has CHAMPION role (2000+ points)
  const isChampionUser = userTitle.level >= 2000 || userTitle.title === 'CHAMPION';

  // Set monochrome as default theme on component mount and ensure it's applied from start
  React.useEffect(() => {
    // Apply monochrome theme immediately if no theme is set
    if (!data.userProfile.theme) {
      applyTheme('monochrome');
    } else {
      // Apply the saved theme
      applyTheme(data.userProfile.theme);
    }
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // Reset all themes first
    root.classList.remove(
      'theme-neon', 
      'theme-monochrome', 
      'theme-dual-tone', 
      'theme-high-contrast', 
      'theme-cyberpunk', 
      'theme-matrix', 
      'theme-gold', 
      'theme-black-hole', 
      'theme-dark-dither',
      'theme-da-test',
      'theme-leras'
    );
    
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
      case 'black-hole':
        root.classList.add('theme-black-hole');
        break;
      case 'dark-dither':
        root.classList.add('theme-dark-dither');
        break;
      case 'da-test':
        root.classList.add('theme-da-test');
        break;
      case 'leras':
        root.classList.add('theme-leras');
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
      description: `${theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ')} theme activated.`
    });
  };

  const getDonationAmount = () => data.userProfile.totalDonated || 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 brutalist-button bg-card border-2 border-border"
        >
          <Settings size={16} className="mr-1" />
          DEV
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Settings size={16} />
            Developer Menu
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="degen">Degen Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="themes">
            <ThemeSelector 
              onApplyTheme={applyTheme}
              getDonationAmount={getDonationAmount}
              isChampionUser={isChampionUser}
            />
          </TabsContent>

          <TabsContent value="degen">
            <DegenModePanel 
              activatePremiumCode={activatePremiumCode}
              userName={data.userProfile.name}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
