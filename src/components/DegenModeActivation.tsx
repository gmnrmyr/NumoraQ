
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Bitcoin, CreditCard, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const DegenModeActivation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  const handleCodeActivation = () => {
    if (activationCode === 'DEGEN2024') {
      toast({
        title: "Degen Mode Activated! 🚀",
        description: "Welcome to the dark side of finance!"
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid activation code or consider supporting the project.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentOption = (method: string) => {
    toast({
      title: "Payment Integration Coming Soon",
      description: `${method} payment will be available in the next update!`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="brutalist-button bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Zap size={16} className="mr-2" />
          Activate Degen Mode
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg bg-card border-2 border-border">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Zap size={20} className="text-purple-400" />
            Activate Degen Mode
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="code" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="font-mono">Activation Code</TabsTrigger>
            <TabsTrigger value="payment" className="font-mono">Support & Pay</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground font-mono">
                Enter your degen activation code to unlock premium features:
              </div>
              <Input
                placeholder="Enter activation code..."
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="bg-input border-2 border-border font-mono"
              />
              <Button onClick={handleCodeActivation} className="w-full brutalist-button">
                <Code size={16} className="mr-2" />
                Activate
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground font-mono text-center">
                Support the project and remove ads forever!
              </div>
              
              <div className="grid gap-3">
                <Card className="brutalist-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bitcoin size={20} className="text-orange-500" />
                        <div>
                          <div className="font-mono font-bold text-sm">Crypto Payment</div>
                          <div className="text-xs text-muted-foreground">BTC, ETH, USDT</div>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">$25</Badge>
                    </div>
                    <Button 
                      onClick={() => handlePaymentOption('Crypto')}
                      className="w-full mt-3 brutalist-button"
                      size="sm"
                    >
                      Pay with Crypto
                    </Button>
                  </CardContent>
                </Card>

                <Card className="brutalist-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} className="text-blue-500" />
                        <div>
                          <div className="font-mono font-bold text-sm">PayPal</div>
                          <div className="text-xs text-muted-foreground">Secure & Easy</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">$25</Badge>
                    </div>
                    <Button 
                      onClick={() => handlePaymentOption('PayPal')}
                      className="w-full mt-3 brutalist-button"
                      size="sm"
                    >
                      Pay with PayPal
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-3 rounded text-center">
                💎 One-time payment • No ads • Premium themes • Priority support
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
