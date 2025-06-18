
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Plus, Trash2, Building } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { EditableValue } from "@/components/ui/editable-value";
import { IconSelector } from './IconSelector';
import { iconMap, groupedIcons } from './IconData';

export const IlliquidAssetsCard = () => {
  const { t } = useTranslation();
  const { data, updateIlliquidAsset, addIlliquidAsset, removeIlliquidAsset } = useFinancialData();
  
  const [newIlliquidAsset, setNewIlliquidAsset] = useState({
    name: '',
    value: 0,
    icon: 'Building',
    color: 'text-foreground',
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
        color: 'text-foreground',
        isActive: true
      });
      setIsAddingIlliquid(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-foreground border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 font-mono uppercase">
            <Building size={20} />
            {t.illiquidAssets || 'Illiquid Assets'}
          </CardTitle>
          <Dialog open={isAddingIlliquid} onOpenChange={setIsAddingIlliquid}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-foreground border-2">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase text-foreground">{t.add || 'Add'} {t.illiquidAssets || 'Illiquid Asset'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder={t.description || "Asset name"}
                  value={newIlliquidAsset.name}
                  onChange={(e) => setNewIlliquidAsset({ ...newIlliquidAsset, name: e.target.value })}
                  className="bg-input border-border border-2 text-foreground font-mono"
                />
                <Input
                  type="number"
                  placeholder={t.amount || "Value"}
                  value={newIlliquidAsset.value}
                  onChange={(e) => setNewIlliquidAsset({ ...newIlliquidAsset, value: parseFloat(e.target.value) || 0 })}
                  className="bg-input border-border border-2 text-foreground font-mono"
                />
                <IconSelector
                  value={newIlliquidAsset.icon}
                  onChange={(value) => setNewIlliquidAsset({ ...newIlliquidAsset, icon: value })}
                  placeholder="Choose an icon"
                />
                <Button onClick={handleAddIlliquidAsset} className="w-full bg-foreground text-background hover:bg-foreground/90 font-mono uppercase">
                  {t.add || 'Add Asset'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-2xl font-bold text-foreground font-mono">
          {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalIlliquid.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {data.illiquidAssets.length - activeIlliquidAssets.length} {t.inactive?.toLowerCase() || 'assets'} {t.assets?.toLowerCase() || 'inactive'}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        {data.illiquidAssets.map((asset) => {
          const Icon = iconMap[asset.icon] || Building;
          const percentage = totalIlliquid > 0 ? (asset.value / totalIlliquid) * 100 : 0;
          
          return (
            <div key={asset.id} className={`space-y-2 min-w-0 ${!asset.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Select value={asset.icon} onValueChange={(value) => updateIlliquidAsset(asset.id, { icon: value })}>
                    <SelectTrigger className="w-12 h-8 p-1 border-border bg-input">
                      <Icon size={16} className={asset.color} />
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
                  <Input
                    value={asset.name}
                    onChange={(e) => updateIlliquidAsset(asset.id, { name: e.target.value })}
                    className="border-none p-0 font-medium bg-transparent flex-1 min-w-0 font-mono text-foreground"
                  />
                  <Button
                    onClick={() => updateIlliquidAsset(asset.id, { isActive: !asset.isActive })}
                    variant="outline"
                    size="sm"
                    className={`whitespace-nowrap font-mono uppercase text-xs ${
                      asset.isActive 
                        ? "bg-accent/20 text-accent border-accent" 
                        : "bg-muted text-muted-foreground border-muted-foreground"
                    }`}
                  >
                    {asset.isActive ? (t.active || "Active") : (t.inactive || "Inactive")}
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right min-w-0">
                    <div className="font-bold font-mono text-foreground text-sm">
                      {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} 
                      <EditableValue
                        value={asset.value}
                        onSave={(value) => updateIlliquidAsset(asset.id, { value: Number(value) })}
                        type="number"
                        className="inline font-mono"
                      />
                    </div>
                    {asset.isActive && (
                      <div className="text-xs text-muted-foreground font-mono">{percentage.toFixed(1)}%</div>
                    )}
                  </div>
                  <Button
                    onClick={() => removeIlliquidAsset(asset.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300 border-red-400 hover:border-red-300 bg-transparent flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              {asset.isActive && <Progress value={percentage} className="h-2 bg-muted" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
