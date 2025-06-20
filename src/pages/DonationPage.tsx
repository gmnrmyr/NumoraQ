
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check, ArrowLeft, Wallet } from 'lucide-react';
import { toast } from "sonner";

const DonationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useProjectSettings();
  const [copiedAddress, setCopiedAddress] = useState<string>('');

  const wallets = [
    {
      name: 'Ethereum / EVM',
      address: settings.donation_wallet_evm || '0x742d35Cc6634C0532925a3b8D1CF8B71',
      symbol: 'ETH'
    },
    {
      name: 'Solana',
      address: settings.donation_wallet_solana || 'SoL...',
      symbol: 'SOL'
    },
    {
      name: 'Bitcoin',
      address: settings.donation_wallet_btc || 'bc1...',
      symbol: 'BTC'
    },
    {
      name: 'Bitcoin Cash',
      address: settings.donation_wallet_bch || 'bitcoincash:...',
      symbol: 'BCH'
    }
  ];

  const copyToClipboard = async (address: string, name: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast.success(`${name} address copied!`);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="brutalist-button"
          >
            <ArrowLeft size={20} />
            BACK
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-accent brutalist-heading">
              SUPPORT THE PROJECT
            </h1>
            <p className="text-muted-foreground font-mono">
              Help us keep {settings.project_name} free and awesome
            </p>
          </div>
        </div>

        {/* Donation Info */}
        <Card className="brutalist-card border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-accent">
              <Wallet size={24} />
              CRYPTO DONATIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-background p-4 border-2 border-border space-y-2">
              <p className="text-accent font-bold">⚡ INSTANT IMPACT:</p>
              <ul className="text-sm space-y-1 font-mono">
                <li>• Your donation directly supports development</li>
                <li>• Helps keep the platform free for everyone</li>
                <li>• Enables new features and improvements</li>
                <li>• Shows up on leaderboard (if wallet linked)</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 border border-border">
              <p className="text-sm font-mono text-center">
                <strong>⏱️ PROCESSING TIME:</strong> Donations may take up to 2-5 days to reflect in your rank and title.
              </p>
            </div>

            {/* Wallet Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <Card key={wallet.name} className="brutalist-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {wallet.name}
                      <Badge variant="outline" className="text-xs">
                        {wallet.symbol}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-background p-3 border border-border font-mono text-xs break-all">
                      {wallet.address}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(wallet.address, wallet.name)}
                      className="w-full brutalist-button"
                      variant={copiedAddress === wallet.address ? "default" : "outline"}
                    >
                      {copiedAddress === wallet.address ? (
                        <>
                          <Check size={16} className="mr-2" />
                          COPIED!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          COPY ADDRESS
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* PayPal Option */}
            {settings.donation_paypal_email && (
              <Card className="brutalist-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    PayPal
                    <Badge variant="outline" className="text-xs">
                      USD
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-background p-3 border border-border font-mono text-xs">
                    {settings.donation_paypal_email}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(settings.donation_paypal_email, 'PayPal')}
                    className="w-full brutalist-button"
                    variant={copiedAddress === settings.donation_paypal_email ? "default" : "outline"}
                  >
                    {copiedAddress === settings.donation_paypal_email ? (
                      <>
                        <Check size={16} className="mr-2" />
                        COPIED!
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-2" />
                        COPY EMAIL
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* User Instructions */}
        {user && (
          <Card className="brutalist-card border-accent/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-accent mb-3">GET CREDIT FOR YOUR DONATION</h3>
              <div className="space-y-2 text-sm font-mono">
                <p>1. Make sure your wallet is linked in your profile</p>
                <p>2. Send your donation from that wallet</p>
                <p>3. Wait 2-5 days for processing</p>
                <p>4. Check your updated rank on the leaderboard!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-mono">
            Every donation helps us build better tools for the community
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="brutalist-button"
          >
            BACK TO DASHBOARD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
