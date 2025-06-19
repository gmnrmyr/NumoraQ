
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Settings, Key, X } from "lucide-react";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "@/hooks/use-toast";

export const DevMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  
  const { 
    isAdminMode, 
    activateDegenCode, 
    setShowAdminPanel,
    isDegenMode,
    getDegenTimeRemaining 
  } = useAdminMode();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + Shift + D for dev menu
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsVisible(!isVisible);
      }
      
      // Ctrl + Shift + E for CMS/Admin panel
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setShowAdminPanel(true);
      }
      
      // Ctrl + Shift + G for degen code activation
      if (event.ctrlKey && event.shiftKey && event.key === 'G') {
        event.preventDefault();
        setShowDegenDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, setShowAdminPanel]);

  const handleActivateDegenCode = () => {
    if (degenCode.trim()) {
      const success = activateDegenCode(degenCode.trim());
      if (success) {
        toast({
          title: "Degen Mode Activated!",
          description: "You now have premium access to all features."
        });
        setShowDegenDialog(false);
        setDegenCode('');
      } else {
        toast({
          title: "Invalid Code",
          description: "The degen code is invalid or has expired.",
          variant: "destructive"
        });
      }
    }
  };

  if (!isVisible && !isAdminMode && !isDegenMode) return null;

  return (
    <>
      {/* Dev Menu Toggle */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex flex-col gap-2">
          {/* Degen Status */}
          {isDegenMode && (
            <div className="bg-yellow-500 text-black px-3 py-1 text-xs font-mono font-bold border-2 border-black brutalist-card">
              DEGEN MODE: {getDegenTimeRemaining()}
            </div>
          )}
          
          {/* Admin Status */}
          {isAdminMode && (
            <div className="bg-red-500 text-white px-3 py-1 text-xs font-mono font-bold border-2 border-black brutalist-card">
              ADMIN MODE ACTIVE
            </div>
          )}
          
          {/* Dev Menu Button */}
          {isVisible && (
            <div className="bg-card border-2 border-border p-3 space-y-2 brutalist-card">
              <div className="text-xs font-mono text-muted-foreground">
                Dev Menu (Ctrl+Shift+D)
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div>• Ctrl+Shift+E: CMS/Admin Panel</div>
                <div>• Ctrl+Shift+G: Degen Code</div>
                <div>• Ctrl+Shift+D: Toggle Dev Menu</div>
              </div>
              <Button
                onClick={() => setShowDegenDialog(true)}
                size="sm"
                className="w-full brutalist-button text-xs"
              >
                <Key size={12} className="mr-1" />
                Enter Degen Code
              </Button>
              <Button
                onClick={() => setShowAdminPanel(true)}
                size="sm"
                className="w-full brutalist-button text-xs"
              >
                <Settings size={12} className="mr-1" />
                CMS/Admin Panel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Degen Code Dialog */}
      <Dialog open={showDegenDialog} onOpenChange={setShowDegenDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase flex items-center gap-2">
              <Key size={16} />
              Activate Degen Code
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter your premium access code to unlock advanced features:
            </div>
            <Input
              placeholder="Enter degen code..."
              value={degenCode}
              onChange={(e) => setDegenCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleActivateDegenCode()}
              className="font-mono brutalist-input"
            />
            <div className="flex gap-2">
              <Button onClick={handleActivateDegenCode} className="brutalist-button flex-1">
                Activate Code
              </Button>
              <Button onClick={() => setShowDegenDialog(false)} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
