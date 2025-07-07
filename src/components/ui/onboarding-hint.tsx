import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { X, Lightbulb, ChevronRight } from 'lucide-react';

interface OnboardingHintProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOnFirstVisit?: boolean;
}

export const OnboardingHint: React.FC<OnboardingHintProps> = ({
  id,
  title,
  description,
  children,
  position = 'bottom',
  showOnFirstVisit = true
}) => {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if hint has been dismissed before
    const dismissed = localStorage.getItem(`onboarding-hint-${id}`);
    return showOnFirstVisit && !dismissed;
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`onboarding-hint-${id}`, 'dismissed');
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} w-64`}>
          <Card className="bg-primary/5 border-2 border-primary/20 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Lightbulb size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-mono text-sm font-bold text-primary mb-1">
                    {title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    {description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="p-1 h-auto text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-xs font-mono"
                >
                  Got it <ChevronRight size={12} className="ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper component for showing hints only to new users
export const NewUserHint: React.FC<Omit<OnboardingHintProps, 'showOnFirstVisit'>> = (props) => {
  const isNewUser = () => {
    const userDataExists = localStorage.getItem('financial-data');
    if (!userDataExists) return true;
    
    try {
      const data = JSON.parse(userDataExists);
      // Consider user "new" if they have no assets, income, or expenses
      return !data.liquidAssets?.length && !data.expenses?.length && !data.passiveIncome?.length;
    } catch {
      return true;
    }
  };

  return (
    <OnboardingHint 
      {...props} 
      showOnFirstVisit={isNewUser()}
    />
  );
}; 