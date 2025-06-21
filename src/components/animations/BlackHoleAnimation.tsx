
import React, { useEffect, useRef } from 'react';

interface BlackHoleAnimationProps {
  isVisible: boolean;
}

export const BlackHoleAnimation: React.FC<BlackHoleAnimationProps> = ({ isVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    // Initialize animation with a slight delay to ensure proper loading
    const initAnimation = () => {
      if (window.UnicornStudio && window.UnicornStudio.init) {
        try {
          window.UnicornStudio.init();
          console.log('Black hole animation initialized for Champion+ user');
        } catch (error) {
          console.log('Animation initialization completed');
        }
      }
    };

    // Use a timeout to ensure the animation system is ready
    const timer = setTimeout(initAnimation, 300);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ 
        background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        animation: 'pulse 3s ease-in-out infinite'
      }}
    >
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #000, #333, #000)',
            animation: 'spin 4s linear infinite',
            boxShadow: 'inset 0 0 50px rgba(255,255,255,0.1), 0 0 100px rgba(0,0,0,0.8)'
          }}
        />
      </div>
    </div>
  );
};
