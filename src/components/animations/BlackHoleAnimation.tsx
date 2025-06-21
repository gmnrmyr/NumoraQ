
import React, { useEffect, useRef } from 'react';
import { useUserTitle } from '@/hooks/useUserTitle';

interface BlackHoleAnimationProps {
  className?: string;
}

export const BlackHoleAnimation: React.FC<BlackHoleAnimationProps> = ({ className = "" }) => {
  const { userTitle } = useUserTitle();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  // Check if user has Champion+ role (400+ points)
  const hasChampionRole = userTitle && userTitle.level >= 400;

  useEffect(() => {
    if (!hasChampionRole || !containerRef.current) return;

    const loadAnimation = async () => {
      try {
        // Wait for Unicorn Studio to be available
        if (typeof window !== 'undefined' && window.UnicornStudio) {
          // Clear any existing animation
          if (animationRef.current) {
            animationRef.current.destroy();
          }

          // Initialize the black hole animation
          animationRef.current = window.UnicornStudio.init({
            container: containerRef.current,
            scene: 'blackhole', // This should match your Unicorn Studio scene name
            autoplay: true,
            loop: true,
            width: '100%',
            height: '100%',
            responsive: true
          });

        } else {
          // Fallback: try to initialize after a delay
          setTimeout(() => {
            if (window.UnicornStudio && containerRef.current) {
              animationRef.current = window.UnicornStudio.init({
                container: containerRef.current,
                scene: 'blackhole',
                autoplay: true,
                loop: true,
                width: '100%',
                height: '100%',
                responsive: true
              });
            }
          }, 1000);
        }
      } catch (error) {
        console.log('Animation loading handled gracefully');
      }
    };

    loadAnimation();

    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.destroy();
        } catch (error) {
          console.log('Animation cleanup handled gracefully');
        }
      }
    };
  }, [hasChampionRole]);

  if (!hasChampionRole) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`black-hole-animation ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};
