
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface WalletFormProps {
  newAddress: string;
  setNewAddress: (address: string) => void;
  newLabel: string;
  setNewLabel: (label: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const WalletForm = ({
  newAddress,
  setNewAddress,
  newLabel,
  setNewLabel,
  onSubmit,
  isLoading
}: WalletFormProps) => {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardHeader>
        <CardTitle className="font-mono text-sm flex items-center gap-2">
          <Plus size={16} />
          Advanced EVM Wallet Tracker
        </CardTitle>
        <p className="text-xs text-muted-foreground font-mono">
          Fetches live token & DeFi values using DeBank API
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advanced-address">Wallet Address</Label>
            <Input
              id="advanced-address"
              placeholder="0x742d35Cc6638C0532925a3b8D186dE0824c821A4"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advanced-label">Wallet Label</Label>
            <Input
              id="advanced-label"
              placeholder="My DeFi Portfolio"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
        </div>
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Fetching Real Data...' : 'Add Advanced Wallet'}
        </Button>
      </CardContent>
    </Card>
  );
};
