
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AssetListItem } from './AssetListItem';
import { AssetDialog } from './AssetDialog';
import { DevelopmentTooltip } from './DevelopmentTooltip';
import { useLiquidAssetManagement } from './hooks/useLiquidAssetManagement';
import { useLivePriceUpdates } from './hooks/useLivePriceUpdates';

export const LiquidAssetsCard = () => {
  const {
    data,
    isDialogOpen,
    setIsDialogOpen,
    editingAsset,
    assetType,
    setAssetType,
    formData,
    setFormData,
    resetForm,
    handleStockSelection,
    handleSubmit,
    handleEdit,
    handleDelete,
    updateLiquidAsset
  } = useLiquidAssetManagement();

  const [showInactive, setShowInactive] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);

  // Use live price updates hook
  useLivePriceUpdates();

  const handleToggleActive = (assetId: string) => {
    const asset = data.liquidAssets.find(a => a.id === assetId);
    if (asset) {
      updateLiquidAsset(assetId, { isActive: !asset.isActive });
    }
  };

  const handleIconChange = (assetId: string, icon: string) => {
    updateLiquidAsset(assetId, { icon });
  };

  const activeAssets = data.liquidAssets.filter(asset => asset.isActive);
  const inactiveAssets = data.liquidAssets.filter(asset => !asset.isActive);
  const sortFn = (a: any, b: any) => (sortDesc ? (b.value || 0) - (a.value || 0) : (a.value || 0) - (b.value || 0));
  const displayAssets = showInactive 
    ? [...activeAssets.slice().sort(sortFn), ...inactiveAssets.slice().sort(sortFn)] 
    : activeAssets.slice().sort(sortFn);
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
                onClick={() => setSortDesc(!sortDesc)}
                className="brutalist-button text-xs"
                title="Toggle sort by value"
              >
                Sort {sortDesc ? '▼' : '▲'}
              </Button>
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
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button text-xs">
                    <Plus size={14} className="mr-1" />
                    <span className="hidden sm:inline">Add Asset</span>
                  </Button>
                </DialogTrigger>
                <AssetDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  editingAsset={editingAsset}
                  assetType={assetType}
                  setAssetType={setAssetType}
                  formData={formData}
                  setFormData={setFormData}
                  onStockSelection={handleStockSelection}
                  onSubmit={handleSubmit}
                  onReset={resetForm}
                  currency={currency}
                />
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
              const percentage = totalValue > 0 && asset.isActive ? (asset.value / totalValue) * 100 : 0;
              return (
                <div key={asset.id} className="space-y-1">
                  <AssetListItem
                    asset={asset}
                    currency={currency}
                    onToggleActive={handleToggleActive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onIconChange={handleIconChange}
                  />
                  {asset.isActive && (
                    <div>
                      <div className="text-right text-[10px] text-muted-foreground font-mono">{percentage.toFixed(1)}%</div>
                      <Progress value={percentage} className="h-2 bg-muted" />
                    </div>
                  )}
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
