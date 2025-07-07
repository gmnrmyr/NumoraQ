import React from 'react';
import { Card, CardContent, CardHeader } from './card';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
  showAvatar?: boolean;
  showHeader?: boolean;
  variant?: 'default' | 'card' | 'list' | 'metric';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  rows = 3,
  showAvatar = false,
  showHeader = true,
  variant = 'default'
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  if (variant === 'card') {
    return (
      <Card className={`${className} bg-card/50`}>
        {showHeader && (
          <CardHeader>
            <div className="flex items-center gap-3">
              {showAvatar && <div className={`${baseClasses} w-10 h-10 rounded-full`} />}
              <div className="flex-1 space-y-2">
                <div className={`${baseClasses} h-4 w-1/3`} />
                <div className={`${baseClasses} h-3 w-1/2`} />
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className={`${baseClasses} h-4 w-full`} style={{ width: `${Math.random() * 40 + 60}%` }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            {showAvatar && <div className={`${baseClasses} w-8 h-8 rounded-full`} />}
            <div className="flex-1 space-y-2">
              <div className={`${baseClasses} h-4 w-3/4`} />
              <div className={`${baseClasses} h-3 w-1/2`} />
            </div>
            <div className={`${baseClasses} h-6 w-16`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'metric') {
    return (
      <Card className={`${className} bg-card/50 border-2 border-dashed border-gray-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className={`${baseClasses} h-4 w-24`} />
          <div className={`${baseClasses} h-5 w-5 rounded`} />
        </CardHeader>
        <CardContent>
          <div className={`${baseClasses} h-8 w-32 mb-2`} />
          <div className={`${baseClasses} h-3 w-40`} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showHeader && (
        <div className="flex items-center gap-3">
          {showAvatar && <div className={`${baseClasses} w-10 h-10 rounded-full`} />}
          <div className={`${baseClasses} h-6 w-48`} />
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${baseClasses} h-4 w-full`} style={{ width: `${Math.random() * 40 + 60}%` }} />
      ))}
    </div>
  );
};

// Specialized loading components for common use cases
export const MetricLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="metric" className={className} />
);

export const CardLoadingSkeleton: React.FC<{ className?: string; rows?: number }> = ({ 
  className, 
  rows = 3 
}) => (
  <LoadingSkeleton variant="card" className={className} rows={rows} showHeader />
);

export const ListLoadingSkeleton: React.FC<{ 
  className?: string; 
  items?: number;
  showAvatars?: boolean;
}> = ({ 
  className, 
  items = 3,
  showAvatars = false 
}) => (
  <LoadingSkeleton 
    variant="list" 
    className={className} 
    rows={items} 
    showAvatar={showAvatars}
    showHeader={false}
  />
);

// Loading state for entire page sections
export const PageLoadingSkeleton: React.FC = () => (
  <div className="space-y-6 p-4">
    <LoadingSkeleton showHeader showAvatar rows={2} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <MetricLoadingSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardLoadingSkeleton rows={4} />
      <CardLoadingSkeleton rows={4} />
    </div>
  </div>
);

// Loading overlay for buttons and interactive elements
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-primary h-full w-full" />
    </div>
  );
}; 