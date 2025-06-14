
import React from 'react';
import { LiquidAssetsCard } from './portfolio/LiquidAssetsCard';
import { IlliquidAssetsCard } from './portfolio/IlliquidAssetsCard';
import { PortfolioSummary } from './portfolio/PortfolioSummary';

export const PortfolioOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LiquidAssetsCard />
      <IlliquidAssetsCard />
      <PortfolioSummary />
    </div>
  );
};
