
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlackHoleAnimationProps {
  isVisible: boolean;
}

export const BlackHoleAnimation: React.FC<BlackHoleAnimationProps> = ({ isVisible }) => {
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const animationInitRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!isVisible) return;

    console.log('🕳️ BlackHole: Starting initialization');
    
    // Reset animation state on each page load - same as landing page
    animationInitRef.current = false;
    if (!window.UnicornStudio) {
      window.UnicornStudio = {
        isInitialized: false,
        init: () => {}
      };
    }

    // Force reinitialize if already exists - same as landing page
    if (window.UnicornStudio.isInitialized) {
      window.UnicornStudio.isInitialized = false;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
    script.onload = function () {
      if (!animationInitRef.current) {
        try {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
          animationInitRef.current = true;
          console.log('🕳️ BlackHole: Animation initialized successfully');
        } catch (error) {
          console.log('🕳️ BlackHole: Animation initialization skipped');
        }
      }
    };

    // Remove existing script if present - same as landing page
    const existingScript = document.querySelector('script[src*="unicornStudio"]');
    if (existingScript) {
      existingScript.remove();
    }
    (document.head || document.body).appendChild(script);

    // Initialize animation with a small delay to ensure DOM is ready - same as landing page
    const initTimer = setTimeout(() => {
      if (window.UnicornStudio && !animationInitRef.current) {
        try {
          window.UnicornStudio.init();
          animationInitRef.current = true;
        } catch (error) {
          console.log('🕳️ BlackHole: Animation retry failed, but continuing');
        }
      }
    }, 500);

    return () => clearTimeout(initTimer);
  }, [isVisible]);

  // Additional effect to handle animation state changes - same as landing page
  React.useEffect(() => {
    if (isVisible && !animationInitRef.current) {
      const retryTimer = setTimeout(() => {
        if (window.UnicornStudio && !animationInitRef.current) {
          try {
            window.UnicornStudio.init();
            animationInitRef.current = true;
          } catch (error) {
            console.log('🕳️ BlackHole: Animation retry failed, but continuing');
          }
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Animation Container - positioned like landing page but for dashboard */}
      <div className="absolute inset-0 -mx-8 -mt-8 overflow-hidden z-0 pointer-events-none">
        {/* Using 400x400 size as requested */}
        <div 
          data-us-project="db3DaP9gWVnnnr7ZevK7" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            width: '400px',
            height: '400px',
            opacity: animationPaused ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
          key={`blackhole-${animationInitRef.current}`}
        />
      </div>

      {/* Animation Controls - same as landing page but positioned for dashboard */}
      <div className="absolute top-4 right-4 z-20">
        <Button 
          onClick={() => setAnimationPaused(!animationPaused)} 
          variant="outline" 
          size="sm" 
          className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative pointer-events-auto" 
          title={animationPaused ? 'Play Animation' : 'Pause Animation (Heavy GPU)'}
        >
          {animationPaused ? <Play size={16} /> : <Pause size={16} />}
          {/* Tooltip on hover - same as landing page */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {animationPaused ? 'Play Animation' : 'Pause Anim (Heavy GPU)'}
          </div>
        </Button>
      </div>

      {/* Debug Info - enhanced */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 text-xs text-white bg-black/80 p-3 rounded z-50 border border-white/20 pointer-events-auto">
          <div className="font-bold mb-1">🕳️ BlackHole Debug</div>
          <div>Visible: {isVisible ? '✅' : '❌'}</div>
          <div>Init Ref: {animationInitRef.current ? '✅' : '❌'}</div>
          <div>Paused: {animationPaused ? '✅' : '❌'}</div>
          <div>UnicornStudio: {window.UnicornStudio ? '✅' : '❌'}</div>
          <div>US Initialized: {window.UnicornStudio?.isInitialized ? '✅' : '❌'}</div>
        </div>
      )}
    </>
  );
};
