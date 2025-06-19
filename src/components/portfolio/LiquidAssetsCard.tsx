import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { IconSelector } from './IconSelector';
import { iconMap, groupedIcons } from './IconData';
import { DevelopmentTooltip } from './DevelopmentTooltip';
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

export const LiquidAssetsCard = () => {
  const { data, updateLiquidAsset, addLiquidAsset, removeLiquidAsset } = useFinancialData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [showInactive, setShowInactive] = useState(true); // Default to ON
  
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

    if (editingAsset) {
      updateLiquidAsset(editingAsset.id, formData);
    } else {
      addLiquidAsset({
        ...formData,
        color: 'text-foreground'
      });
    }

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
    removeLiquidAsset(assetId);
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed successfully."
    });
  };

  const handleToggleActive = (assetId: string) => {
    const asset = data.liquidAssets.find(a => a.id === assetId);
    if (asset) {
      updateLiquidAsset(assetId, { isActive: !asset.isActive });
    }
  };

  const activeAssets = data.liquidAssets.filter(asset => asset.isActive);
  const inactiveAssets = data.liquidAssets.filter(asset => !asset.isActive);
  const displayAssets = showInactive ? data.liquidAssets : activeAssets;
  const totalValue = activeAssets.reduce((sum, asset) => sum + asset.value, 0);
  const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';

  return (
    <div className="space-y-4">
      <DevelopmentTooltip />
      
      <Card className="brutalist-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CardTitle className="text-sm sm:text-base font-mono uppercase text-accent truncate">
                LIQUID ASSETS
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs whitespace-nowrap flex-shrink-0">
                {currency} {totalValue.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
                        value={formData.icon}
                        onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                        placeholder="Choose an icon"
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
            displayAssets.map((asset: any) => {
              // Get the proper icon component from the stored icon value, same as IlliquidAssetsCard
              const Icon = iconMap[asset.icon] || iconMap['Wallet'];
              
              return (
                <div 
                  key={asset.id} 
                  className={`flex items-center justify-between p-3 bg-muted border-2 border-border ${
                    !asset.isActive ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {/* Icon selector for editing, same pattern as IlliquidAssetsCard */}
                      <Select value={asset.icon} onValueChange={(value) => updateLiquidAsset(asset.id, { icon: value })}>
                        <SelectTrigger className="w-12 h-8 p-1 border-border bg-input">
                          <Icon size={16} className={asset.color || 'text-foreground'} />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 bg-card border-border border-2">
                          {Object.entries(groupedIcons).map(([category, icons]) => (
                            <div key={category}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted font-mono uppercase">
                                {category}
                              </div>
                              {icons.map((iconOption) => {
                                const IconComponent = iconMap[iconOption.value];
                                return (
                                  <SelectItem key={iconOption.value} value={iconOption.value} className="font-mono">
                                    <div className="flex items-center gap-2">
                                      <IconComponent size={16} />
                                      <span>{iconOption.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
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
              );
            })
          )}
          
          {inactiveAssets.length > 0 && !showInactive && (
            <div className="text-center text-xs text-muted-foreground font-mono pt-2">
              {inactiveAssets.length} inactive asset(s) hidden
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
