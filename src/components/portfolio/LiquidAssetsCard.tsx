
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconSelector } from './IconSelector';
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

export const LiquidAssetsCard = () => {
  const { data, updateLiquidAssets } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [showInactive, setShowInactive] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    icon: 'Wallet',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      value: 0,
      icon: 'Wallet',
      isActive: true
    });
    setEditingAsset(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an asset name.",
        variant: "destructive"
      });
      return;
    }

    let updatedAssets;
    if (editingAsset) {
      updatedAssets = data.liquidAssets.map(asset => 
        asset.id === editingAsset.id 
          ? { ...asset, ...formData }
          : asset
      );
    } else {
      const newAsset = {
        id: Date.now().toString(),
        ...formData
      };
      updatedAssets = [...data.liquidAssets, newAsset];
    }

    updateLiquidAssets(updatedAssets);
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingAsset ? "Asset Updated" : "Asset Added",
      description: `${formData.name} has been ${editingAsset ? 'updated' : 'added'} successfully.`
    });
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      value: asset.value,
      icon: asset.icon,
      isActive: asset.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (assetId: string) => {
    const updatedAssets = data.liquidAssets.filter(asset => asset.id !== assetId);
    updateLiquidAssets(updatedAssets);
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed successfully."
    });
  };

  const handleToggleActive = (assetId: string) => {
    const updatedAssets = data.liquidAssets.map(asset => 
      asset.id === assetId 
        ? { ...asset, isActive: !asset.isActive }
        : asset
    );
    updateLiquidAssets(updatedAssets);
  };

  const activeAssets = data.liquidAssets.filter(asset => asset.isActive);
  const inactiveAssets = data.liquidAssets.filter(asset => !asset.isActive);
  const displayAssets = showInactive ? data.liquidAssets : activeAssets;
  const totalValue = activeAssets.reduce((sum, asset) => sum + asset.value, 0);
  const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';

  return (
    <Card className="brutalist-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-mono uppercase text-accent truncate">
              LIQUID ASSETS
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs whitespace-nowrap">
              {currency} {totalValue.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
              className="brutalist-button text-xs"
            >
              {showInactive ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden sm:inline ml-1">
                {showInactive ? 'Hide Inactive' : 'Show All'}
              </span>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="brutalist-button text-xs">
                  <Plus size={14} className="mr-1" />
                  <span className="hidden sm:inline">Add Asset</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-2 border-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase text-accent">
                    {editingAsset ? 'Edit Asset' : 'Add Liquid Asset'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="font-mono text-xs uppercase">Asset Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-input border-2 border-border font-mono"
                      placeholder="e.g., Cash, Savings Account"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value" className="font-mono text-xs uppercase">Value ({currency})</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                      className="bg-input border-2 border-border font-mono"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="font-mono text-xs uppercase">Icon</Label>
                    <IconSelector
                      selectedIcon={formData.icon}
                      onIconSelect={(icon) => setFormData(prev => ({ ...prev, icon }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive" className="font-mono text-xs uppercase">Active</Label>
                  </div>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full brutalist-button"
                  >
                    {editingAsset ? 'Update Asset' : 'Add Asset'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAssets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-mono text-sm">
            No {showInactive ? '' : 'active '}liquid assets found.
            <br />
            <span className="text-xs">Add your first asset to get started!</span>
          </div>
        ) : (
          displayAssets.map((asset: any) => (
            <div 
              key={asset.id} 
              className={`flex items-center justify-between p-3 bg-muted border-2 border-border ${
                !asset.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-accent text-lg">
                  {asset.icon === 'TrendingUp' && <TrendingUp size={20} />}
                  {asset.icon === 'Wallet' && '💰'}
                  {asset.icon !== 'TrendingUp' && asset.icon !== 'Wallet' && '💰'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold text-sm truncate" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {currency} {asset.value.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(asset.id)}
                  className="brutalist-button p-1 h-8 w-8"
                  title={asset.isActive ? 'Deactivate' : 'Activate'}
                >
                  {asset.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(asset)}
                  className="brutalist-button p-1 h-8 w-8"
                  title="Edit"
                >
                  <Edit size={12} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(asset.id)}
                  className="brutalist-button p-1 h-8 w-8 hover:bg-red-50 hover:border-red-200"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))
        )}
        
        {inactiveAssets.length > 0 && !showInactive && (
          <div className="text-center text-xs text-muted-foreground font-mono pt-2">
            {inactiveAssets.length} inactive asset(s) hidden
          </div>
        )}
      </CardContent>
    </Card>
  );
};
