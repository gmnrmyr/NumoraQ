
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Coins, Settings, Wallet, TrendingUp } from "lucide-react";
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
    color: 'text-accent',
    isActive: true,
    trackingMode: 'manual' as 'manual' | 'wallet' | 'price'
  });
  const [isAddingLiquid, setIsAddingLiquid] = useState(false);
  const [showAdvancedFor, setShowAdvancedFor] = useState<string | null>(null);
  
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const handleAddLiquidAsset = () => {
    if (newLiquidAsset.name.trim()) {
      addLiquidAsset(newLiquidAsset);
      setNewLiquidAsset({
        name: '',
        value: 0,
        icon: 'Coins',
        color: 'text-accent',
        isActive: true,
        trackingMode: 'manual'
      });
      setIsAddingLiquid(false);
    }
  };

  const cryptoAssets = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC'];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-accent flex items-center gap-2 font-mono uppercase">
            <Coins size={20} />
            {t.liquidAssets}
          </CardTitle>
          <Dialog open={isAddingLiquid} onOpenChange={setIsAddingLiquid}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-accent border-2">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase text-foreground">{t.add} {t.liquidAssets}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder={t.description} 
                  value={newLiquidAsset.name} 
                  onChange={e => setNewLiquidAsset({
                    ...newLiquidAsset,
                    name: e.target.value
                  })} 
                  className="bg-input border-border border-2 text-foreground font-mono"
                />
                <Input 
                  type="number" 
                  placeholder={t.amount} 
                  value={newLiquidAsset.value} 
                  onChange={e => setNewLiquidAsset({
                    ...newLiquidAsset,
                    value: parseFloat(e.target.value) || 0
                  })} 
                  className="bg-input border-border border-2 text-foreground font-mono"
                />
                <IconSelector 
                  value={newLiquidAsset.icon} 
                  onChange={value => setNewLiquidAsset({
                    ...newLiquidAsset,
                    icon: value
                  })} 
                  placeholder="Choose an icon" 
                />
                <Select value={newLiquidAsset.trackingMode} onValueChange={(value: any) => setNewLiquidAsset({
                  ...newLiquidAsset,
                  trackingMode: value
                })}>
                  <SelectTrigger className="bg-input border-border border-2">
                    <SelectValue placeholder="Tracking mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border border-2">
                    <SelectItem value="manual">📝 Manual Entry</SelectItem>
                    <SelectItem value="price">📊 Price Tracking</SelectItem>
                    <SelectItem value="wallet">🔗 Wallet Connection</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddLiquidAsset} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase">
                  {t.add}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {data.liquidAssets.length - activeLiquidAssets.length} {t.inactive.toLowerCase()} {t.assets.toLowerCase()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        {data.liquidAssets.map(asset => {
          const Icon = iconMap[asset.icon] || Coins;
          const percentage = totalLiquid > 0 ? asset.value / totalLiquid * 100 : 0;
          const isCrypto = cryptoAssets.some(crypto => asset.name.toUpperCase().includes(crypto));
          
          return (
            <div key={asset.id} className={`space-y-2 min-w-0 ${!asset.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Select value={asset.icon} onValueChange={value => updateLiquidAsset(asset.id, { icon: value })}>
                    <SelectTrigger className="w-12 h-8 p-1 border-border bg-input">
                      <Icon size={16} className={asset.color} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 bg-card border-border border-2">
                      {Object.entries(groupedIcons).map(([category, icons]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted font-mono uppercase">
                            {category}
                          </div>
                          {icons.map(iconOption => {
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
                    onChange={e => updateLiquidAsset(asset.id, { name: e.target.value })}
                    className="border-none p-0 font-medium bg-transparent flex-1 min-w-0 font-mono text-foreground"
                  />
                  {(isCrypto || asset.trackingMode !== 'manual') && (
                    <Dialog open={showAdvancedFor === asset.id} onOpenChange={(open) => setShowAdvancedFor(open ? asset.id : null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-400 border-blue-400 hover:bg-blue-400/20 p-1"
                        >
                          <Settings size={12} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-2 border-border max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-mono">Advanced Tracking: {asset.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-mono text-muted-foreground">Tracking Mode</label>
                            <Select 
                              value={asset.trackingMode || 'manual'} 
                              onValueChange={(value: any) => updateLiquidAsset(asset.id, { trackingMode: value })}
                            >
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="manual">
                                  <div className="flex items-center gap-2">
                                    <Coins size={16} />
                                    <span>Manual Entry</span>
                                  </div>
                                </SelectItem>
                                {isCrypto && (
                                  <>
                                    <SelectItem value="price">
                                      <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />
                                        <span>Price Tracking</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="wallet">
                                      <div className="flex items-center gap-2">
                                        <Wallet size={16} />
                                        <span>Wallet Connection</span>
                                      </div>
                                    </SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {asset.trackingMode === 'price' && (
                            <div className="space-y-2">
                              <label className="text-sm font-mono text-muted-foreground">Amount Held</label>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="bg-input border-border font-mono"
                              />
                              <div className="text-xs text-blue-400 font-mono">
                                📊 Value will update automatically based on current price
                              </div>
                            </div>
                          )}
                          
                          {asset.trackingMode === 'wallet' && (
                            <div className="space-y-2">
                              <label className="text-sm font-mono text-muted-foreground">Wallet Address</label>
                              <Input 
                                placeholder="0x..." 
                                className="bg-input border-border font-mono text-xs"
                              />
                              <div className="text-xs text-blue-400 font-mono">
                                🔗 Connect via DeBank API (Coming Soon)
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border border-border">
                            💡 Manual mode remains default and most reliable for precise tracking
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    onClick={() => updateLiquidAsset(asset.id, { isActive: !asset.isActive })}
                    variant="outline"
                    size="sm"
                    className={`whitespace-nowrap font-mono uppercase text-xs ${
                      asset.isActive 
                        ? "bg-accent/20 text-accent border-accent" 
                        : "bg-muted text-muted-foreground border-muted-foreground"
                    }`}
                  >
                    {asset.isActive ? t.active : t.inactive}
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right min-w-0">
                    <div className="font-bold font-mono text-foreground text-sm">
                      {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} 
                      <EditableValue
                        value={asset.value}
                        onSave={value => updateLiquidAsset(asset.id, { value: Number(value) })}
                        type="number"
                        className="inline font-mono"
                      />
                    </div>
                    {asset.isActive && (
                      <div className="text-xs text-muted-foreground font-mono">{percentage.toFixed(1)}%</div>
                    )}
                  </div>
                  <Button
                    onClick={() => removeLiquidAsset(asset.id)}
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
