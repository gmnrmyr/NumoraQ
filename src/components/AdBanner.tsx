
import React from 'react';
import { AdSenseAd } from './AdSenseAd';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = "" }) => {
  // Different ad slots for different positions (you'll need to create these in AdSense)
  const adSlots = {
    top: "1234567890", // Replace with actual ad slot IDs from AdSense
    bottom: "1234567891",
    sidebar: "1234567892", 
    inline: "1234567893"
  };

  const getAdStyle = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return { 
          display: 'block',
          width: '100%',
          height: '90px'
        };
      case 'sidebar':
        return {
          display: 'block',
          width: '300px',
          height: '250px'
        };
      case 'inline':
        return {
          display: 'block',
          width: '100%',
          height: '280px'
        };
      default:
        return { display: 'block' };
    }
  };

  return (
    <div className={`ad-banner ad-banner-${position} ${className}`}>
      <div className="text-xs text-muted-foreground text-center mb-1 font-mono">
        ADVERTISEMENT
      </div>
      <AdSenseAd
        adSlot={adSlots[position]}
        style={getAdStyle()}
        className="border border-border rounded"
      />
    </div>
  );
};
