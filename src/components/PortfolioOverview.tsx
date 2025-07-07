
import React from 'react';
import { LiquidAssetsCard } from './portfolio/LiquidAssetsCard';
import { IlliquidAssetsCard } from './portfolio/IlliquidAssetsCard';
import { PortfolioSummary } from './portfolio/PortfolioSummary';
import { NewUserHint } from './ui/onboarding-hint';

export const PortfolioOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <NewUserHint
        id="liquid-assets-intro"
        title="Start Building Your Portfolio"
        description="Add your crypto, stocks, and other liquid assets here. This is your main investment tracking hub!"
        position="bottom"
      >
        <LiquidAssetsCard />
      </NewUserHint>
      
      <NewUserHint
        id="illiquid-assets-intro"
        title="Track Your Real Estate & More"
        description="Add property, collectibles, and other illiquid assets. Everything counts toward your net worth!"
        position="bottom"
      >
        <IlliquidAssetsCard />
      </NewUserHint>
      
      <div className="lg:col-span-2">
        <PortfolioSummary />
      </div>
    </div>
  );
};
