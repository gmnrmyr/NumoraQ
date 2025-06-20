
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
  const [animationLoaded, setAnimationLoaded] = React.useState(false);
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
  
  // Check if user has CHAMPION role (2000+ donation points or level 80+)
  const isChampionUser = userTitle.level >= 80 || userTitle.title === 'CHAMPION';
  
  // Check if Black Hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Load UnicornStudio animation for CHAMPION users with Black Hole theme
  React.useEffect(() => {
    if (isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused) {
      const loadUnicornStudio = () => {
        // Remove any existing scripts first
        const existingScripts = document.querySelectorAll('script[src*="unicornstudio"]');
        existingScripts.forEach(script => script.remove());
        
        // Reset UnicornStudio
        if (window.UnicornStudio) {
          window.UnicornStudio.isInitialized = false;
        }
        
        // Create and inject the script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
        
        script.onload = () => {
          console.log('UnicornStudio script loaded');
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            try {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
              setAnimationLoaded(true);
              console.log('UnicornStudio initialized successfully');
            } catch (error) {
              console.error('Error initializing UnicornStudio:', error);
            }
          }
        };
        
        script.onerror = () => {
          console.error('Failed to load UnicornStudio script');
        };
        
        document.head.appendChild(script);
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(loadUnicornStudio, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationLoaded(false);
    }
  }, [isChampionUser, isBlackHoleTheme, isAnimationEnabled, animationPaused]);
  
  // Force re-initialization when animation becomes visible
  React.useEffect(() => {
    if (animationLoaded && isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused) {
      const timer = setTimeout(() => {
        if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
          try {
            // Try to re-initialize to ensure animation shows
            window.UnicornStudio.init();
            console.log('UnicornStudio re-initialized');
          } catch (error) {
            console.error('Error re-initializing UnicornStudio:', error);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationLoaded, isChampionUser, isBlackHoleTheme, isAnimationEnabled, animationPaused]);
  
  return (
    <div className="relative">
      {/* UnicornStudio Animation Background for CHAMPION users with Black Hole theme */}
      {isChampionUser && isBlackHoleTheme && isAnimationEnabled && !animationPaused && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            data-us-project="db3DaP9gWVnnnr7ZevK7" 
            style={{ 
              width: '2400px', 
              height: '1200px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.5)',
              transformOrigin: 'center center'
            }}
          />
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 p-2 rounded z-10">
              Animation: {animationLoaded ? 'Loaded' : 'Loading...'}
            </div>
          )}
        </div>
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
