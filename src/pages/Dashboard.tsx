
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { DataManagementSection } from "@/components/DataManagementSection";
import { UserProfileSection } from "@/components/UserProfileSection";
import { UserAvatarSection } from "@/components/dashboard/UserAvatarSection";
import { DevMenu } from "@/components/DevMenu";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExchangeRatesBanner } from "@/components/dashboard/ExchangeRatesBanner";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ProjectionCard } from "@/components/dashboard/ProjectionCard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <UserProfileSection />
              </div>
              <div>
                <UserAvatarSection />
              </div>
            </div>
            <DataManagementSection />
            <ExchangeRatesBanner />
            <MetricsOverview />
            <ProjectionCard />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div>
                <TabsContent value="portfolio" className="space-y-6">
                  <PortfolioOverview />
                </TabsContent>

                <TabsContent value="income" className="space-y-6">
                  <IncomeTracking />
                </TabsContent>

                <TabsContent value="expenses" className="space-y-6">
                  <ExpenseTrackingEditable />
                </TabsContent>

                <TabsContent value="assets" className="space-y-6">
                  <AssetManagementEditable />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                  <TaskManagementEditable />
                </TabsContent>

                <TabsContent value="debt" className="space-y-6">
                  <DebtTrackingEditable />
                </TabsContent>
              </div>
            </Tabs>

            <ProjectionChart />
          </div>
          
          <DevMenu />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
