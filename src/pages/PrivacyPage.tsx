import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="" onTabChange={() => {}} />
      
      {/* Back Button */}
      <div className="absolute top-20 left-4 z-10">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="brutalist-button flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="pt-20 sm:pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-2 border-accent brutalist-card">
            <CardHeader>
              <CardTitle className="text-3xl font-mono uppercase text-accent text-center">
                PRIVACY POLICY
              </CardTitle>
              <p className="text-center text-muted-foreground font-mono">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 font-mono">
              
              <section>
                <h2 className="text-xl font-bold text-accent mb-3">1. INTRODUCTION</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Numoraq ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial dashboard service.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Contact Information:</strong> numoraq@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">2. INFORMATION WE COLLECT</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                <ul className="text-sm text-muted-foreground mb-3 list-disc list-inside space-y-1">
                  <li>Email address and password (for account creation)</li>
                  <li>Display name and profile information (optional)</li>
                  <li>Payment information (processed by third-party providers)</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Financial Data</h3>
                <ul className="text-sm text-muted-foreground mb-3 list-disc list-inside space-y-1">
                  <li>Portfolio information you manually enter</li>
                  <li>Income and expense data you provide</li>
                  <li>Financial goals and projections you create</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Technical Information</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and feature interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">3. HOW WE USE YOUR INFORMATION</h2>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Service Provision:</strong> To provide and maintain our financial dashboard service</li>
                  <li><strong>Account Management:</strong> To create and manage your user account</li>
                  <li><strong>Communication:</strong> To send important updates, security alerts, and support messages</li>
                  <li><strong>Improvement:</strong> To analyze usage patterns and improve our service</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">4. DATA STORAGE & SECURITY</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Local-First Approach</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your financial data is primarily stored locally on your device. Cloud synchronization is optional and encrypted.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">Security Measures</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure authentication with industry-standard protocols</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited data retention policies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">5. INFORMATION SHARING</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>We do NOT sell your personal data.</strong> We may share information only in these limited circumstances:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Service Providers:</strong> Third-party services that help us operate (hosting, payment processing)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">6. YOUR PRIVACY RIGHTS</h2>
                <p className="text-sm text-muted-foreground mb-3">You have the right to:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Access:</strong> Request copies of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Withdraw Consent:</strong> Revoke consent for data processing</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  To exercise these rights, contact us at: <strong>numoraq@gmail.com</strong>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">7. COOKIES & TRACKING</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  We use minimal cookies and tracking technologies:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality and security</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Analytics:</strong> Basic usage analytics to improve our service (anonymized)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">8. THIRD-PARTY SERVICES</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  We integrate with third-party services that have their own privacy policies:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Supabase:</strong> Database and authentication services</li>
                  <li><strong>Google OAuth:</strong> Optional sign-in service</li>
                  <li><strong>Payment Processors:</strong> Stripe, PayPal (for premium subscriptions)</li>
                  <li><strong>Live Data Providers:</strong> Cryptocurrency and stock price feeds</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">9. INTERNATIONAL TRANSFERS</h2>
                <p className="text-sm text-muted-foreground">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">10. CHILDREN'S PRIVACY</h2>
                <p className="text-sm text-muted-foreground">
                  Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">11. POLICY UPDATES</h2>
                <p className="text-sm text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">12. CONTACT US</h2>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="mt-3 p-3 bg-muted border border-border rounded">
                  <p className="text-sm"><strong>Email:</strong> numoraq@gmail.com</p>
                  <p className="text-sm"><strong>Website:</strong> numoraq.online</p>
                  <p className="text-sm"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </section>

            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage; 