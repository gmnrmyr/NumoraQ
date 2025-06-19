import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ProjectionCard } from "@/components/dashboard/ProjectionCard";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { DataManagementSection } from "@/components/dashboard/DataManagementSection";
import { ExchangeRatesBanner } from "@/components/dashboard/ExchangeRatesBanner";
import { AIAdvisor } from "@/components/ai/AIAdvisor";
import { DevMenu } from "@/components/DevMenu";
import { DegenModeActivation } from "@/components/DegenModeActivation";

export const Dashboard = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6 sm:space-y-8">
        <DashboardHeader />
        
        {/* Degen Mode Activation */}
        <div className="flex justify-center">
          <DegenModeActivation />
        </div>
        
        {/* AI Advisor */}
        <AIAdvisor />
        
        {/* Exchange Rates Banner */}
        <ExchangeRatesBanner />

        {/* Main Dashboard Content */}
        <div className="grid gap-4 sm:gap-6">
          <MetricsOverview />
          <ProjectionCard />
          
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <AssetManagementEditable />
            <ExpenseTrackingEditable />
          </div>
          
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <TaskManagementEditable />
            <DebtTrackingEditable />
          </div>
          
          <DataManagementSection />
        </div>
      </div>
      
      <DevMenu />
      <Footer />
    </div>
  );
};
