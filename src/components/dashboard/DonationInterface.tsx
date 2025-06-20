
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Wallet, CreditCard, Bitcoin, DollarSign, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface DonationInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationInterface = ({ isOpen, onClose }: DonationInterfaceProps) => {
  const { settings } = useProjectSettings();
  const [donorWallet, setDonorWallet] = useState('');
  const navigate = useNavigate();

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

  const handleViewFullPage = () => {
    onClose();
    navigate('/donation');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-mono text-xl">
            Support {settings.website_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <Clock className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-400 font-mono text-sm">
              ⏱️ Donations can take up to 2-5 days to reflect in your user title and ranking
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crypto">Crypto Donations</TabsTrigger>
              <TabsTrigger value="traditional">Traditional Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.project_wallet_evm && (
                  <Card className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 font-mono text-sm">
                        <Wallet size={16} />
                        Ethereum & EVM
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-2 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_evm}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_evm, 'EVM wallet address')}
                        className="w-full"
                        size="sm"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy EVM Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_btc && (
                  <Card className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 font-mono text-sm">
                        <Bitcoin size={16} />
                        Bitcoin
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-2 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_btc}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_btc, 'Bitcoin wallet address')}
                        className="w-full"
                        size="sm"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy BTC Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_solana && (
                  <Card className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 font-mono text-sm">
                        <Wallet size={16} />
                        Solana
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-2 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_solana}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_solana, 'Solana wallet address')}
                        className="w-full"
                        size="sm"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy SOL Address
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {settings.project_wallet_bch && (
                  <Card className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 font-mono text-sm">
                        <Bitcoin size={16} />
                        Bitcoin Cash
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted p-2 border border-border rounded font-mono text-xs break-all">
                        {settings.project_wallet_bch}
                      </div>
                      <Button 
                        onClick={() => copyToClipboard(settings.project_wallet_bch, 'Bitcoin Cash wallet address')}
                        className="w-full"
                        size="sm"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy BCH Address
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="traditional" className="space-y-4">
              {settings.project_paypal_email && (
                <Card className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-mono text-sm">
                      <CreditCard size={16} />
                      PayPal Donation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted p-2 border border-border rounded font-mono text-xs">
                      {settings.project_paypal_email}
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(settings.project_paypal_email, 'PayPal email')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Copy size={14} className="mr-2" />
                      Copy PayPal Email
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm">Track Your Donations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="donorWallet" className="font-mono text-xs">Your Donor Wallet Address</Label>
                <Input
                  id="donorWallet"
                  value={donorWallet}
                  onChange={(e) => setDonorWallet(e.target.value)}
                  placeholder="Enter your wallet address to track donations..."
                  className="bg-input border border-border font-mono text-xs"
                />
              </div>
              <Button onClick={handleSaveDonorWallet} className="w-full" size="sm">
                <DollarSign size={14} className="mr-2" />
                Save Donor Wallet
              </Button>
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-400 font-mono text-xs">
                  Save your wallet address to track your donations and unlock user titles based on your contribution level.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleViewFullPage} variant="outline" className="flex-1">
              <ExternalLink size={14} className="mr-2" />
              View Full Donation Page
            </Button>
            <Button onClick={onClose} variant="default" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
