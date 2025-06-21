
import React, { useEffect, useRef } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';

export const DarkHole2Background = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const { isAnimationEnabled } = useAnimationToggle();
  const animationInitRef = useRef<boolean>(false);
  
  // Check if user is Whales+ (10,000+ points)
  const isWhalesUser = userTitle.level >= 10000 || ['WHALE', 'LEGEND'].includes(userTitle.title);
  
  // Check if dark-hole-2 theme is active
  const isDarkHole2Theme = data.userProfile.theme === 'dark-hole-2';
  
  // Only show for Whales+ users with dark-hole-2 theme and animation enabled
  const shouldShow = isWhalesUser && isDarkHole2Theme && isAnimationEnabled;

  useEffect(() => {
    console.log('🌌 DarkHole2Background: shouldShow =', shouldShow, {
      isWhalesUser,
      isDarkHole2Theme,
      isAnimationEnabled,
      userLevel: userTitle.level,
      userTitle: userTitle.title,
      theme: data.userProfile.theme
    });

    if (!shouldShow) {
      animationInitRef.current = false;
      return;
    }

    // Use the exact same initialization as landing page
    const initializeAnimation = () => {
      // Reset animation state
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
            console.log('🌌 DarkHole2Background: Animation initialized successfully');
          } catch (error) {
            console.error('🌌 DarkHole2Background: Animation initialization failed', error);
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

    const initTimer = setTimeout(initializeAnimation, 100);
    return () => clearTimeout(initTimer);
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  console.log('🌌 DarkHole2Background: Rendering background animation');

  return (
    <div className="background-animation-container">
      {/* Desktop Animation - Using Black Hole project ID */}
      <div 
        data-us-project="db3DaP9gWVnnnr7ZevK7" 
        className="hidden lg:block w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
        style={{
          width: 'max(1440px, 120vw)',
          height: 'max(900px, 120vh)',
          transform: 'scale(1.1)'
        }} 
        key={`desktop-dark-hole-2-${animationInitRef.current}`}
      />
      
      {/* Mobile & Tablet Animation - Using Black Hole project ID */}
      <div 
        data-us-project="db3DaP9gWVnnnr7ZevK7" 
        className="lg:hidden w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
        style={{
          width: 'max(768px, 120vw)',
          height: 'max(1024px, 120vh)',
          transform: 'scale(1.1)'
        }} 
        key={`mobile-dark-hole-2-${animationInitRef.current}`}
      />

      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-purple-900/90 text-white p-2 text-xs border border-purple-400/50">
          🌌 DARK HOLE 2 - WHALES+ ACTIVE
        </div>
      )}
    </div>
  );
};
