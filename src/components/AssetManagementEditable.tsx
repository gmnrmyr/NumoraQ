
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, Car, Laptop, Plus, Trash2, Package } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";

export const AssetManagementEditable = () => {
  const { data, updateLiquidAsset, updateIlliquidAsset, addLiquidAsset, addIlliquidAsset, removeLiquidAsset, removeIlliquidAsset } = useFinancialData();
  const { t } = useTranslation();
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: 0,
    category: 'liquid' as 'liquid' | 'illiquid',
    icon: 'Package',
    color: 'blue',
    isActive: true
  });
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  const handleAddAsset = () => {
    if (newAsset.name.trim()) {
      const assetData = {
        name: newAsset.name,
        value: newAsset.value,
        icon: newAsset.icon,
        color: newAsset.color,
        isActive: newAsset.isActive
      };
      
      if (newAsset.category === 'liquid') {
        addLiquidAsset(assetData);
      } else {
        addIlliquidAsset(assetData);
      }
      
      setNewAsset({
        name: '',
        value: 0,
        category: 'liquid',
        icon: 'Package',
        color: 'blue',
        isActive: true
      });
      setIsAddingAsset(false);
    }
  };

  const allAssets = [...data.liquidAssets, ...data.illiquidAssets];
  const totalAssets = allAssets.filter(asset => asset.isActive).reduce((sum, asset) => sum + asset.value, 0);

  const getAssetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Car': return Car;
      case 'Laptop': return Laptop;
      default: return Package;
    }
  };

  const getAssetColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pink': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateAsset = (id: string, updates: any, isLiquid: boolean) => {
    if (isLiquid) {
      updateLiquidAsset(id, updates);
    } else {
      updateIlliquidAsset(id, updates);
    }
  };

  const removeAsset = (id: string, isLiquid: boolean) => {
    if (isLiquid) {
      removeLiquidAsset(id);
    } else {
      removeIlliquidAsset(id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Asset Summary */}
      <Card className="bg-card/95 backdrop-blur-md border-2 border-blue-600 brutalist-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-blue-400 text-sm sm:text-base font-mono uppercase flex items-center gap-2">
                <Package size={20} />
                {t.dataManagement || "ASSET MANAGEMENT"}
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-blue-400 font-mono">
                $ {totalAssets.toLocaleString()}
              </div>
              <div className="text-xs text-blue-400/70 font-mono">
                {allAssets.filter(a => a.isActive).length} {t.assets?.toLowerCase() || "active assets"}
              </div>
            </div>
            <Dialog open={isAddingAsset} onOpenChange={setIsAddingAsset}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto brutalist-button">
                  <Plus size={16} className="mr-1" />
                  {t.add || "Add Asset"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase">{t.add || "Add New Asset"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder={t.name || "Asset name"}
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder={t.amount || "Value"}
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Select value={newAsset.category} onValueChange={(value: any) => setNewAsset({ ...newAsset, category: value })}>
                    <SelectTrigger className="bg-input border-2 border-border">
                      <SelectValue placeholder={t.category || "Select category"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2 border-border z-50">
                      <SelectItem value="liquid">{t.liquid || "Liquid"}</SelectItem>
                      <SelectItem value="illiquid">{t.illiquid || "Illiquid"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddAsset} className="w-full brutalist-button">
                    {t.add || "Add Asset"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {allAssets.map((asset) => {
            const Icon = getAssetIcon(asset.icon);
            const isLiquid = data.liquidAssets.some(la => la.id === asset.id);
            return (
              <div key={asset.id} className={`p-2 sm:p-3 bg-background/50 border-2 border-border brutalist-card ${!asset.isActive ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <EditableValue
                        value={asset.name}
                        onSave={(value) => updateAsset(asset.id, { name: String(value) }, isLiquid)}
                        type="text"
                        className="font-medium bg-input border-2 border-border text-sm font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-medium text-sm text-blue-400">$</span>
                      <EditableValue
                        value={asset.value}
                        onSave={(value) => updateAsset(asset.id, { value: Number(value) }, isLiquid)}
                        type="number"
                        className="inline w-20 text-sm bg-input border-2 border-border font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge className={getAssetColor(asset.color)}>
                        {isLiquid ? (t.liquid || "Liquid") : (t.illiquid || "Illiquid")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusToggle
                        status={asset.isActive ? 'active' : 'inactive'}
                        onToggle={(newStatus) => updateAsset(asset.id, { isActive: newStatus === 'active' }, isLiquid)}
                        options={['active', 'inactive']}
                      />
                      <Button
                        onClick={() => removeAsset(asset.id, isLiquid)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
