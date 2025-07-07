import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'square' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

interface IconProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  size = 'md',
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    sm: {
      text: 'text-sm sm:text-base',
      spacing: 'tracking-wider',
      padding: 'px-2 py-1'
    },
    md: {
      text: 'text-base sm:text-lg md:text-xl',
      spacing: 'tracking-widest',
      padding: 'px-3 py-1.5'
    },
    lg: {
      text: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
      spacing: 'tracking-widest',
      padding: 'px-4 py-2'
    }
  };

  const baseClasses = `
    font-mono font-black uppercase
    text-accent
    ${sizeClasses[size].text}
    ${sizeClasses[size].spacing}
    ${sizeClasses[size].padding}
    select-none
    transition-all duration-200
    ${onClick ? 'cursor-pointer hover:text-accent/80 hover:scale-105' : ''}
    ${className}
  `;

  if (variant === 'compact') {
    return (
      <div 
        className={`${baseClasses} border-2 border-accent bg-background/50 backdrop-blur-sm`}
        onClick={onClick}
        style={{
          textShadow: '0 0 10px rgba(var(--accent), 0.3)',
          filter: 'drop-shadow(0 0 4px rgba(var(--accent), 0.2))'
        }}
      >
        N<span className="text-foreground">MRQ</span>
      </div>
    );
  }

  if (variant === 'square') {
    return (
      <div 
        className={`${baseClasses} border-2 border-accent bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center leading-none`}
        onClick={onClick}
        style={{
          textShadow: '0 0 10px rgba(var(--accent), 0.3)',
          filter: 'drop-shadow(0 0 4px rgba(var(--accent), 0.2))'
        }}
      >
        <div className="text-accent">NUM</div>
        <div className="text-foreground text-sm">RAQ</div>
      </div>
    );
  }

  // horizontal (default)
  return (
    <div 
      className={`${baseClasses} border-2 border-accent bg-background/50 backdrop-blur-sm relative overflow-hidden`}
      onClick={onClick}
      style={{
        textShadow: '0 0 10px rgba(var(--accent), 0.3)',
        filter: 'drop-shadow(0 0 4px rgba(var(--accent), 0.2))'
      }}
    >
      {/* Subtle scanning line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-pulse opacity-50" />
      
      <span className="relative z-10">
        <span className="text-accent">NUM</span>
        <span className="text-foreground">O</span>
        <span className="text-accent">RAQ</span>
      </span>
      
      {/* Pixel corners for tech aesthetic */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-accent" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-accent" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-accent" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-accent" />
    </div>
  );
};

// Icon component for favicons, app icons, etc.
export const NumoraqIcon: React.FC<IconProps> = ({ 
  size = 32, 
  className = '',
  onClick 
}) => {
  return (
    <div 
      className={`
        inline-flex items-center justify-center
        font-mono font-black text-accent
        border-2 border-accent bg-background
        relative overflow-hidden
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.6,
        textShadow: '0 0 4px rgba(var(--accent), 0.5)'
      }}
      onClick={onClick}
    >
      <span className="relative z-10">N</span>
      
      {/* Pixel corners */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-accent" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-accent" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-accent" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-accent" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-accent/10 animate-pulse opacity-30" />
    </div>
  );
};

// Specialized logo components for specific use cases
export const NavbarLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Logo variant="horizontal" size="md" onClick={onClick} />
);

export const FooterLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Logo variant="horizontal" size="sm" onClick={onClick} />
);

export const AdminLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Logo variant="compact" size="sm" onClick={onClick} />
);

export const HeroLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Logo variant="horizontal" size="lg" onClick={onClick} />
);

// Icon variants for different use cases
export const AppIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <NumoraqIcon size={size} />
);

export const FaviconIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <NumoraqIcon size={size} />
);

export const TabIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <NumoraqIcon size={size} />
);

// Simple text-only version for minimal spaces
export const LogoText: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <span className={`font-mono font-black uppercase tracking-widest text-accent ${sizeClasses[size]} ${className}`}>
      NUMORAQ
    </span>
  );
}; 