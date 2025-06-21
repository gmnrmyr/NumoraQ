
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
    
    // Clean up any existing scripts first
    const existingScripts = document.querySelectorAll('script[src*="unicornStudio"]');
    existingScripts.forEach(script => script.remove());

    // Create the initialization script using the working pattern
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
                window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
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
            window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
          } catch (error) {
            console.error('🎬 UnicornStudio re-initialization failed:', error);
            window.dispatchEvent(new CustomEvent('unicornStudioError', { detail: error.message }));
          }
        } else {
          console.log('🎬 UnicornStudio already ready');
          window.dispatchEvent(new CustomEvent('unicornStudioReady', { detail: '${config.projectId}' }));
        }
      }();
    `;
    
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

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(initializeUnicornStudio, 100);

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
    initializeUnicornStudio();
  }, [initializeUnicornStudio]);

  return {
    isReady,
    isLoaded,
    isPaused,
    error,
    togglePause,
    retry
  };
}
