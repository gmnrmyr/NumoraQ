
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AdSenseAdProps {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  slot = "auto", 
  style = { display: 'block' },
  className = ""
}) => {
  const { user } = useAuth();
  const { isPremiumUser } = usePremiumStatus();

  // Don't show ads if user is not logged in or is premium
  if (!user || isPremiumUser) {
    return null;
  }

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2105716374571669"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
