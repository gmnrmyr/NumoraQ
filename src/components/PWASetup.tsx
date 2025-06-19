
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smartphone, Download, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const PWASetup = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS install prompt for mobile Safari users
    if (iOS && isMobile && !standalone) {
      const hasSeenPrompt = localStorage.getItem('pwa-ios-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowInstallPrompt(true), 2000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    }
  };

  const handleIOSInstall = () => {
    localStorage.setItem('pwa-ios-prompt-seen', 'true');
    setShowInstallPrompt(false);
  };

  if (isStandalone || !isMobile) return null;

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="bg-card border-2 border-accent max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-mono uppercase text-accent flex items-center gap-2">
              <Smartphone size={20} />
              Install App
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstallPrompt(false)}
              className="text-muted-foreground"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-bold font-mono">Install Open Findash</h3>
            <p className="text-sm text-muted-foreground font-mono">
              Get the full app experience with offline access and push notifications
            </p>
          </div>

          {isIOS ? (
            <div className="space-y-3">
              <div className="text-xs font-mono bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-bold mb-2">📲 How to install on iOS:</p>
                <ol className="space-y-1 text-left">
                  <li>1. Tap the Share button (□↗️)</li>
                  <li>2. Scroll down and tap "Add to Home Screen"</li>
                  <li>3. Tap "Add" to confirm</li>
                </ol>
              </div>
              <Button onClick={handleIOSInstall} className="w-full font-mono">
                Got it!
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button onClick={handleInstallClick} className="w-full font-mono">
                <Download size={16} className="mr-2" />
                Install Now
              </Button>
              <div className="text-xs text-muted-foreground text-center font-mono">
                Install for offline access and better performance
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
