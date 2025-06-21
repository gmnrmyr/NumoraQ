
import React from 'react';
import { Skull, Bot, Zap } from 'lucide-react';

export const DashboardIcons = () => {
  return (
    <div className="flex items-center justify-center gap-4 py-[13px]">
      <div className="flex items-center gap-2">
        <div className="p-3 border-2 border-accent bg-background">
          <Skull className="text-accent" size={28} />
        </div>
        <div className="p-3 border-2 border-border bg-card">
          <Bot className="text-foreground" size={28} />
        </div>
        <div className="p-3 border-2 border-accent bg-background">
          <Zap className="text-accent" size={28} />
        </div>
      </div>
    </div>
  );
};
