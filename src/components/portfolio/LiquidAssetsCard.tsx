
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Plus, Trash2, Coins } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { EditableValue } from "@/components/ui/editable-value";
import { IconSelector } from './IconSelector';
import { iconMap, groupedIcons } from './IconData';

export const LiquidAssetsCard = () => {
  const { t } = useTranslation();
  const {
    data,
    updateLiquidAsset,
    addLiquidAsset,
    removeLiquidAsset
  } = useFinancialData();
  const [newLiquidAsset, setNewLiquidAsset] = useState({
    name: '',
    value: 0,
    icon: 'Coins',
    color: 'text-blue-600',
    isActive: true
  });
  const [isAddingLiquid, setIsAddingLiquid] = useState(false);
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const handleAddLiquidAsset = () => {
    if (newLiquidAsset.name.trim()) {
      addLiquidAsset(newLiquidAsset);
      setNewLiquidAsset({
        name: '',
        value: 0,
        icon: 'Coins',
        color: 'text-blue-600',
        isActive: true
      });
      setIsAddingLiquid(false);
    }
  };
  return <Card className="bg-green-50 border-green-200 py-0 px-0 rounded-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Coins size={20} />
            {t.liquidAssets}
          </CardTitle>
          <Dialog open={isAddingLiquid} onOpenChange={setIsAddingLiquid}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.add} {t.liquidAssets}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder={t.description} value={newLiquidAsset.name} onChange={e => setNewLiquidAsset({
                ...newLiquidAsset,
                name: e.target.value
              })} />
                <Input type="number" placeholder={t.amount} value={newLiquidAsset.value} onChange={e => setNewLiquidAsset({
                ...newLiquidAsset,
                value: parseFloat(e.target.value) || 0
              })} />
                <IconSelector value={newLiquidAsset.icon} onChange={value => setNewLiquidAsset({
                ...newLiquidAsset,
                icon: value
              })} placeholder="Choose an icon" />
                <Button onClick={handleAddLiquidAsset} className="w-full">
                  {t.add}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-2xl font-bold text-green-700">
          {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
        </div>
        <div className="text-xs text-green-600">
          {data.liquidAssets.length - activeLiquidAssets.length} {t.inactive.toLowerCase()} {t.assets.toLowerCase()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.liquidAssets.map(asset => {
        const Icon = iconMap[asset.icon] || Coins;
        const percentage = totalLiquid > 0 ? asset.value / totalLiquid * 100 : 0;
        return <div key={asset.id} className={`space-y-2 ${!asset.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={asset.icon} onValueChange={value => updateLiquidAsset(asset.id, {
                icon: value
              })}>
                    <SelectTrigger className="w-12 h-8 p-1 border-none">
                      <Icon size={16} className={asset.color} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {Object.entries(groupedIcons).map(([category, icons]) => <div key={category}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50">
                            {category}
                          </div>
                          {icons.map(iconOption => {
                      const IconComponent = iconMap[iconOption.value];
                      return <SelectItem key={iconOption.value} value={iconOption.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent size={16} />
                                  <span>{iconOption.label}</span>
                                </div>
                              </SelectItem>;
                    })}
                        </div>)}
                    </SelectContent>
                  </Select>
                  <Input value={asset.name} onChange={e => updateLiquidAsset(asset.id, {
                name: e.target.value
              })} className="border-none p-0 font-medium bg-transparent w-32" />
                  <Button onClick={() => updateLiquidAsset(asset.id, {
                isActive: !asset.isActive
              })} variant="outline" size="sm" className={asset.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                    {asset.isActive ? t.active : t.inactive}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold">
                      {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} <EditableValue value={asset.value} onSave={value => updateLiquidAsset(asset.id, {
                    value: Number(value)
                  })} type="number" className="inline" />
                    </div>
                    {asset.isActive && <div className="text-xs text-slate-600">{percentage.toFixed(1)}%</div>}
                  </div>
                  <Button onClick={() => removeLiquidAsset(asset.id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              {asset.isActive && <Progress value={percentage} className="h-2" />}
            </div>;
      })}
      </CardContent>
    </Card>;
};
