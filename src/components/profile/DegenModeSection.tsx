
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Crown, Gift, Timer, CreditCard, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTrialActivation } from '@/hooks/useTrialActivation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const DegenModeSection = () => {
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  const { user } = useAuth();
  const { activatePremiumCode } = useAdminMode();
  const { isPremiumUser, premiumDetails, refetch: refetchPremiumStatus } = usePremiumStatus();
  const { 
    activateBetaGracePeriod, 
    isTrialExpired, 
    trialTimeRemaining, 
    isOnTrial 
  } = useTrialActivation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleActivateDegenCode = async () => {
    const success = await activatePremiumCode(degenCode, user?.email, async () => {
      // This callback runs after successful activation
      // Add a small delay to ensure database update is processed
      setTimeout(async () => {
        await refetchPremiumStatus();
        toast({
          title: "🎉 Degen Code Activated!",
          description: "Premium access has been activated! Welcome to the degen club!",
          duration: 5000
        });
      }, 1000);
    });
    
    if (success) {
      setDegenCode('');
      setShowDegenDialog(false);
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
    // If user has premium degen access (is_premium: true)
    if (isPremiumUser) {
      return `🚀 ${t.noAdsEnabled} - ${getDegenTimeRemaining()} remaining`;
    }
    
    // Check if user is on trial (is_premium: false but has trial)
    if (premiumDetails?.isOnTrial) {
      return `🎯 FREE TRIAL ACTIVE - ${premiumDetails.trialTimeRemaining} remaining (with ads)`;
    }
    
    // Check if user had a trial that expired
    if (isTrialExpired) {
      return `⏰ FREE TRIAL EXPIRED - Upgrade to continue or use 3-day beta grace period`;
    }
    
    return `📺 ${t.activateForAdFree} - No trial or degen access`;
  };

  const handleGracePeriodActivation = async () => {
    const success = await activateBetaGracePeriod();
    if (success) {
      await refetchPremiumStatus();
    }
  };

  const isTrialActive = premiumDetails?.isOnTrial || false;
  const isTrialOrPremium = isPremiumUser || isTrialActive;
  const hasAnyAccess = isTrialOrPremium || isTrialExpired;

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={16} className={isTrialOrPremium ? "text-yellow-400" : "text-muted-foreground"} />
          <span className="font-mono text-sm">{t.degenMode}</span>
          {hasAnyAccess && (
            <Badge 
              variant="outline" 
              className={isTrialExpired ? "bg-red-600/20 border-red-600 text-red-400 font-mono cursor-pointer hover:bg-red-600/30 transition-colors" : getBadgeStyle()}
              title={`${premiumDetails?.type || 'Premium'} Access - ${premiumDetails?.trialTimeRemaining || getDegenTimeRemaining()} - Click to view payment options`}
              onClick={() => navigate('/payment')}
            >
              <Timer size={12} className="mr-1" />
              {isTrialExpired ? 'TRIAL EXPIRED' : isTrialActive ? 'FREE TRIAL' : getPremiumTypeDisplay()}
            </Badge>
          )}
        </div>
        {(!isTrialOrPremium || isTrialExpired) && (
          <div className="flex items-center gap-2">
            {isTrialExpired && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs font-mono bg-orange-600/20 text-orange-400 border-orange-600/40 hover:bg-orange-600/30"
                  onClick={handleGracePeriodActivation}
                  title="Get 3 additional days to try premium features (beta only, one-time offer)"
                >
                  <Gift size={12} className="mr-1" />
                  3-DAY GRACE
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs font-mono bg-red-600/20 text-red-400 border-red-600/40 hover:bg-red-600/30"
                  onClick={() => navigate('/payment')}
                >
                  <CreditCard size={12} className="mr-1" />
                  UPGRADE
                </Button>
              </>
            )}
            {!isTrialOrPremium && (
              <>
                <Dialog open={showDegenDialog} onOpenChange={setShowDegenDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-mono bg-yellow-600/20 text-yellow-400 border-yellow-600/40 hover:bg-yellow-600/30"
                    >
                      <Gift size={12} className="mr-1" />
                      {t.activateCode}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-mono text-accent">{t.activateDegenCode}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-accent/10 p-3 rounded border border-accent/20">
                        <p className="text-sm font-mono text-muted-foreground">
                          {t.enterDegenCodeDescription}
                        </p>
                      </div>
                      <Input
                        value={degenCode}
                        onChange={(e) => setDegenCode(e.target.value)}
                        placeholder={t.enterDegenCodePlaceholder}
                        className="font-mono"
                      />
                      <Button
                        onClick={handleActivateDegenCode}
                        className="w-full font-mono"
                        disabled={!degenCode.trim()}
                      >
                        <Zap size={16} className="mr-2" />
                        {t.activateDegenAccess}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs font-mono bg-green-600/20 text-green-400 border-green-600/40 hover:bg-green-600/30"
                  onClick={() => navigate('/payment')}
                >
                  <Crown size={12} className="mr-1" />
                  {t.goDegen}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced Status Display for user_ui_config panel */}
      <div className="mt-3 p-3 bg-muted/50 border border-border rounded font-mono text-xs">
        <div className="space-y-1">
          <div className="font-bold text-accent">STATUS:</div>
          <div>{getStatusMessage()}</div>
          
          {premiumDetails && (
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              <div><strong>Type:</strong> {premiumDetails.type || 'None'}</div>
              {premiumDetails.expiresAt && (
                <div><strong>Expires:</strong> {new Date(premiumDetails.expiresAt).toLocaleDateString()}</div>
              )}
              {premiumDetails.isOnTrial && (
                <div className="text-blue-400"><strong>Trial Status:</strong> Active ({premiumDetails.trialTimeRemaining})</div>
              )}
              {isPremiumUser && (
                <div className="text-green-400"><strong>Degen Status:</strong> Active ({getDegenTimeRemaining()})</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
