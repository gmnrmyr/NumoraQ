
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { WalletService } from '@/services/walletService';

interface NFTCollectionInputProps {
  contractAddress: string;
  onContractAddressChange: (address: string) => void;
  collectionName: string;
  onCollectionNameChange: (name: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const NFTCollectionInput = ({
  contractAddress,
  onContractAddressChange,
  collectionName,
  onCollectionNameChange,
  quantity,
  onQuantityChange
}: NFTCollectionInputProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleLookupCollection = async () => {
    if (!contractAddress) return;
    
    setIsSearching(true);
    try {
      console.log('Looking up collection for address:', contractAddress);
      const addr = contractAddress.trim();
      const isHexAddress = /^0x[a-fA-F0-9]{40}$/.test(addr);

      if (isHexAddress) {
        const nftData = await WalletService.fetchNFTCollectionValue(addr, 1);
        const resolvedName = nftData.collectionName || 'Unknown Collection';
        onCollectionNameChange(resolvedName);
      } else {
        // Optional: Future enhancement to search by slug/name
        onCollectionNameChange(collectionName || 'Unknown Collection');
      }
    } catch (error) {
      console.error('Error looking up collection:', error);
      onCollectionNameChange('Unknown Collection');
    }
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-mono text-xs uppercase">Collection Name or Contract Address</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Bored Ape Yacht Club or 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
            value={contractAddress}
            onChange={(e) => onContractAddressChange(e.target.value)}
            className="font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLookupCollection}
            disabled={!contractAddress || isSearching}
            className="px-3"
          >
            <Search size={14} />
          </Button>
        </div>
      </div>
      
      {collectionName && (
        <div>
          <Label className="font-mono text-xs uppercase">Collection Name</Label>
          <Input
            value={collectionName}
            onChange={(e) => onCollectionNameChange(e.target.value)}
            className="font-mono text-sm"
            placeholder="Collection Name"
          />
        </div>
      )}
      
      <div>
        <Label className="font-mono text-xs uppercase">Quantity</Label>
        <Input
          type="number"
          min="1"
          value={quantity || ''}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          placeholder="1"
          className="font-mono"
        />
      </div>
    </div>
  );
};
