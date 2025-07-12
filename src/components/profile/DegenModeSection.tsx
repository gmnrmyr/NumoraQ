
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Crown, Gift, Timer, CreditCard, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const DegenModeSection = () => {
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  const { user } = useAuth();
  const { activatePremiumCode } = useAdminMode();
  const { isPremiumUser, premiumDetails, refetch: refetchPremiumStatus } = usePremiumStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleActivateDegenCode = async () => {
    const success = await activatePremiumCode(degenCode, user?.email);
    if (success) {
      setDegenCode('');
      setShowDegenDialog(false);
      // Refresh premium status after successful activation
      // Add a small delay to ensure database update is processed
      setTimeout(async () => {
        await refetchPremiumStatus();
        toast({
          title: "🎉 Degen Code Activated!",
          description: "Premium access has been activated! Welcome to the degen club!",
          duration: 5000
        });
      }, 1000);
    } else {
      toast({
        title: "Code Activation Failed",
        description: "Invalid code, already used, or expired. Please check your code and try again.",
        variant: "destructive"
      });
    }
  };

  const getDegenTimeRemaining = () => {
    if (!premiumDetails) return 'Active';
    
    if (!premiumDetails.expiresAt) return 'Lifetime';
    
    const expiryDate = new Date(premiumDetails.expiresAt);
    const now = new Date();
    
    if (expiryDate.getFullYear() >= 2099) return 'Lifetime';
    
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 Day';
    if (diffDays <= 30) return `${diffDays} Days`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} Months`;
    
    return `${Math.ceil(diffDays / 365)} Years`;
  };

  const getPremiumTypeDisplay = () => {
    if (!premiumDetails?.type) return 'DEGEN';
    
    switch (premiumDetails.type) {
      case '30day_trial': return 'FREE TRIAL';
      case '1year': return 'DEGEN 1Y';
      case '5years': return 'DEGEN 5Y';
      case 'lifetime': return 'DEGEN LIFE';
      case '1month': return 'DEGEN 1M';
      case '3months': return 'DEGEN 3M';
      case '6months': return 'DEGEN 6M';
      default: return 'DEGEN';
    }
  };

  const getBadgeStyle = () => {
    if (premiumDetails?.type === '30day_trial') {
      return "bg-blue-600/20 border-blue-600 text-blue-400 font-mono cursor-pointer hover:bg-blue-600/30 transition-colors";
    }
    return "bg-green-600/20 border-green-600 text-green-400 font-mono cursor-pointer hover:bg-green-600/30 transition-colors";
  };

  const getStatusMessage = () => {
    if (isPremiumUser) {
      if (premiumDetails?.type === '30day_trial') {
        return `🎉 Free trial active - ${getDegenTimeRemaining()} remaining`;
      }
      return `🚀 ${t.noAdsEnabled}`;
    }
    
    // Check if user had a trial that expired
    if (premiumDetails?.type === '30day_trial' && getDegenTimeRemaining() === 'Expired') {
      return `⏰ FREE TRIAL EXPIRED - Please purchase a degen plan to continue premium access`;
    }
    
    return `📺 ${t.activateForAdFree}`;
  };

  const isTrialExpired = premiumDetails?.type === '30day_trial' && getDegenTimeRemaining() === 'Expired';
  const hasTrialAccess = premiumDetails?.type === '30day_trial' && isPremiumUser;

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={16} className={isPremiumUser ? "text-yellow-400" : "text-muted-foreground"} />
          <span className="font-mono text-sm">{t.degenMode}</span>
          {(isPremiumUser || isTrialExpired) && (
            <Badge 
              variant="outline" 
              className={isTrialExpired ? "bg-red-600/20 border-red-600 text-red-400 font-mono cursor-pointer hover:bg-red-600/30 transition-colors" : getBadgeStyle()}
              title={`${premiumDetails?.type || 'Premium'} Access - ${getDegenTimeRemaining()} - Click to view payment options`}
              onClick={() => navigate('/payment')}
            >
              <Timer size={12} className="mr-1" />
              {isTrialExpired ? 'TRIAL EXPIRED' : getPremiumTypeDisplay()}
            </Badge>
          )}
        </div>
        {(!isPremiumUser || isTrialExpired) && (
          <div className="flex items-center gap-2">
            {isTrialExpired && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs font-mono bg-red-600/20 text-red-400 border-red-600/40 hover:bg-red-600/30"
                onClick={() => navigate('/payment')}
              >
                <Zap size={12} className="mr-1" />
                UPGRADE NOW
              </Button>
            )}
            <Dialog open={showDegenDialog} onOpenChange={setShowDegenDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs font-mono">
                  <Gift size={12} className="mr-1" />
                  {t.activateCode}
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
                  Activate Code
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-mono">OR</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setShowDegenDialog(false);
                    navigate('/payment');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <CreditCard size={16} className="mr-2" />
                  Buy Degen Plan
                </Button>
                
                <p className="text-xs text-muted-foreground font-mono text-center">
                  Don't have a code? Purchase a degen plan to unlock premium features
                </p>
              </div>
            </DialogContent>
          </Dialog>
          {!isTrialExpired && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs font-mono bg-orange-600/20 text-orange-400 border-orange-600/40 hover:bg-orange-600/30"
              onClick={() => navigate('/payment')}
            >
              <CreditCard size={12} className="mr-1" />
              {t.buyDegen}
            </Button>
          )}
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground font-mono mt-2">
        {getStatusMessage()}
      </div>
    </div>
  );
};
