
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FinancialDataProvider } from "./contexts/FinancialDataContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import UpcomingFeatures from "./pages/UpcomingFeatures";
import DonationPage from "./pages/DonationPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SupportPage from "./pages/SupportPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TranslationProvider>
          <AuthProvider>
            <FinancialDataProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upcoming-features" element={<UpcomingFeatures />} />
                  <Route path="/donation" element={<DonationPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/support" element={<SupportPage />} />
                </Routes>
              </BrowserRouter>
            </FinancialDataProvider>
          </AuthProvider>
        </TranslationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
