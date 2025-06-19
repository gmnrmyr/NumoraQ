
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const PWASetup = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    
    // Check if it's iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast({
          title: "App Installed!",
          description: "Open Findash has been added to your home screen.",
        });
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowInstallDialog(true);
    }
  };

  // Don't show anything if already installed
  if (isInstalled) return null;

  return (
    <>
      {(deferredPrompt || isIOS) && (
        <Button
          onClick={handleInstallClick}
          variant="outline"
          size="sm"
          className="brutalist-button"
        >
          <Download size={16} className="mr-1" />
          Install App
        </Button>
      )}

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase flex items-center gap-2">
              <Smartphone size={20} />
              Install Open Findash
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              To install this app on your iOS device:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge>1</Badge>
                <span>Tap the <Share size={14} className="inline mx-1" /> share button</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>2</Badge>
                <span>Scroll down and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>3</Badge>
                <span>Tap "Add" to confirm</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              This will create a native app experience with offline capabilities.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
