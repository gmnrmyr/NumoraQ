
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssetTypeSelectorProps {
  value: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet';
  onChange: (value: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet') => void;
}

export const AssetTypeSelector = ({ value, onChange }: AssetTypeSelectorProps) => {
  return (
    <div>
      <Label className="font-mono text-xs uppercase">Asset Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-input border-2 border-border font-mono">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual Entry</SelectItem>
          <SelectItem value="crypto">Crypto (Auto-Price)</SelectItem>
          <SelectItem value="stock">Stocks (Live Price)</SelectItem>
          <SelectItem value="reit">REITs/FIIs (Real Estate)</SelectItem>
          <SelectItem value="metal">Precious Metals</SelectItem>
          <SelectItem value="wallet">EVM Wallet Tracker</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
