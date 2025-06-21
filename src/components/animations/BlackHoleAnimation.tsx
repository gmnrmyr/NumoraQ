
import React from 'react';
import { useUserTitle } from '@/hooks/useUserTitle';

export const BlackHoleAnimation: React.FC = () => {
  const { userTitle } = useUserTitle();
  
  // Only show for Champion+ users (level 50+)
  const shouldShowAnimation = userTitle.level >= 50;
  
  if (!shouldShowAnimation) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32 animate-spin" style={{ animation: 'spin 20s linear infinite' }}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border border-purple-400/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Inner core */}
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-purple-600/40 via-purple-800/60 to-black animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="absolute inset-1 rounded-full bg-gradient-radial from-transparent via-purple-900/50 to-black"></div>
          </div>
          
          {/* Particle effects */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateX(24px)`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
