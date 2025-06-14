
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Plus, Trash2, Building } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { IconSelector } from './IconSelector';
import { iconMap, groupedIcons } from './IconData';

export const IlliquidAssetsCard = () => {
  const { data, updateIlliquidAsset, addIlliquidAsset, removeIlliquidAsset } = useFinancialData();
  
  const [newIlliquidAsset, setNewIlliquidAsset] = useState({
    name: '',
    value: 0,
    icon: 'Building',
    color: 'text-slate-600',
    isActive: true
  });
  
  const [isAddingIlliquid, setIsAddingIlliquid] = useState(false);

  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);

  const handleAddIlliquidAsset = () => {
    if (newIlliquidAsset.name.trim()) {
      addIlliquidAsset(newIlliquidAsset);
      setNewIlliquidAsset({
        name: '',
        value: 0,
        icon: 'Building',
        color: 'text-slate-600',
        isActive: true
      });
      setIsAddingIlliquid(false);
    }
  };

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Building size={20} />
            Illiquid Assets
          </CardTitle>
          <Dialog open={isAddingIlliquid} onOpenChange={setIsAddingIlliquid}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Illiquid Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Asset name"
                  value={newIlliquidAsset.name}
                  onChange={(e) => setNewIlliquidAsset({ ...newIlliquidAsset, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={newIlliquidAsset.value}
                  onChange={(e) => setNewIlliquidAsset({ ...newIlliquidAsset, value: parseFloat(e.target.value) || 0 })}
                />
                <IconSelector
                  value={newIlliquidAsset.icon}
                  onChange={(value) => setNewIlliquidAsset({ ...newIlliquidAsset, icon: value })}
                  placeholder="Choose an icon"
                />
                <Button onClick={handleAddIlliquidAsset} className="w-full">
                  Add Asset
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-2xl font-bold text-slate-700">
          {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalIlliquid.toLocaleString()}
        </div>
        <div className="text-xs text-slate-600">
          {data.illiquidAssets.length - activeIlliquidAssets.length} assets inactive
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.illiquidAssets.map((asset) => {
          const Icon = iconMap[asset.icon] || Building;
          const percentage = totalIlliquid > 0 ? (asset.value / totalIlliquid) * 100 : 0;
          
          return (
            <div key={asset.id} className={`space-y-2 ${!asset.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={asset.icon} onValueChange={(value) => updateIlliquidAsset(asset.id, { icon: value })}>
                    <SelectTrigger className="w-12 h-8 p-1 border-none">
                      <Icon size={16} className={asset.color} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(groupedIcons).map(([category, icons]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50">
                            {category}
                          </div>
                          {icons.map((iconOption) => {
                            const IconComponent = iconMap[iconOption.value];
                            return (
                              <SelectItem key={iconOption.value} value={iconOption.value}>
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
                  <Input
                    value={asset.name}
                    onChange={(e) => updateIlliquidAsset(asset.id, { name: e.target.value })}
                    className="border-none p-0 font-medium bg-transparent w-32"
                  />
                  <Button
                    onClick={() => updateIlliquidAsset(asset.id, { isActive: !asset.isActive })}
                    variant="outline"
                    size="sm"
                    className={asset.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}
                  >
                    {asset.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold">
                      {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} <EditableValue
                        value={asset.value}
                        onSave={(value) => updateIlliquidAsset(asset.id, { value: Number(value) })}
                        type="number"
                        className="inline"
                      />
                    </div>
                    {asset.isActive && <div className="text-xs text-slate-600">{percentage.toFixed(1)}%</div>}</div>
                  <Button
                    onClick={() => removeIlliquidAsset(asset.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              {asset.isActive && <Progress value={percentage} className="h-2" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
