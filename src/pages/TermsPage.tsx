import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const TermsPage = () => {
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
                TERMS OF SERVICE
              </CardTitle>
              <p className="text-center text-muted-foreground font-mono">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 font-mono">
              
              <section>
                <h2 className="text-xl font-bold text-accent mb-3">1. ACCEPTANCE OF TERMS</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  By accessing and using Numoraq ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Contact Information:</strong> numoraq@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">2. SERVICE DESCRIPTION</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Numoraq is a premium financial dashboard platform that provides tools for portfolio tracking, financial planning, and wealth management. Our service includes:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Portfolio tracking and analytics</li>
                  <li>Income and expense management</li>
                  <li>Financial projections and insights</li>
                  <li>Premium features and advanced analytics</li>
                  <li>Cloud synchronization and data backup</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">3. USER ACCOUNTS</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Account Creation</h3>
                <ul className="text-sm text-muted-foreground mb-3 list-disc list-inside space-y-1">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 16 years old to create an account</li>
                  <li>One account per person is allowed</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Account Responsibility</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>You are responsible for all activities under your account</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>You must keep your login credentials secure and confidential</li>
                  <li>We reserve the right to suspend accounts that violate these terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">4. SUBSCRIPTION & BILLING</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Trial Period</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  New users receive an extended trial period during our beta phase. This trial includes access to premium features with advertisements.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">Premium Subscriptions</h3>
                <ul className="text-sm text-muted-foreground mb-3 list-disc list-inside space-y-1">
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable unless specified otherwise</li>
                  <li>You may cancel your subscription at any time</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Payment Processing</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Payments are processed by third-party providers (Stripe, PayPal)</li>
                  <li>You authorize us to charge your chosen payment method</li>
                  <li>Failed payments may result in service suspension</li>
                  <li>All prices are in USD unless otherwise specified</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">5. ACCEPTABLE USE</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Permitted Use</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You may use our service for lawful personal or business financial management purposes in accordance with these terms.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">Prohibited Activities</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Using the service for illegal activities or money laundering</li>
                  <li>Attempting to reverse engineer or hack our systems</li>
                  <li>Sharing account credentials with others</li>
                  <li>Using automated tools to access our service (bots, scrapers)</li>
                  <li>Interfering with the service's operation or other users</li>
                  <li>Uploading malicious code or content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">6. DATA & PRIVACY</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Your privacy is important to us. Our data practices are governed by our Privacy Policy, which is incorporated by reference into these terms.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>We use a local-first approach for data storage</li>
                  <li>Cloud synchronization is optional and encrypted</li>
                  <li>We do not sell your personal data to third parties</li>
                  <li>You retain ownership of your financial data</li>
                  <li>You can export or delete your data at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">7. INTELLECTUAL PROPERTY</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Our Rights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All content, features, and functionality of the Service are owned by Numoraq and protected by intellectual property laws.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">Your Rights</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>You retain ownership of your financial data and content</li>
                  <li>You grant us license to process your data to provide the service</li>
                  <li>You may not reproduce, distribute, or create derivative works</li>
                  <li>You may not use our trademarks without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">8. SERVICE AVAILABILITY</h2>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Maintenance windows may cause temporary unavailability</li>
                  <li>We reserve the right to modify or discontinue features</li>
                  <li>Critical updates may be applied without prior notice</li>
                  <li>We provide no warranty regarding third-party data sources</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">9. LIMITATION OF LIABILITY</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>IMPORTANT:</strong> This section limits our liability for damages.
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>The service is provided "as is" without warranties</li>
                  <li>We are not liable for investment decisions based on our data</li>
                  <li>Our liability is limited to the amount you paid for the service</li>
                  <li>We are not responsible for data loss due to user error</li>
                  <li>We recommend maintaining your own data backups</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">10. FINANCIAL DISCLAIMERS</h2>
                <div className="p-3 bg-orange-500/10 border border-orange-500 rounded mb-3">
                  <p className="text-sm text-orange-600 font-semibold">
                    <strong>IMPORTANT FINANCIAL DISCLAIMER</strong>
                  </p>
                </div>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Numoraq is not a financial advisor or investment service</li>
                  <li>Our tools are for informational and organizational purposes only</li>
                  <li>We do not provide investment, tax, or legal advice</li>
                  <li>All financial decisions are your responsibility</li>
                  <li>Consult qualified professionals before making investment decisions</li>
                  <li>Past performance does not guarantee future results</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">11. TERMINATION</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">By You</h3>
                <ul className="text-sm text-muted-foreground mb-3 list-disc list-inside space-y-1">
                  <li>You may cancel your account at any time</li>
                  <li>Cancellation is effective at the end of your billing period</li>
                  <li>You can export your data before termination</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">By Us</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>We may suspend or terminate accounts for terms violations</li>
                  <li>We may discontinue the service with 30 days notice</li>
                  <li>We may terminate immediately for serious violations</li>
                  <li>Upon termination, your data will be retained for 30 days for recovery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">12. GOVERNING LAW</h2>
                <p className="text-sm text-muted-foreground">
                  These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">13. CHANGES TO TERMS</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  We may update these terms from time to time. We will notify users of material changes:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>By email to your registered address</li>
                  <li>Through prominent notice in the application</li>
                  <li>By updating the "Last updated" date on this page</li>
                  <li>Continued use after changes constitutes acceptance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-accent mb-3">14. CONTACT INFORMATION</h2>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-3 p-3 bg-muted border border-border rounded">
                  <p className="text-sm"><strong>Email:</strong> numoraq@gmail.com</p>
                  <p className="text-sm"><strong>Website:</strong> numoraq.online</p>
                  <p className="text-sm"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </section>

              <section className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground italic">
                  By using Numoraq, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
              </section>

            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage; 