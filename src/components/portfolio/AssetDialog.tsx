
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconSelector } from './IconSelector';
import { AssetTypeSelector } from './AssetTypeSelector';
import { AssetFormFields } from './AssetFormFields';

interface AssetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAsset: any;
  assetType: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet';
  setAssetType: (type: 'manual' | 'crypto' | 'stock' | 'reit' | 'metal' | 'wallet') => void;
  formData: any;
  setFormData: (data: any) => void;
  onStockSelection: (symbol: string, name: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  currency: string;
}

export const AssetDialog = ({
  isOpen,
  onOpenChange,
  editingAsset,
  assetType,
  setAssetType,
  formData,
  setFormData,
  onStockSelection,
  onSubmit,
  onReset,
  currency
}: AssetDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) onReset();
    }}>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase text-accent">
            {editingAsset ? 'Edit Asset' : 'Add Liquid Asset'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AssetTypeSelector 
            value={assetType} 
            onChange={setAssetType} 
          />
          
          <AssetFormFields
            assetType={assetType}
            formData={formData}
            setFormData={setFormData}
            onStockSelection={onStockSelection}
            currency={currency}
          />

          <div>
            <Label className="font-mono text-xs uppercase">Icon</Label>
            <IconSelector
              value={formData.icon}
              onChange={(icon) => setFormData((prev: any) => ({ ...prev, icon }))}
              placeholder="Choose an icon"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive" className="font-mono text-xs uppercase">Active</Label>
          </div>
          
          <Button 
            onClick={onSubmit} 
            className="w-full brutalist-button"
          >
            {editingAsset ? 'Update Asset' : 'Add Asset'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
