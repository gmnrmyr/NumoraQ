
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { ProjectionCard } from '@/components/dashboard/ProjectionCard';
import { ExchangeRatesBanner } from '@/components/dashboard/ExchangeRatesBanner';
import { PremiumStatusIndicator } from '@/components/dashboard/PremiumStatusIndicator';
import { DonationInterface } from '@/components/dashboard/DonationInterface';
import { BlackHoleAnimation } from '@/components/animations/BlackHoleAnimation';
import { useUserTitle } from '@/hooks/useUserTitle';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Dashboard() {
  const { userTitle } = useUserTitle();
  const isChampionOrHigher = userTitle && ['CHAMPION', 'LEGEND', 'TITAN', 'OVERLORD'].includes(userTitle.title);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

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
          
          {/* Donation Interface Trigger */}
          <div className="flex justify-center">
            <Button 
              onClick={() => setIsDonationOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart size={16} />
              Support the Project
            </Button>
          </div>
          
          <DonationInterface 
            isOpen={isDonationOpen} 
            onClose={() => setIsDonationOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
}
