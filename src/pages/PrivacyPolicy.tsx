import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-2 border-border brutalist-card">
          <CardHeader>
            <CardTitle className="text-3xl font-mono font-bold text-accent uppercase">
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground font-mono">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 font-mono text-sm">
            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                OPEN FINDASH collects information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and maintain OPEN FINDASH services</li>
                <li>To process transactions and send related information</li>
                <li>To send technical notices and support messages</li>
                <li>To respond to your comments and questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement reasonable security measures to protect your information from unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide you with our services and as otherwise necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">5. Sharing Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not share your personal information with third parties except as described in this policy or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">6. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and other tracking technologies to improve your experience and analyze how our services are used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-accent mb-3 uppercase">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy, please contact us.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
