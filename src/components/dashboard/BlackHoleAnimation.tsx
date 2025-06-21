
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlackHoleAnimationProps {
  isVisible: boolean;
}

export const BlackHoleAnimation: React.FC<BlackHoleAnimationProps> = ({ isVisible }) => {
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const animationRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isVisible) return;

    console.log('🕳️ BlackHole: Starting initialization');
    
    const loadAnimation = () => {
      // Clean up any existing UnicornStudio
      if (window.UnicornStudio) {
        console.log('🕳️ BlackHole: Cleaning existing UnicornStudio');
        delete window.UnicornStudio;
      }

      // Remove existing scripts
      const existingScripts = document.querySelectorAll('script[src*="unicornStudio"]');
      existingScripts.forEach(script => script.remove());

      // Create and inject the script directly
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js';
      script.onload = () => {
        console.log('🕳️ BlackHole: Script loaded, initializing');
        if (window.UnicornStudio) {
          try {
            window.UnicornStudio.init();
            setScriptLoaded(true);
            console.log('🕳️ BlackHole: Animation initialized successfully');
          } catch (error) {
            console.error('🕳️ BlackHole: Init error:', error);
          }
        }
      };
      script.onerror = (error) => {
        console.error('🕳️ BlackHole: Script load error:', error);
      };

      document.head.appendChild(script);
    };

    // Load with a small delay to ensure DOM is ready
    const timer = setTimeout(loadAnimation, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Animation Container */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <div 
          ref={animationRef}
          data-us-project="db3DaP9gWVnnnr7ZevK7" 
          style={{ 
            width: '100vw', 
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: animationPaused ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      {/* Animation Controls */}
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

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 text-xs text-white bg-black/80 p-3 rounded z-50 border border-white/20">
          <div className="font-bold mb-1">🕳️ BlackHole Debug</div>
          <div>Visible: {isVisible ? '✅' : '❌'}</div>
          <div>Script Loaded: {scriptLoaded ? '✅' : '❌'}</div>
          <div>Paused: {animationPaused ? '✅' : '❌'}</div>
          <div>UnicornStudio: {window.UnicornStudio ? '✅' : '❌'}</div>
        </div>
      )}
    </>
  );
};
