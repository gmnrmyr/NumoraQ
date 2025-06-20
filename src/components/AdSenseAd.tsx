
import React, { useEffect } from 'react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  adSlot, 
  adFormat = "auto", 
  style = { display: 'block' },
  className = ""
}) => {
  const { isPremium, loading } = usePremiumStatus();

  useEffect(() => {
    if (!loading && !isPremium) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [loading, isPremium]);

  // Don't show ads for premium users or while loading
  if (loading || isPremium) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2105716374571669"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};
