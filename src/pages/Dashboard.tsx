import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { UserProfileSection } from "@/components/UserProfileSection";
import { DevMenu } from "@/components/DevMenu";
import { SecureAdminPanel } from "@/components/SecureAdminPanel";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExchangeRatesBanner } from "@/components/dashboard/ExchangeRatesBanner";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ProjectionCard } from "@/components/dashboard/ProjectionCard";
import { AIAdvisor } from "@/components/ai/AIAdvisor";
import { PWASetup } from "@/components/PWASetup";
import { AdSenseAd } from "@/components/AdSenseAd";
import { useSecureAdminAuth } from "@/hooks/useSecureAdminAuth";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdmin } = useSecureAdminAuth();

  // Admin panel keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        if (isAdmin) {
          setShowAdminPanel(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Handle external tab changes (from navbar)
  React.useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      console.log('Received tab change event:', event.detail);
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('dashboardTabChange', handleTabChange as EventListener);
    return () => window.removeEventListener('dashboardTabChange', handleTabChange as EventListener);
  }, []);

  const getSectionTitle = (tab: string) => {
    switch (tab) {
      case 'portfolio': return 'PORTFOLIO OVERVIEW';
      case 'income': return 'INCOME TRACKING';
      case 'expenses': return 'EXPENSE MANAGEMENT';
      case 'assets': return 'ASSET MANAGEMENT';
      case 'tasks': return 'TASK MANAGEMENT';
      case 'debt': return 'DEBT TRACKING';
      default: return 'DASHBOARD';
    }
  };

  return (
    <>
      {/* SEO Meta Tags for Dashboard */}
      <title>Dashboard - OPEN FINDASH | Financial Analysis & Crypto Tracking</title>
      <meta name="description" content="Complete financial dashboard for tracking your crypto portfolio, income, expenses, and net worth. Real-time data analysis for smart financial decisions." />
      <meta name="keywords" content="financial dashboard, crypto tracking, portfolio management, expense tracking, income analysis, net worth calculator" />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="pt-20 sm:pt-32 pb-4">
          <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
            <DashboardHeader />
            
            {/* Consolidated User Profile Section with all panels */}
            <UserProfileSection />
            
            <ExchangeRatesBanner />
            <MetricsOverview />
            <ProjectionCard />

            {/* Ad placement only after substantial content is loaded */}
            <AdSenseAd className="my-6" minContentRequired={true} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div>
                <TabsContent value="portfolio" className="space-y-6" data-section="portfolio">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('portfolio')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <PortfolioOverview />
                </TabsContent>

                <TabsContent value="income" className="space-y-6" data-section="income">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('income')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <IncomeTracking />
                  {/* Ad placement within content sections */}
                  <AdSenseAd className="my-4" minContentRequired={true} />
                </TabsContent>

                <TabsContent value="expenses" className="space-y-6" data-section="expenses">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('expenses')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <ExpenseTrackingEditable />
                </TabsContent>

                <TabsContent value="assets" className="space-y-6" data-section="assets">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('assets')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <AssetManagementEditable />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6" data-section="tasks">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('tasks')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <TaskManagementEditable />
                </TabsContent>

                <TabsContent value="debt" className="space-y-6" data-section="debt">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-mono text-accent uppercase tracking-wider">
                      {getSectionTitle('debt')}
                    </h2>
                    <div className="h-1 bg-accent w-24 mx-auto mt-2"></div>
                  </div>
                  <DebtTrackingEditable />
                </TabsContent>
              </div>
            </Tabs>

            <ProjectionChart />
            
            {/* Final ad placement after main content */}
            <AdSenseAd className="my-4" minContentRequired={true} />
          </div>
          
          <DevMenu />
          <AIAdvisor />
          <PWASetup />
          <SecureAdminPanel 
            isOpen={showAdminPanel} 
            onClose={() => setShowAdminPanel(false)} 
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
