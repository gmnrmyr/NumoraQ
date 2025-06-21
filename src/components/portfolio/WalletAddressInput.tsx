
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WalletAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onValidate?: (address: string) => Promise<boolean>;
}

export const WalletAddressInput = ({ value, onChange, onValidate }: WalletAddressInputProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateAddress = async (address: string) => {
    if (!address || address.length < 40) {
      setIsValid(false);
      return;
    }

    // Basic EVM address validation
    const isEVMAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!isEVMAddress) {
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    try {
      if (onValidate) {
        const valid = await onValidate(address);
        setIsValid(valid);
      } else {
        setIsValid(true);
      }
    } catch (error) {
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    onChange(newAddress);
    setIsValid(null);
    
    if (newAddress) {
      const debounceTimeout = setTimeout(() => {
        validateAddress(newAddress);
      }, 500);
      
      return () => clearTimeout(debounceTimeout);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-mono text-xs uppercase flex items-center gap-2">
        <Wallet size={12} />
        EVM Wallet Address
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder="0x1234...abcd"
          className="bg-input border-2 border-border font-mono text-xs"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValidating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          )}
          {!isValidating && isValid === true && (
            <Check size={16} className="text-green-500" />
          )}
          {!isValidating && isValid === false && value.length > 0 && (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>
      </div>
      {isValid === false && value.length > 0 && (
        <div className="text-xs text-red-500 font-mono">
          Invalid EVM wallet address
        </div>
      )}
      {isValid === true && (
        <Badge variant="outline" className="text-xs font-mono">
          <Check size={10} className="mr-1" />
          Valid EVM Address
        </Badge>
      )}
    </div>
  );
};
