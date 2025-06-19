
import { useState, useEffect } from 'react';

interface ViewportInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewport({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        width
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}

// Legacy export for backward compatibility
export function useIsMobile(): boolean {
  const { isMobile } = useViewport();
  return isMobile;
}
