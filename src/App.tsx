import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DonationPage from "./pages/DonationPage";
import UpcomingFeatures from "./pages/UpcomingFeatures";
import TestInstances from "@/pages/TestInstances";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Apply monochrome theme by default on app initialization
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const root = document.documentElement;
    
    // If no theme is saved, apply monochrome as default
    if (!savedTheme) {
      root.classList.add('theme-monochrome');
      localStorage.setItem('selectedTheme', 'monochrome');
    } else {
      // Apply saved theme
      root.classList.remove('theme-neon', 'theme-monochrome', 'theme-dual-tone', 'theme-high-contrast', 'theme-cyberpunk', 'theme-matrix', 'theme-gold');
      if (savedTheme !== 'default') {
        root.classList.add(`theme-${savedTheme}`);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FinancialDataProvider>
          <TranslationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/donation" element={<DonationPage />} />
                  <Route path="/upcoming-features" element={<UpcomingFeatures />} />
                  <Route path="/test-instances" element={<TestInstances />} />
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </TranslationProvider>
        </FinancialDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
