
import { useState, useEffect, useCallback } from 'react';

interface AnimationConfig {
  projectId: string;
  width: string;
  height: string;
  enabled: boolean;
}

export function useUnicornStudioAnimation(config: AnimationConfig) {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeUnicornStudio = useCallback(() => {
    if (!config.enabled) return;

    console.log('🎬 Initializing UnicornStudio for project:', config.projectId);
    
    // Enhanced initialization for better reliability
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
          i.onload=function(){
            if(!window.UnicornStudio.isInitialized){
              try {
                UnicornStudio.init();
                window.UnicornStudio.isInitialized=!0;
                console.log('🎬 UnicornStudio initialized successfully');
                // Force re-render after initialization
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
                }, 200);
              } catch (error) {
                console.error('🎬 UnicornStudio initialization failed:', error);
                window.dispatchEvent(new CustomEvent('unicornStudioError', { detail: error.message }));
              }
            }
          };
          i.onerror=function(){
            console.error('🎬 Failed to load UnicornStudio script');
            window.dispatchEvent(new CustomEvent('unicornStudioError', { detail: 'Script load failed' }));
          };
          (document.head || document.body).appendChild(i);
        } else if(!window.UnicornStudio.isInitialized){
          try {
            UnicornStudio.init();
            window.UnicornStudio.isInitialized=!0;
            console.log('🎬 UnicornStudio re-initialized');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
            }, 200);
          } catch (error) {
            console.error('🎬 UnicornStudio re-initialization failed:', error);
            window.dispatchEvent(new CustomEvent('unicornStudioError', { detail: error.message }));
          }
        } else {
          console.log('🎬 UnicornStudio already ready');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
          }, 100);
        }
      }();
    `;
    
    // Remove any existing animation scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="unicornstudio"]');
    existingScripts.forEach(script => script.remove());
    
    document.head.appendChild(script);
  }, [config.enabled, config.projectId]);

  useEffect(() => {
    if (!config.enabled) {
      setIsReady(false);
      setIsLoaded(false);
      return;
    }

    const handleReady = (event: CustomEvent) => {
      if (event.detail === config.projectId) {
        console.log('🎬 Animation ready for project:', config.projectId);
        setIsReady(true);
        setIsLoaded(true);
        setError(null);
      }
    };

    const handleError = (event: CustomEvent) => {
      console.error('🎬 Animation error:', event.detail);
      setError(event.detail);
      setIsLoaded(false);
    };

    window.addEventListener('unicornStudioReady', handleReady as EventListener);
    window.addEventListener('unicornStudioError', handleError as EventListener);

    // Initialize with proper delay for DOM readiness
    const timer = setTimeout(initializeUnicornStudio, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('unicornStudioReady', handleReady as EventListener);
      window.removeEventListener('unicornStudioError', handleError as EventListener);
    };
  }, [config.enabled, config.projectId, initializeUnicornStudio]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    console.log('🎬 Animation', isPaused ? 'resumed' : 'paused', 'for project:', config.projectId);
  }, [isPaused, config.projectId]);

  const retry = useCallback(() => {
    setError(null);
    setIsReady(false);
    setIsLoaded(false);
    // Clean up before retry
    const existingElements = document.querySelectorAll(`[data-us-project="${config.projectId}"]`);
    existingElements.forEach(el => el.innerHTML = '');
    setTimeout(initializeUnicornStudio, 500);
  }, [initializeUnicornStudio, config.projectId]);

  return {
    isReady,
    isLoaded,
    isPaused,
    error,
    togglePause,
    retry
  };
}
