
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Crown, Gift, Timer, CreditCard, Zap, AlertTriangle, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTrialActivation } from '@/hooks/useTrialActivation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const DegenModeSection = () => {
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  const [extendCode, setExtendCode] = useState('');
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

  const handleExtendDegenTime = async () => {
    const success = await activatePremiumCode(extendCode, user?.email, async () => {
      // This callback runs after successful activation
      // Add a small delay to ensure database update is processed
      setTimeout(async () => {
        await refetchPremiumStatus();
        toast({
          title: "🎉 Degen Time Extended!",
          description: "Your premium access has been extended! Time has been added to your current plan.",
          duration: 5000
        });
      }, 1000);
    });
    
    if (success) {
      setExtendCode('');
      setShowExtendDialog(false);
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
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    // Show more precise time for shorter periods
    if (diffDays <= 1) {
      if (diffHours <= 1) {
        return `${diffMinutes} Minutes`;
      }
      return `${diffHours} Hours`;
    }
    
    if (diffDays <= 7) return `${diffDays} Days`;
    if (diffDays <= 30) return `${diffDays} Days`;
    if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      if (remainingDays === 0) return `${months} Months`;
      return `${months}M ${remainingDays}D`;
    }
    
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const remainingMonths = Math.floor(remainingDays / 30);
    
    if (remainingMonths === 0) return `${years} Years`;
    return `${years}Y ${remainingMonths}M`;
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
      const source = premiumDetails?.activationSource || 'unknown';
      const sourceDisplay = source === 'stripe_payment' ? 'Stripe Payment' : 
                           source === 'premium_code' ? 'Premium Code' : 
                           source === 'admin_grant' ? 'Admin Grant' : 
                           source === 'auto_trial' ? 'Auto Trial' : 'Unknown';
      return `🚀 ${t.noAdsEnabled} - ${getDegenTimeRemaining()} remaining (Source: ${sourceDisplay})`;
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
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Crown size={16} className={isTrialOrPremium ? "text-yellow-400" : "text-muted-foreground"} />
          <span className="font-mono text-sm whitespace-nowrap">{t.degenMode}</span>
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
        
        {/* Action buttons - different for different user states */}
        <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
          {/* For active premium users - allow extending time */}
          {isPremiumUser && (
            <>
              <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="text-xs font-mono bg-blue-600/20 text-blue-400 border-blue-600/40 hover:bg-blue-600/30 whitespace-nowrap px-2"
                    title="Redeem a code to extend your premium time"
                  >
                    <Plus size={12} className="mr-1" />
                    <span className="hidden sm:inline">EXTEND TIME</span>
                    <span className="inline sm:hidden">EXTEND</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-mono text-accent">Extend Degen Time</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                      <p className="text-sm font-mono text-blue-400">
                        🎯 <strong>Time Stacking:</strong> Your new time will be added to your current plan. 
                        If you have 3 months and redeem a 1-month code, you'll have 4 months total.
                      </p>
                    </div>
                    <div className="bg-accent/10 p-3 rounded border border-accent/20">
                      <p className="text-sm font-mono text-muted-foreground">
                        Enter a premium code to extend your degen access. The time will be added to your current expiry date.
                      </p>
                    </div>
                    <Input
                      value={extendCode}
                      onChange={(e) => setExtendCode(e.target.value)}
                      placeholder="Enter premium code to extend time"
                      className="font-mono"
                    />
                    <Button
                      onClick={handleExtendDegenTime}
                      className="w-full font-mono"
                      disabled={!extendCode.trim()}
                    >
                      <Plus size={16} className="mr-2" />
                      Extend Degen Time
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs font-mono bg-green-600/20 text-green-400 border-green-600/40 hover:bg-green-600/30 whitespace-nowrap px-2"
                onClick={() => navigate('/payment')}
                title="Purchase more degen time"
              >
                <ShoppingCart size={12} className="mr-1" />
                <span className="hidden sm:inline">BUY MORE</span>
                <span className="inline sm:hidden">BUY</span>
              </Button>
            </>
          )}
          
          {/* For trial expired users */}
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
          
          {/* For users without premium or trial */}
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
      </div>
      
      {/* Enhanced Status Display for user_ui_config panel */}
      <div className="mt-3 p-3 bg-muted/50 border border-border rounded font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-accent">STATUS:</div>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                console.log('🔄 Manual refresh triggered from DegenModeSection');
                await refetchPremiumStatus();
                toast({
                  title: "Status Refreshed",
                  description: "Premium status has been refreshed. Check console for details.",
                });
              }}
              className="text-xs h-6 px-2"
            >
              🔄 REFRESH
            </Button>
          </div>
          <div>{getStatusMessage()}</div>
          
          {/* Debug Information */}
          <div className="mt-2 pt-2 border-t border-border text-yellow-400 text-xs">
            <div><strong>🐛 DEBUG INFO:</strong></div>
            <div>User ID: {user?.id?.substring(0, 8)}...</div>
            <div>Is Premium: {isPremiumUser ? 'Yes' : 'No'}</div>
            <div>Is On Trial: {premiumDetails?.isOnTrial ? 'Yes' : 'No'}</div>
            {premiumDetails && (
              <div>Raw Expires: {premiumDetails.expiresAt || 'None'}</div>
            )}
            <div>Browser Time: {new Date().toLocaleString()}</div>
          </div>
          
          {premiumDetails && (
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              <div><strong>Type:</strong> {premiumDetails.type || 'None'}</div>
              {premiumDetails.expiresAt && (
                <div><strong>Expires:</strong> {new Date(premiumDetails.expiresAt).toLocaleDateString()}</div>
              )}
              {premiumDetails.activationSource && (
                <div><strong>Source:</strong> {premiumDetails.activationSource}</div>
              )}
              {premiumDetails.isOnTrial && (
                <div className="text-blue-400"><strong>Trial Status:</strong> Active ({premiumDetails.trialTimeRemaining})</div>
              )}
              {isPremiumUser && (
                <div className="text-green-400"><strong>Degen Status:</strong> Active ({getDegenTimeRemaining()})</div>
              )}
            </div>
          )}
          
          {/* Manual test buttons for debugging */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-yellow-400 font-bold text-xs mb-1">🧪 MANUAL TESTS:</div>
            <div className="flex gap-1 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  console.log('🧪 Testing manual premium status query...');
                  const { data, error } = await supabase
                    .from('user_premium_status')
                    .select('*')
                    .eq('user_id', user?.id);
                  console.log('Premium status raw data:', data, 'Error:', error);
                  toast({
                    title: "DB Query Test",
                    description: `Found ${data?.length || 0} records. Check console for details.`,
                  });
                }}
                className="text-xs h-6 px-2"
              >
                DB TEST
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  console.log('🧪 Testing user points query...');
                  const { data, error } = await supabase
                    .from('user_points')
                    .select('*')
                    .eq('user_id', user?.id);
                  console.log('User points raw data:', data, 'Error:', error);
                  const total = data?.reduce((sum, entry) => sum + entry.points, 0) || 0;
                  toast({
                    title: "Points Test",
                    description: `Total points: ${total}. Check console for details.`,
                  });
                }}
                className="text-xs h-6 px-2"
              >
                POINTS TEST
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
