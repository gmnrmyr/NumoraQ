import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4 brutalist-button"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold font-mono text-accent mb-2">PRIVACY POLICY</h1>
          <p className="text-muted-foreground font-mono">Open Findash - Financial Dashboard Platform</p>
        </div>

        <div className="space-y-6 text-sm font-mono">
          <section>
            <h2 className="text-xl font-bold text-accent mb-3">1. INFORMATION WE COLLECT</h2>
            <p className="text-muted-foreground leading-relaxed">
              Open Findash collects information you provide directly to us, such as when you create an account, update your profile, or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">2. HOW WE USE YOUR INFORMATION</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to operate, maintain, and improve our Services. We also use your information to communicate with you, provide support, and personalize your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">3. DATA SECURITY</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">4. SHARING YOUR INFORMATION</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not share your personal information with third parties except as necessary to provide our Services or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">5. CHANGES TO THIS POLICY</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">6. CONTACT US</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@openfindash.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
