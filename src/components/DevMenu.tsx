import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, RefreshCw, Lock } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAdminMode } from '@/hooks/useAdminMode';
import { toast } from "@/hooks/use-toast";
import { useUserTitle } from '@/hooks/useUserTitle';
import { ThemeSelector } from './devmenu/ThemeSelector';
import { DegenModePanel } from './devmenu/DegenModePanel';

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("theme"); // <-- Add controlled tab state
  const { data, updateUserProfile } = useFinancialData();
  const { activatePremiumCode } = useAdminMode();
  const { userTitle } = useUserTitle();

  // Check if user has CHAMPION role (2000+ points)
  const isChampionUser = userTitle.level >= 2000 || userTitle.title === 'CHAMPION';
  const isWhaleUser = userTitle.level >= 10000 || userTitle.title === 'WHALE';

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
      'theme-da-terminal'
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
      case 'da-terminal':
        root.classList.add('theme-da-terminal');
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
      <DialogContent
        className="bg-card/80 border-2 border-white w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl backdrop-blur-lg"
        style={{
          background: 'rgba(20, 20, 20, 0.80)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '2px solid #fff',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2 text-[#00ff00]">
            <Settings size={16} />
            Developer Menu
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="ml-auto text-[#00ff00] hover:bg-[#00ff00]/20 sm:hidden"
            >
              ✕
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
            <TabsTrigger value="theme" className="text-xs sm:text-sm py-2">Themes</TabsTrigger>
            <TabsTrigger value="degen" className="text-xs sm:text-sm py-2">Degen Mode</TabsTrigger>
            <TabsTrigger
              value="testinstances"
              disabled={!isWhaleUser}
              title={!isWhaleUser ? "Whale+ only (10,000+ points required)" : undefined}
              className={`text-xs sm:text-sm py-2 ${!isWhaleUser ? "opacity-50 cursor-not-allowed flex items-center gap-1 relative" : ""}`}
            >
              <span className="hidden sm:inline">TestInstances</span>
              <span className="sm:hidden">Tests</span>
              {!isWhaleUser && (
                <Lock size={12} className="ml-1 text-[#00ff00]" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="theme">
            <ThemeSelector 
              onApplyTheme={applyTheme}
              getDonationAmount={getDonationAmount}
              isChampionUser={isChampionUser}
            />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
                title="Refresh page (required for DA Terminal theme switch)"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="degen">
            <DegenModePanel 
              activatePremiumCode={activatePremiumCode}
              userName={data.userProfile.name}
            />
          </TabsContent>

          <TabsContent value="testinstances">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full bg-black/80 border border-[#00ff00] rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-lg backdrop-blur-md">
                <div className="w-full flex flex-col items-center justify-between mb-4 gap-3">
                  <span className="font-mono text-sm sm:text-lg text-[#00ff00] tracking-widest text-center">// TestInstances</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto font-mono bg-black text-[#00ff00] border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/test-instances";
                    }}
                  >
                    Open Terminal
                  </Button>
                </div>
                <div className="w-full text-xs text-[#00ff00] opacity-80 font-mono text-center">
                  For dev experiments and isolated feature tests.<br />
                  No dashboard, panels, or animations yet.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
