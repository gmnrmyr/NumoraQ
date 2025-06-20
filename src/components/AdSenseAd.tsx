
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

  useEffect(() => {
    // Only load ads for non-premium users who are logged in
    if (user && !isPremiumUser) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [user, isPremiumUser]);

  // Don't show ads if user is not logged in or is premium
  if (!user || isPremiumUser) {
    return null;
  }

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
