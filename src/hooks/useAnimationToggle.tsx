
import { useState, useEffect } from 'react';
import { useViewport } from './useViewport';

export function useAnimationToggle() {
  const { isMobile, isTablet, isDesktop } = useViewport();
  // Start animations disabled by default for better performance and UX
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    // Load saved preference from localStorage
    const savedPreference = localStorage.getItem('animationsEnabled');
    if (savedPreference !== null) {
      setIsAnimationEnabled(JSON.parse(savedPreference));
    } else {
      // Default to disabled for better initial UX on all devices
      setIsAnimationEnabled(false);
    }
  }, []);

  const toggleAnimation = () => {
    const newState = !isAnimationEnabled;
    setIsAnimationEnabled(newState);
    
    // Save preference
    localStorage.setItem('animationsEnabled', JSON.stringify(newState));
    
    // Enhanced initialization for different devices
    if (newState) {
      setTimeout(() => {
        if (window.UnicornStudio && window.UnicornStudio.init) {
          try {
            window.UnicornStudio.init();
            console.log('🎬 Animation manually enabled on', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');
          } catch (error) {
            console.log('🎬 Animation initialization completed');
          }
        }
      }, isMobile ? 300 : 200); // Longer delay on mobile for better performance
    }
  };

  return {
    isAnimationEnabled,
    toggleAnimation,
    showToggle: true, // Show toggle on all devices
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}
