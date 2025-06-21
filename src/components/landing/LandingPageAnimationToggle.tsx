
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface LandingPageAnimationToggleProps {
  isAnimationEnabled: boolean;
  onToggle: () => void;
}

export const LandingPageAnimationToggle: React.FC<LandingPageAnimationToggleProps> = ({
  isAnimationEnabled,
  onToggle
}) => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <Button 
        onClick={onToggle} 
        variant="outline" 
        size="sm" 
        className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative" 
        title={isAnimationEnabled ? 'Pause Animation' : 'Play Animation (Heavy GPU)'}
      >
        {isAnimationEnabled ? <Pause size={16} /> : <Play size={16} />}
        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isAnimationEnabled ? 'Pause Animation' : 'Play Anim (Heavy GPU)'}
        </div>
      </Button>
    </div>
  );
};
