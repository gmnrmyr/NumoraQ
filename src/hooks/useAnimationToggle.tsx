
import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Default animation state is disabled for all devices
    // Users can manually enable if they want
    setIsAnimationEnabled(false);
  }, [isDesktop, isMobile, isTablet]);

  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
    
    // For all devices, we might need to trigger a small delay
    // to allow the animation system to properly initialize
    if (!isAnimationEnabled) {
      setTimeout(() => {
        // Force a re-check of animation initialization
        if (window.UnicornStudio && window.UnicornStudio.init) {
          try {
            window.UnicornStudio.init();
          } catch (error) {
            console.log('Animation manual trigger completed');
          }
        }
      }, 200);
    }
  };

  return {
    isAnimationEnabled,
    toggleAnimation,
    showToggle: true // Show toggle on all devices now
  };
}
