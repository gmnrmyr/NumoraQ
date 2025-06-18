
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  PieChart,
  BarChart3
} from "lucide-react";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { IncomeTracking } from "@/components/IncomeTracking";
import { ExpenseTrackingEditable } from "@/components/ExpenseTrackingEditable";
import { AssetManagementEditable } from "@/components/AssetManagementEditable";
import { TaskManagementEditable } from "@/components/TaskManagementEditable";
import { DebtTrackingEditable } from "@/components/DebtTrackingEditable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { DataManagementSection } from "@/components/DataManagementSection";
import { MobileNav } from "@/components/MobileNav";
import { UserProfileSection } from "@/components/UserProfileSection";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
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
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="pt-20 sm:pt-28 pb-4">
        <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
          <DashboardHeader />
          <UserProfileSection />
          <DataManagementSection />
          <ExchangeRatesBanner />
          <MetricsOverview />
          <ProjectionCard />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

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
  );
};

export default Dashboard;
