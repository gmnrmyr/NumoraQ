
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { UserProfileSection } from '@/components/UserProfileSection';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { IncomeTracking } from '@/components/IncomeTracking';
import { ExpenseTracking } from '@/components/ExpenseTracking';
import { AssetManagement } from '@/components/AssetManagement';
import { TaskManagement } from '@/components/TaskManagement';
import { DebtTracking } from '@/components/DebtTracking';
import { PWASetup } from '@/components/PWASetup';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { user } = useAuth();
  const { data } = useFinancialData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleTabChange = (tab: string) => {
    console.log('Dashboard tab change:', tab);
    setActiveTab(tab);
    
    // Ensure smooth scrolling to the section
    setTimeout(() => {
      const element = document.querySelector(`[data-section="${tab}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Set page metadata
  useEffect(() => {
    document.title = 'Dashboard - OPEN FINDASH | Financial Portfolio Tracker';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage your complete financial portfolio: assets, income, expenses, tasks, and debt tracking all in one place.');
    }
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <PortfolioOverview />;
      case 'income':
        return <IncomeTracking />;
      case 'expenses':
        return <ExpenseTracking />;
      case 'assets':
        return <AssetManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'debt':
        return <DebtTracking />;
      default:
        return <PortfolioOverview />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="pt-20 sm:pt-32 pb-8">
        <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
          <DashboardHeader />
          
          {/* User Profile Section */}
          <div data-section="profile">
            <UserProfileSection />
          </div>
          
          {/* Main Content Area */}
          <div data-section={activeTab}>
            {renderTabContent()}
          </div>
          
          <PWASetup />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
