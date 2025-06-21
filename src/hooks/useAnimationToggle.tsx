
import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Enable animations by default on desktop for better UX
    // Users can still disable if needed
    setIsAnimationEnabled(isDesktop);
  }, [isDesktop, isMobile, isTablet]);

  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
    
    // For all devices, trigger a small delay for proper initialization
    if (!isAnimationEnabled) {
      setTimeout(() => {
        if (window.UnicornStudio && window.UnicornStudio.init) {
          try {
            window.UnicornStudio.init();
            console.log('🎬 Animation manually triggered');
          } catch (error) {
            console.log('🎬 Animation manual trigger completed');
          }
        }
      }, 200);
    }
  };

  return {
    isAnimationEnabled,
    toggleAnimation,
    showToggle: true // Show toggle on all devices
  };
}
