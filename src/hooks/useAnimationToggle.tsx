
import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Enhanced default animation state based on device type
    // Desktop: Auto-enabled for better experience
    // Mobile/Tablet: Disabled by default to prevent issues, user can opt-in
    if (isDesktop) {
      setIsAnimationEnabled(true);
    } else {
      // Default to false for mobile/tablet, user can manually enable
      setIsAnimationEnabled(false);
    }
  }, [isDesktop, isMobile, isTablet]);

  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
    
    // For mobile/tablet, we might need to trigger a small delay
    // to allow the animation system to properly initialize
    if ((isMobile || isTablet) && !isAnimationEnabled) {
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
    showToggle: isMobile || isTablet // Show toggle only on mobile/tablet
  };
}
