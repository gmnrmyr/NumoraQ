
import React from 'react';
import { Skull, Bot, Zap } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { UserTitleBadge } from './UserTitleBadge';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const { data } = useFinancialData();
  
  return (
    <div className="text-center space-y-6 py-8">
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
      
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground brutalist-heading">
          FINANCIAL COMMAND CENTER
        </h1>
        {data.userProfile.name && (
          <div className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap">
            <span className="text-accent">Welcome back, {data.userProfile.name}</span>
          </div>
        )}
        <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-wider px-4">
          COMPLETE OVERSIGHT // DATA DRIVEN DECISIONS
        </p>
      </div>
      
      <div className="flex justify-center items-center gap-4">
        <div className="w-8 h-1 bg-accent"></div>
        <div className="w-4 h-4 border-2 border-accent"></div>
        <div className="w-8 h-1 bg-accent"></div>
      </div>
    </div>
  );
};
