
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
  responsive?: boolean;
}

export const UnicornStudioAnimation = ({
  projectId,
  width,
  height,
  enabled,
  className = '',
  style = {},
  isPaused = false,
  responsive = false
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

  // Enhanced responsive sizing for mobile
  const getResponsiveStyle = () => {
    if (!responsive) {
      return { width, height };
    }

    return {
      width: '100%',
      height: 'auto',
      aspectRatio: '16/9',
      maxWidth: width,
      maxHeight: height,
      minHeight: '300px'
    };
  };

  return (
    <div 
      className={`${className} ${responsive ? 'w-full' : ''}`}
      style={{
        ...style,
        opacity: isPaused ? 0.3 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        data-us-project={projectId} 
        style={{ 
          ...getResponsiveStyle(),
          margin: '0 auto'
        }}
        key={`${projectId}-${isReady}`}
      />
    </div>
  );
};
