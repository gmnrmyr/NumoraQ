
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
  const { data, updateAsset, addAsset, removeAsset } = useFinancialData();
  const { t } = useTranslation();
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: 0,
    category: 'real_estate' as 'real_estate' | 'vehicle' | 'electronics' | 'jewelry' | 'collectibles' | 'other',
    status: 'active' as 'active' | 'inactive'
  });
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  const handleAddAsset = () => {
    if (newAsset.name.trim()) {
      addAsset(newAsset);
      setNewAsset({
        name: '',
        value: 0,
        category: 'real_estate',
        status: 'active'
      });
      setIsAddingAsset(false);
    }
  };

  const totalAssets = data.assets.filter(asset => asset.status === 'active').reduce((sum, asset) => sum + asset.value, 0);

  const getAssetIcon = (category: string) => {
    switch (category) {
      case 'real_estate': return Home;
      case 'vehicle': return Car;
      case 'electronics': return Laptop;
      default: return Package;
    }
  };

  const getAssetColor = (category: string) => {
    switch (category) {
      case 'real_estate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vehicle': return 'bg-green-100 text-green-800 border-green-200';
      case 'electronics': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'jewelry': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'collectibles': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                {t.assetManagement || "ASSET MANAGEMENT"}
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-blue-400 font-mono">
                $ {totalAssets.toLocaleString()}
              </div>
              <div className="text-xs text-blue-400/70 font-mono">
                {data.assets.filter(a => a.status === 'active').length} {t.activeAssets?.toLowerCase() || "active assets"}
              </div>
            </div>
            <Dialog open={isAddingAsset} onOpenChange={setIsAddingAsset}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto brutalist-button">
                  <Plus size={16} className="mr-1" />
                  {t.addAsset || "Add Asset"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase">{t.addNewAsset || "Add New Asset"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder={t.assetName || "Asset name"}
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder={t.value || "Value"}
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Select value={newAsset.category} onValueChange={(value: any) => setNewAsset({ ...newAsset, category: value })}>
                    <SelectTrigger className="bg-input border-2 border-border">
                      <SelectValue placeholder={t.selectCategory || "Select category"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2 border-border z-50">
                      <SelectItem value="real_estate">{t.realEstate || "Real Estate"}</SelectItem>
                      <SelectItem value="vehicle">{t.vehicle || "Vehicle"}</SelectItem>
                      <SelectItem value="electronics">{t.electronics || "Electronics"}</SelectItem>
                      <SelectItem value="jewelry">{t.jewelry || "Jewelry"}</SelectItem>
                      <SelectItem value="collectibles">{t.collectibles || "Collectibles"}</SelectItem>
                      <SelectItem value="other">{t.other || "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddAsset} className="w-full brutalist-button">
                    {t.addAsset || "Add Asset"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.assets.map((asset) => {
            const Icon = getAssetIcon(asset.category);
            return (
              <div key={asset.id} className={`p-2 sm:p-3 bg-background/50 border-2 border-border brutalist-card ${asset.status === 'inactive' ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <EditableValue
                        value={asset.name}
                        onSave={(value) => updateAsset(asset.id, { name: String(value) })}
                        type="text"
                        className="font-medium bg-input border-2 border-border text-sm font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-medium text-sm text-blue-400">$</span>
                      <EditableValue
                        value={asset.value}
                        onSave={(value) => updateAsset(asset.id, { value: Number(value) })}
                        type="number"
                        className="inline w-20 text-sm bg-input border-2 border-border font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <Select value={asset.category} onValueChange={(value) => updateAsset(asset.id, { category: value })}>
                        <SelectTrigger className="w-24 h-6 text-xs border-border bg-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-2 border-border z-50">
                          <SelectItem value="real_estate">{t.realEstate || "Real Estate"}</SelectItem>
                          <SelectItem value="vehicle">{t.vehicle || "Vehicle"}</SelectItem>
                          <SelectItem value="electronics">{t.electronics || "Electronics"}</SelectItem>
                          <SelectItem value="jewelry">{t.jewelry || "Jewelry"}</SelectItem>
                          <SelectItem value="collectibles">{t.collectibles || "Collectibles"}</SelectItem>
                          <SelectItem value="other">{t.other || "Other"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusToggle
                        status={asset.status}
                        onToggle={(newStatus) => updateAsset(asset.id, { status: newStatus })}
                        options={['active', 'inactive']}
                      />
                      <Button
                        onClick={() => removeAsset(asset.id)}
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
