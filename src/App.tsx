
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
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
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
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
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
