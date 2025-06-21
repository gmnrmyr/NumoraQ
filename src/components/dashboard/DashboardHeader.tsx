
import React from 'react';
import { Skull, Bot, Zap, Play, Pause } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { UserTitleBadge } from './UserTitleBadge';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const { user } = useAuth();
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const [profileName, setProfileName] = React.useState<string>('');
  
  // Load user profile name
  React.useEffect(() => {
    const loadProfileName = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          if (!error && profile?.name) {
            setProfileName(profile.name);
          }
        } catch (error) {
          console.error('Error loading profile name:', error);
        }
      }
    };

    loadProfileName();
  }, [user]);
  
  // Check if user has CHAMPION role (level 50+)
  const isChampionUser = userTitle.level >= 50;
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Should show animation
  const shouldShowAnimation = isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused;
  
  // Load UnicornStudio animation for CHAMPION users with Black Hole theme
  React.useEffect(() => {
    if (shouldShowAnimation) {
      console.log('Loading Black Hole animation for Champion user');
      
      const initUnicornStudio = () => {
        if (!window.UnicornStudio) {
          window.UnicornStudio = { 
            isInitialized: false,
            init: () => {}
          };
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
          script.onload = function() {
            if (!window.UnicornStudio.isInitialized) {
              try {
                // Use the global UnicornStudio directly
                if (typeof UnicornStudio !== 'undefined' && UnicornStudio.init) {
                  UnicornStudio.init();
                  window.UnicornStudio.isInitialized = true;
                  console.log('UnicornStudio initialized successfully');
                }
              } catch (error) {
                console.error('Error initializing UnicornStudio:', error);
              }
            }
          };
          script.onerror = () => {
            console.error('Failed to load UnicornStudio script');
          };
          (document.head || document.body).appendChild(script);
        } else if (!window.UnicornStudio.isInitialized) {
          try {
            if (typeof UnicornStudio !== 'undefined' && UnicornStudio.init) {
              UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
              console.log('UnicornStudio re-initialized');
            }
          } catch (error) {
            console.error('Error re-initializing UnicornStudio:', error);
          }
        }
      };

      initUnicornStudio();
    }
  }, [shouldShowAnimation]);
  
  return (
    <div className="relative">
      {/* Black Hole Animation as Full Background */}
      {shouldShowAnimation && (
        <>
          <div 
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ 
              background: 'transparent',
              overflow: 'hidden'
            }}
          >
            <div 
              data-us-project="db3DaP9gWVnnnr7ZevK7" 
              style={{ 
                width: '100vw', 
                height: '100vh',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: 0
              }}
            />
          </div>
          
          {/* Debug overlay */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed top-4 right-4 text-xs text-white bg-black/80 p-3 rounded z-50 border border-white/20">
              <div className="font-bold mb-1">🕳️ Black Hole Animation</div>
              <div>Champion: {isChampionUser ? '✅' : '❌'}</div>
              <div>Theme: {data.userProfile.theme}</div>
              <div>Animation Enabled: {isAnimationEnabled ? '✅' : '❌'}</div>
              <div>Should Show: {shouldShowAnimation ? '✅' : '❌'}</div>
              <div>Paused: {animationPaused ? '✅' : '❌'}</div>
            </div>
          )}
        </>
      )}
      
      <div className="text-center space-y-6 py-8 relative z-10">
        {/* Animation Controls for CHAMPION users with Black Hole theme */}
        {isChampionUser && isBlackHoleTheme && (
          <div className="absolute top-2 right-2 z-20">
            <Button
              onClick={() => setAnimationPaused(!animationPaused)}
              variant="outline"
              size="sm"
              className="brutalist-button bg-card/80 backdrop-blur-sm"
            >
              {animationPaused ? <Play size={16} /> : <Pause size={16} />}
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-4 py-[13px]">
          <div className="flex items-center gap-2">
            <div className="p-3 border-2 border-accent bg-background">
              <Skull className="text-accent" size={28} />
            </div>
            <div className="p-3 border-2 border-border bg-card">
              <Bot className="text-foreground" size={28} />
            </div>
            <div className="p-3 border-2 border-accent bg-background">
              <Zap className="text-accent" size={28} />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground brutalist-heading">
            FINANCIAL COMMAND CENTER
          </h1>
          {profileName && (
            <div className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap">
              <span className="text-accent">Welcome back, {profileName}</span>
            </div>
          )}
          <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-wider px-4">
            COMPLETE OVERSIGHT // DATA DRIVEN DECISIONS
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-4">
          <div className="w-8 h-1 bg-accent"></div>
          <div className="w-4 h-4 border-2 border-accent"></div>
          <div className="w-8 h-1 bg-accent"></div>
        </div>
      </div>
    </div>
  );
};
