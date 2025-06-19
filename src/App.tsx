import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { PWASetup } from './PWASetup';
import { AuthProvider } from '@/contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PremiumPage from '@/pages/PremiumPage';
import BlogPage from '@/pages/BlogPage';
import PricingPage from '@/pages/PricingPage';
import DonatePage from '@/pages/DonatePage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import LegalNoticePage from '@/pages/LegalNoticePage';
import AccessibilityStatementPage from '@/pages/AccessibilityStatementPage';
import { DonationProvider } from '@/contexts/DonationContext';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TranslationProvider>
        <AuthProvider>
          <FinancialDataProvider>
            <DonationProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/coming-soon" element={<ComingSoonPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="/legal-notice" element={<LegalNoticePage />} />
                  <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
              <Toaster />
              <PWASetup />
            </DonationProvider>
          </FinancialDataProvider>
        </AuthProvider>
      </TranslationProvider>
    </div>
  );
}

export default App;
