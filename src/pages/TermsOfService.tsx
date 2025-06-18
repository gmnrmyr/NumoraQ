
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
          <h1 className="text-2xl font-bold uppercase">Terms of Service</h1>
        </div>

        <Card className="brutalist-card">
          <CardHeader>
            <CardTitle>FinDash Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <section>
              <h3 className="font-bold mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and using FinDash, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">2. Use License</h3>
              <p>Permission is granted to temporarily use FinDash for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">3. Disclaimer</h3>
              <p>FinDash is provided for informational purposes only. We do not provide financial advice. All financial decisions should be made with proper consultation.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">4. Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">5. Service Availability</h3>
              <p>FinDash is provided "as is" without warranty of any kind. We do not guarantee uninterrupted service availability.</p>
            </section>

            <section>
              <h3 className="font-bold mb-2">6. Contact Information</h3>
              <p>For questions about these Terms of Service, please contact us through our platform.</p>
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

export default TermsOfService;
