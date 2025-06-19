
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, Coins, Wallet } from 'lucide-react';
import { BitcoinTracker } from './wallet/BitcoinTracker';
import { EVMTracker } from './wallet/EVMTracker';
import { SolanaTracker } from './wallet/SolanaTracker';

export const WalletTracker = () => {
  const [activeTab, setActiveTab] = useState('bitcoin');

  return (
    <Card className="bg-card border-2 border-accent brutalist-card">
      <CardHeader className="bg-accent/10 border-b-2 border-accent">
        <CardTitle className="font-mono uppercase text-accent flex items-center gap-2">
          <Wallet size={20} />
          Blockchain Wallet Tracker
          <Badge variant="outline" className="ml-auto font-mono text-xs">
            Real-time
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Track your crypto wallets across multiple blockchains
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="bitcoin" className="flex items-center gap-2">
              <Bitcoin size={16} />
              Bitcoin
            </TabsTrigger>
            <TabsTrigger value="evm" className="flex items-center gap-2">
              <Coins size={16} />
              EVM Chains
            </TabsTrigger>
            <TabsTrigger value="solana" className="flex items-center gap-2">
              <Coins size={16} />
              Solana
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bitcoin" className="space-y-4">
            <BitcoinTracker />
          </TabsContent>

          <TabsContent value="evm" className="space-y-4">
            <EVMTracker />
          </TabsContent>

          <TabsContent value="solana" className="space-y-4">
            <SolanaTracker />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
