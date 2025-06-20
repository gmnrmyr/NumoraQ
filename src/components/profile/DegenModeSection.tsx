
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Crown, Gift, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export const DegenModeSection = () => {
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  const { user } = useAuth();
  const { activatePremiumCode } = useAdminMode();
  const { isPremiumUser } = usePremiumStatus();

  const handleActivateDegenCode = async () => {
    const success = await activatePremiumCode(degenCode, user?.email);
    if (success) {
      setDegenCode('');
      setShowDegenDialog(false);
    } else {
      alert('Invalid or already used code');
    }
  };

  const getDegenTimeRemaining = () => "Lifetime"; // Updated to show lifetime

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={16} className={isPremiumUser ? "text-yellow-400" : "text-muted-foreground"} />
          <span className="font-mono text-sm">Degen Mode</span>
          {isPremiumUser && (
            <Badge 
              variant="outline" 
              className="bg-green-600/20 border-green-600 text-green-400 font-mono cursor-help"
              title="Lifetime access - No ads, premium features enabled"
            >
              <Timer size={12} className="mr-1" />
              {getDegenTimeRemaining()}
            </Badge>
          )}
        </div>
        {!isPremiumUser && (
          <Dialog open={showDegenDialog} onOpenChange={setShowDegenDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs font-mono">
                <Gift size={12} className="mr-1" />
                Activate
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-border">
              <DialogHeader>
                <DialogTitle className="font-mono">Activate Degen Mode</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-mono">
                  Enter your degen code to activate ad-free experience:
                </p>
                <Input 
                  placeholder="DEGEN-XXXXXX" 
                  value={degenCode} 
                  onChange={e => setDegenCode(e.target.value.toUpperCase())} 
                  className="font-mono" 
                />
                <Button 
                  onClick={handleActivateDegenCode} 
                  className="w-full" 
                  disabled={!degenCode.trim()}
                >
                  Activate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="text-xs text-muted-foreground font-mono mt-2">
        {isPremiumUser ? '🚀 No ads! Premium experience activated' : '📺 Future: Activate for ad-free experience'}
      </div>
    </div>
  );
};
