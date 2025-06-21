
import { useState, useEffect, useRef } from 'react';

export function useLandingPageAnimation() {
  // Always start paused for better UX (noted: too heavy for users)
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);
  const animationInitRef = useRef<boolean>(false);

  useEffect(() => {
    // Enhanced Unicorn Studio initialization with navigation fix
    const initializeAnimation = () => {
      // Reset animation state on each page load
      animationInitRef.current = false;
      if (!window.UnicornStudio) {
        window.UnicornStudio = {
          isInitialized: false,
          init: () => {}
        };
      }

      // Force reinitialize if already exists
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
          } catch (error) {
            console.log('Animation initialization skipped');
          }
        }
      };

      // Remove existing script if present
      const existingScript = document.querySelector('script[src*="unicornStudio"]');
      if (existingScript) {
        existingScript.remove();
      }
      (document.head || document.body).appendChild(script);
    };

    // Initialize animation with a small delay to ensure DOM is ready
    const initTimer = setTimeout(initializeAnimation, 100);
    return () => clearTimeout(initTimer);
  }, []);

  // Additional effect to handle animation state changes
  useEffect(() => {
    if (isAnimationEnabled && !animationInitRef.current) {
      // Re-attempt initialization if animation is enabled but not initialized
      const retryTimer = setTimeout(() => {
        if (window.UnicornStudio && !animationInitRef.current) {
          try {
            window.UnicornStudio.init();
            animationInitRef.current = true;
          } catch (error) {
            console.log('Animation retry failed, but continuing');
          }
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [isAnimationEnabled]);

  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  return {
    isAnimationEnabled,
    toggleAnimation,
    showToggle: true,
    animationInitRef
  };
}
