
import React from 'react';
import { useUnicornStudioAnimation } from '@/hooks/useUnicornStudioAnimation';

interface UnicornStudioAnimationProps {
  projectId: string;
  width: string;
  height: string;
  enabled: boolean;
  className?: string;
  style?: React.CSSProperties;
  isPaused?: boolean;
}

export const UnicornStudioAnimation = ({
  projectId,
  width,
  height,
  enabled,
  className = '',
  style = {},
  isPaused = false
}: UnicornStudioAnimationProps) => {
  const { isReady, isLoaded } = useUnicornStudioAnimation({
    projectId,
    width,
    height,
    enabled
  });

  if (!enabled || !isLoaded) {
    return null;
  }

  return (
    <div 
      className={className}
      style={{
        ...style,
        opacity: isPaused ? 0.3 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }}
    >
      <div 
        data-us-project={projectId} 
        style={{ 
          width, 
          height,
          margin: '0 auto'
        }}
      />
    </div>
  );
};
