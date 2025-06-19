
import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Default animation state based on device type
    if (isDesktop) {
      setIsAnimationEnabled(true);
    } else {
      setIsAnimationEnabled(false);
    }
  }, [isDesktop, isMobile, isTablet]);

  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  return {
    isAnimationEnabled,
    toggleAnimation,
    showToggle: isMobile || isTablet
  };
}
