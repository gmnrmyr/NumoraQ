
import React, { useEffect, useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';

export const BackgroundAnimation = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [animationInitialized, setAnimationInitialized] = useState(false);
  
  // Check if user has CHAMPION+ role (level 70+ OR champion/legend titles)
  const isChampionUser = userTitle.level >= 70 || ['WHALE', 'LEGEND', 'PATRON', 'CHAMPION'].includes(userTitle.title);
  
  // Check if black hole theme is active
  const isBlackHoleTheme = data.userProfile.theme === 'black-hole';
  
  // Only show for Champion+ users with black hole theme
  const shouldShow = isChampionUser && isBlackHoleTheme;

  useEffect(() => {
    console.log('🎬 BackgroundAnimation: shouldShow =', shouldShow, {
      isChampionUser,
      isBlackHoleTheme,
      userLevel: userTitle.level,
      userTitle: userTitle.title,
      theme: data.userProfile.theme
    });

    if (!shouldShow) return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="unicornstudio"]');
    console.log('🎬 BackgroundAnimation: Existing script found =', !!existingScript);

    if (!existingScript) {
      console.log('🎬 BackgroundAnimation: Loading UnicornStudio script...');
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        !function(){
          console.log('🎬 UnicornStudio inline script executing...');
          if(!window.UnicornStudio){
            console.log('🎬 UnicornStudio not found, creating...');
            window.UnicornStudio={isInitialized:!1};
            var i=document.createElement("script");
            i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
            i.onload=function(){
              console.log('🎬 UnicornStudio script loaded, initializing...');
              if(!window.UnicornStudio.isInitialized){
                try {
                  UnicornStudio.init();
                  window.UnicornStudio.isInitialized=!0;
                  console.log('🎬 UnicornStudio initialized successfully!');
                  window.dispatchEvent(new CustomEvent('unicornStudioReady'));
                } catch(e) {
                  console.error('🎬 UnicornStudio init failed:', e);
                }
              }
            };
            i.onerror=function(){
              console.error('🎬 Failed to load UnicornStudio script');
            };
            (document.head || document.body).appendChild(i);
          } else {
            console.log('🎬 UnicornStudio already exists, checking initialization...');
            if(!window.UnicornStudio.isInitialized){
              try {
                UnicornStudio.init();
                window.UnicornStudio.isInitialized=!0;
                console.log('🎬 UnicornStudio re-initialized!');
                window.dispatchEvent(new CustomEvent('unicornStudioReady'));
              } catch(e) {
                console.error('🎬 UnicornStudio re-init failed:', e);
              }
            } else {
              console.log('🎬 UnicornStudio already initialized');
              window.dispatchEvent(new CustomEvent('unicornStudioReady'));
            }
          }
        }();
      `;
      document.head.appendChild(script);
      setScriptLoaded(true);
    } else {
      console.log('🎬 BackgroundAnimation: Script already exists, checking readiness...');
      setScriptLoaded(true);
      
      // Check if UnicornStudio is ready
      if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
        console.log('🎬 BackgroundAnimation: UnicornStudio already ready');
        setAnimationInitialized(true);
      } else {
        // Try to initialize if it exists but isn't initialized
        setTimeout(() => {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            try {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
              console.log('🎬 BackgroundAnimation: Late initialization successful');
              setAnimationInitialized(true);
            } catch (e) {
              console.error('🎬 BackgroundAnimation: Late initialization failed:', e);
            }
          }
        }, 500);
      }
    }

    // Listen for ready event
    const handleReady = () => {
      console.log('🎬 BackgroundAnimation: Received unicornStudioReady event');
      setAnimationInitialized(true);
    };

    window.addEventListener('unicornStudioReady', handleReady);

    return () => {
      window.removeEventListener('unicornStudioReady', handleReady);
    };
  }, [shouldShow]);

  if (!shouldShow) {
    console.log('🎬 BackgroundAnimation: Not showing (user not Champion+ or theme not black-hole)');
    return null;
  }

  console.log('🎬 BackgroundAnimation: Rendering with state:', {
    scriptLoaded,
    animationInitialized,
    shouldShow
  });

  return (
    <>
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-black/90 text-white p-2 text-xs border border-white/20">
          <div>🎬 BG Animation Debug:</div>
          <div>Should Show: {shouldShow ? '✅' : '❌'}</div>
          <div>Script Loaded: {scriptLoaded ? '✅' : '❌'}</div>
          <div>Animation Init: {animationInitialized ? '✅' : '❌'}</div>
          <div>UnicornStudio: {typeof window !== 'undefined' && window.UnicornStudio ? '✅' : '❌'}</div>
        </div>
      )}

      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ paddingTop: '80px' }}
      >
        <div 
          className="flex justify-center w-full h-full"
        >
          <div 
            data-us-project="db3DaP9gWVnnnr7ZevK7" 
            style={{ 
              width: '2000px', 
              height: '900px',
              border: process.env.NODE_ENV === 'development' ? '2px solid #00ff00' : 'none',
              backgroundColor: process.env.NODE_ENV === 'development' ? 'rgba(255,0,0,0.1)' : 'transparent'
            }}
          />
        </div>
      </div>
    </>
  );
};
