
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Wallet, CreditCard, Bitcoin, DollarSign } from 'lucide-react';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { toast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const DonationPage = () => {
  const { settings } = useProjectSettings();
  const [donorWallet, setDonorWallet] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleSaveDonorWallet = () => {
    if (donorWallet.trim()) {
      localStorage.setItem('donorWallet', donorWallet);
      toast({
        title: "Wallet Saved",
        description: "Your donor wallet has been saved locally",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-accent uppercase tracking-wider">
              Support {settings.website_name}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help us continue developing the best financial dashboard for crypto and traditional assets. 
              Your donations directly fund new features, hosting, and development.
            </p>
            <div className="bg-muted p-4 border-2 border-border rounded">
              <p className="text-sm font-mono text-yellow-400">
                ⚠️ Donations can take up to 2-5 days to reflect in your user title and ranking
              </p>
            </div>
          </div>

          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crypto">Crypto Donations</TabsTrigger>
              <TabsTrigger value="traditional">Traditional Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.project_wallet_evm && (
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono">
                        <Wallet size={20} />
                        Ethereum & EVM Chains
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-3 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_evm}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_evm, 'EVM wallet address')}
                        className="w-full brutalist-button"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy EVM Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_btc && (
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono">
                        <Bitcoin size={20} />
                        Bitcoin
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-3 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_btc}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_btc, 'Bitcoin wallet address')}
                        className="w-full brutalist-button"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy BTC Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_solana && (
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono">
                        <Wallet size={20} />
                        Solana
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-3 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_solana}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_solana, 'Solana wallet address')}
                        className="w-full brutalist-button"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy SOL Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_bch && (
                  <Card className="border-2 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono">
                        <Bitcoin size={20} />
                        Bitcoin Cash
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted p-3 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_bch}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_bch, 'Bitcoin Cash wallet address')}
                        className="w-full brutalist-button"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy BCH Address
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="traditional" className="space-y-6">
              {settings.project_paypal_email && (
                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-mono">
                      <CreditCard size={20} />
                      PayPal Donation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-3 border border-border rounded font-mono text-sm">
                      {settings.project_paypal_email}
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(settings.project_paypal_email, 'PayPal email')}
                      className="w-full brutalist-button bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy PayPal Email
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono">Track Your Donations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorWallet" className="font-mono">Your Donor Wallet Address</Label>
                <Input
                  id="donorWallet"
                  value={donorWallet}
                  onChange={(e) => setDonorWallet(e.target.value)}
                  placeholder="Enter your wallet address to track donations..."
                  className="bg-input border-2 border-border font-mono"
                />
              </div>
              <Button onClick={handleSaveDonorWallet} className="brutalist-button">
                <DollarSign size={16} className="mr-2" />
                Save Donor Wallet
              </Button>
              <div className="text-xs text-muted-foreground font-mono">
                Save your wallet address to track your donations and unlock user titles based on your contribution level.
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 border-2 border-border">
            <h3 className="font-mono font-bold text-lg mb-4">Donation Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <div className="text-yellow-400 font-bold">PATRON ($1000+)</div>
                <div className="text-muted-foreground">• All features + NFT airdrops</div>
                <div className="text-muted-foreground">• Special recognition</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold">SUPPORTER ($500+)</div>
                <div className="text-muted-foreground">• Premium themes + early access</div>
                <div className="text-muted-foreground">• Advanced features</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold">BACKER ($100+)</div>
                <div className="text-muted-foreground">• Advanced features unlocked</div>
                <div className="text-muted-foreground">• Priority support</div>
              </div>
              <div>
                <div className="text-green-400 font-bold">DONOR ($10+)</div>
                <div className="text-muted-foreground">• Supporter badge + thanks</div>
                <div className="text-muted-foreground">• Community recognition</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonationPage;
