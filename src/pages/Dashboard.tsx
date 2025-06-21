
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { ProjectionCard } from '@/components/dashboard/ProjectionCard';
import { ExchangeRatesBanner } from '@/components/dashboard/ExchangeRatesBanner';
import { PremiumStatusIndicator } from '@/components/dashboard/PremiumStatusIndicator';
import { DonationInterface } from '@/components/dashboard/DonationInterface';
import { BlackHoleAnimation } from '@/components/animations/BlackHoleAnimation';
import { useUserTitle } from '@/hooks/useUserTitle';

export default function Dashboard() {
  const { userTitle } = useUserTitle();
  const isChampionOrHigher = userTitle && ['CHAMPION', 'LEGEND', 'TITAN', 'OVERLORD'].includes(userTitle.title);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Black hole animation for Champion+ users */}
      <BlackHoleAnimation isVisible={!!isChampionOrHigher} />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <DashboardHeader />
          <ExchangeRatesBanner />
          <PremiumStatusIndicator />
          <MetricsOverview />
          <ProjectionCard />
          <DonationInterface />
        </div>
      </div>
    </div>
  );
}
