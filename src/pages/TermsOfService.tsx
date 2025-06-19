import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono pt-20 sm:pt-32 pb-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-2 border-border brutalist-card">
          <CardHeader>
            <CardTitle className="text-3xl font-mono font-bold text-accent uppercase">
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground font-mono">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 font-mono text-sm">
            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using OPEN FINDASH ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                OPEN FINDASH is a financial dashboard application that helps users track their assets, income, expenses, and financial projections. The service is provided "as is" and we make no warranties regarding its accuracy or reliability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>You agree not to use the service for any unlawful purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, trademarks, and data on OPEN FINDASH are owned by us or our licensors and are protected by copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                OPEN FINDASH is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">6. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by the laws of the jurisdiction in which OPEN FINDASH operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                OPEN FINDASH reserves the right to modify or replace these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at support@openfindash.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
