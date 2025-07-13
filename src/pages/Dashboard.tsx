import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { AdminPanel } from '@/components/AdminPanel';
import { useDashboardMode } from '@/contexts/DashboardModeContext';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SimpleDashboard } from '@/components/dashboard/SimpleDashboard';
import { AdvancedDashboard } from '@/components/AdvancedDashboard';
import { TrialExpirationGuard } from '@/components/TrialExpirationGuard';

const Dashboard = () => {
  const { user } = useAuth();
  const { isAdminMode, showAdminPanel, setShowAdminPanel } = useAdminMode();
  const { mode, setMode } = useDashboardMode();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show onboarding if requested
  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Panel */}
      {isAdminMode && showAdminPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border-2 border-accent rounded-lg w-full max-w-6xl h-[90vh] overflow-y-auto">
            <AdminPanel />
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-accent hover:text-accent/80 font-mono"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content with Trial Protection */}
      <TrialExpirationGuard>
        {mode === 'simple' ? (
          <SimpleDashboard />
        ) : (
          <AdvancedDashboard />
        )}
      </TrialExpirationGuard>
    </div>
  );
};

export default Dashboard;
