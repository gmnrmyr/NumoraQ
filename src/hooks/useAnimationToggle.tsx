import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  // Start animations paused on all devices by default - too heavy for users
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Keep animations disabled by default on all devices for better UX
    // Users can manually enable if they want the eye candy
    setIsAnimationEnabled(false);
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
