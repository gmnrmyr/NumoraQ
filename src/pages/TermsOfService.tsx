import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold font-mono text-accent mb-2">TERMS OF SERVICE</h1>
          <p className="text-muted-foreground font-mono">Open Findash - Financial Dashboard Platform</p>
        </div>

        <div className="space-y-6 text-sm font-mono">
          <section>
            <h2 className="text-xl font-bold text-accent mb-3">1. ACCEPTANCE OF TERMS</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Open Findash ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">2. DESCRIPTION OF SERVICE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Open Findash is a financial dashboard platform designed to help users track assets, income, expenses, and financial projections.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">3. USER ACCOUNTS</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years of age to use the Service. You agree to provide accurate, current, and complete information when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">4. USER CONDUCT</h2>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
              <li>You agree not to use the Service for any unlawful purpose.</li>
              <li>You agree not to upload or transmit any content that is harmful, offensive, or violates the rights of others.</li>
              <li>You agree not to interfere with the operation of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">5. INTELLECTUAL PROPERTY</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content, features, and functionality are owned by Open Findash and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">6. DISCLAIMER OF WARRANTIES</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. OPEN FINDASH MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES, INCLUDING WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF RIGHTS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">7. LIMITATION OF LIABILITY</h2>
            <p className="text-muted-foreground leading-relaxed">
              IN NO EVENT SHALL OPEN FINDASH OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">8. GOVERNING LAW</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">9. CHANGES TO TERMS</h2>
            <p className="text-muted-foreground leading-relaxed">
              Open Findash reserves the right to modify these terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-accent mb-3">10. CONTACT INFORMATION</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at [Your Contact Email].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
