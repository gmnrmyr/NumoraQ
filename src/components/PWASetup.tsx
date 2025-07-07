
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, Share, Wifi, WifiOff, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const PWASetup = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installSuccess, setInstallSuccess] = useState(false);

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

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for app installation
    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setIsInstalled(true);
      toast({
        title: "App Installed Successfully! 🎉",
        description: "Numoraq is now available on your home screen.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          toast({
            title: "Installing App...",
            description: "Numoraq is being added to your home screen.",
          });
        } else {
          toast({
            title: "Installation Cancelled",
            description: "You can install the app later from the menu.",
          });
        }
        setDeferredPrompt(null);
      } catch (error) {
        toast({
          title: "Installation Failed",
          description: "There was an issue installing the app. Please try again.",
          variant: "destructive"
        });
      }
    } else if (isIOS) {
      setShowInstallDialog(true);
    }
  };

  // Show offline indicator
  const OfflineIndicator = () => {
    if (isOnline) return null;
    
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 font-mono text-sm">
        <WifiOff size={16} />
        Offline Mode
      </div>
    );
  };

  return (
    <>
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Install Button - show if not installed and can be installed */}
      {!isInstalled && (deferredPrompt || isIOS) && (
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

      {/* Success indicator for installed apps */}
      {isInstalled && !installSuccess && (
        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
          <Check size={12} className="mr-1" />
          Installed
        </Badge>
      )}

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase flex items-center gap-2">
              <Smartphone size={20} />
              Install Numoraq
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
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs font-mono text-blue-800">
                <strong>💡 Pro Tip:</strong> Once installed, you can use Numoraq offline! 
                Your data is saved locally and will sync when you're back online.
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
