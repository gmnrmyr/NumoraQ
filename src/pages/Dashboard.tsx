
import React, { useState, useEffect } from 'react';
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExchangeRatesBanner } from "@/components/dashboard/ExchangeRatesBanner";
import { UnsavedChangesIndicator } from "@/components/UnsavedChangesIndicator";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { AdminControlPanel } from "@/components/AdminControlPanel";
import { useAdminMode } from '@/hooks/useAdminMode';

export default function Dashboard() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdminMode } = useAdminMode();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <ExchangeRatesBanner />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <MetricsOverview />
        <PortfolioOverview />
      </main>

      <UnsavedChangesIndicator />
      <ThemeCustomizer />
      
      <AdminControlPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
}
