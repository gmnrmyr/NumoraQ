
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="brutalist-button"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-2xl font-bold uppercase">Privacy Policy</h1>
        </div>

        <Card className="brutalist-card">
          <CardHeader>
            <CardTitle>FinDash Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <section>
              <h3 className="font-bold mb-2">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">2. How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">3. Information Sharing</h3>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">4. Data Storage</h3>
              <p>Your financial data is stored locally in your browser and optionally synced to secure cloud storage with encryption.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">5. Cookies</h3>
              <p>We use cookies and similar technologies to enhance your experience, analyze usage, and customize content.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">6. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">7. Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">8. Changes to This Policy</h3>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </section>

            <div className="text-xs text-muted-foreground border-t border-border pt-4 mt-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
