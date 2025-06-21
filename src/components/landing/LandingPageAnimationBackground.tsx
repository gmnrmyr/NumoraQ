
import React from 'react';

interface LandingPageAnimationBackgroundProps {
  isAnimationEnabled: boolean;
  animationInitRef: React.MutableRefObject<boolean>;
}

export const LandingPageAnimationBackground: React.FC<LandingPageAnimationBackgroundProps> = ({
  isAnimationEnabled,
  animationInitRef
}) => {
  if (!isAnimationEnabled) return null;

  return (
    <div className="absolute inset-0 -mx-8 -mt-8 overflow-hidden z-0" style={{
      background: 'linear-gradient(to bottom, transparent 0%, transparent 80%, rgba(var(--background)) 100%)'
    }}>
      {/* Desktop Animation */}
      <div 
        data-us-project="PZSV1Zb8lHQjhdLRBsQN" 
        className="hidden lg:block w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
        style={{
          width: 'max(1440px, 120vw)',
          height: 'max(900px, 120vh)',
          transform: 'scale(1.1)'
        }} 
        key={`desktop-${animationInitRef.current}`}
      />
      
      {/* Mobile & Tablet Animation */}
      <div 
        data-us-project="Jmp7i20rUQsDyxKJ0OWM" 
        className="lg:hidden w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
        style={{
          width: 'max(768px, 120vw)',
          height: 'max(1024px, 120vh)',
          transform: 'scale(1.1)'
        }} 
        key={`mobile-${animationInitRef.current}`}
      />
    </div>
  );
};
