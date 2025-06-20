
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useLocation } from 'react-router-dom';

interface AdSenseAdProps {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
  minContentRequired?: boolean;
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  slot = "auto", 
  style = { display: 'block' },
  className = "",
  minContentRequired = true
}) => {
  const { user } = useAuth();
  const { isPremiumUser } = usePremiumStatus();
  const location = useLocation();

  // Define pages with substantial content where ads are appropriate
  const contentRichPages = ['/dashboard', '/leaderboard'];
  const isContentRichPage = contentRichPages.includes(location.pathname);

  useEffect(() => {
    // Only load ads for non-premium users who are logged in and on content-rich pages
    if (user && !isPremiumUser && (!minContentRequired || isContentRichPage)) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [user, isPremiumUser, isContentRichPage, minContentRequired]);

  // Don't show ads if:
  // - User is not logged in (demo mode)
  // - User is premium
  // - We require content and this isn't a content-rich page
  if (!user || isPremiumUser || (minContentRequired && !isContentRichPage)) {
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
