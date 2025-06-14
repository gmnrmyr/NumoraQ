
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bitcoin, Coins, Building, Banknote, Plus, Trash2, 
  Wallet, CreditCard, PiggyBank, TrendingUp, DollarSign,
  Landmark, Gift, Shield, Target, Zap, Gem, Star,
  Users, Globe, Smartphone, Monitor, Car, Home,
  Briefcase, GraduationCap, Heart, Music, Gamepad2,
  Camera, Palette, Coffee, Book, Plane, ShoppingBag
} from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";

const iconMap: { [key: string]: any } = {
  // Financial
  Bitcoin, Coins, Building, Banknote, Wallet, CreditCard, 
  PiggyBank, TrendingUp, DollarSign, Landmark, Gift,
  
  // Investment & Trading
  Shield, Target, Zap, Gem, Star, TrendingUp,
  
  // Tech & Digital
  Users, Globe, Smartphone, Monitor, Gamepad2,
  
  // Physical Assets
  Car, Home, Camera, Book,
  
  // Business & Professional
  Briefcase, GraduationCap, Palette,
  
  // Lifestyle & Entertainment
  Heart, Music, Coffee, Plane, ShoppingBag
};

const iconOptions = [
  // Financial Icons
  { value: 'Bitcoin', label: 'Bitcoin', category: 'Crypto' },
  { value: 'Coins', label: 'Coins', category: 'Crypto' },
  { value: 'Wallet', label: 'Wallet', category: 'Financial' },
  { value: 'CreditCard', label: 'Credit Card', category: 'Financial' },
  { value: 'PiggyBank', label: 'Savings', category: 'Financial' },
  { value: 'TrendingUp', label: 'Stocks/Growth', category: 'Investment' },
  { value: 'DollarSign', label: 'Cash', category: 'Financial' },
  { value: 'Landmark', label: 'Bank/Institution', category: 'Financial' },
  
  // Investment & Assets
  { value: 'Shield', label: 'Insurance/Protection', category: 'Investment' },
  { value: 'Target', label: 'Goal/Target', category: 'Investment' },
  { value: 'Zap', label: 'Energy/Fast', category: 'Investment' },
  { value: 'Gem', label: 'Precious/Rare', category: 'Investment' },
  { value: 'Star', label: 'Premium/Star', category: 'Investment' },
  { value: 'Gift', label: 'Gift/Bonus', category: 'Investment' },
  
  // Tech & Digital
  { value: 'Users', label: 'Social/Community', category: 'Tech' },
  { value: 'Globe', label: 'Global/Web', category: 'Tech' },
  { value: 'Smartphone', label: 'Mobile/App', category: 'Tech' },
  { value: 'Monitor', label: 'Computer/Digital', category: 'Tech' },
  { value: 'Gamepad2', label: 'Gaming/NFT', category: 'Tech' },
  
  // Physical Assets
  { value: 'Building', label: 'Real Estate', category: 'Physical' },
  { value: 'Home', label: 'House/Property', category: 'Physical' },
  { value: 'Car', label: 'Vehicle', category: 'Physical' },
  { value: 'Camera', label: 'Equipment', category: 'Physical' },
  { value: 'Book', label: 'Books/Education', category: 'Physical' },
  
  // Business & Professional
  { value: 'Briefcase', label: 'Business', category: 'Business' },
  { value: 'GraduationCap', label: 'Education', category: 'Business' },
  { value: 'Palette', label: 'Creative/Art', category: 'Business' },
  
  // Lifestyle
  { value: 'Heart', label: 'Health/Personal', category: 'Lifestyle' },
  { value: 'Music', label: 'Entertainment', category: 'Lifestyle' },
  { value: 'Coffee', label: 'Food/Lifestyle', category: 'Lifestyle' },
  { value: 'Plane', label: 'Travel', category: 'Lifestyle' },
  { value: 'ShoppingBag', label: 'Shopping/Retail', category: 'Lifestyle' },
  { value: 'Banknote', label: 'Cash/Money', category: 'Financial' }
];

const groupedIcons = iconOptions.reduce((acc, icon) => {
  if (!acc[icon.category]) {
    acc[icon.category] = [];
  }
  acc[icon.category].push(icon);
  return acc;
}, {} as Record<string, typeof iconOptions>);

export const PortfolioOverview = () => {
  const { data, updateLiquidAsset, updateIlliquidAsset, addLiquidAsset, addIlliquidAsset, removeLiquidAsset, removeIlliquidAsset } = useFinancialData();
  
  const [newLiquidAsset, setNewLiquidAsset] = useState({
    name: '',
    value: 0,
    icon: 'Coins',
    color: 'text-blue-600',
    isActive: true
  });
  
  const [newIlliquidAsset, setNewIlliquidAsset] = useState({
    name: '',
    value: 0,
    icon: 'Building',
    color: 'text-slate-600',
    isActive: true
  });
  
  const [isAddingLiquid, setIsAddingLiquid] = useState(false);
  const [isAddingIlliquid, setIsAddingIlliquid] = useState(false);

  // Only count active assets in totals
  const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
  const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
  
  const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalPortfolio = totalLiquid + totalIlliquid;

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

  const IconSelector = ({ value, onChange, placeholder }: { value: string, onChange: (value: string) => void, placeholder: string }) => {
    const SelectedIcon = iconMap[value] || Coins;
    
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            <div className="flex items-center gap-2">
              <SelectedIcon size={20} />
              <span>{iconOptions.find(opt => opt.value === value)?.label || placeholder}</span>
            </div>
          </SelectValue>
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
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Liquid Assets */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Coins size={20} />
              Liquid Assets
            </CardTitle>
            <Dialog open={isAddingLiquid} onOpenChange={setIsAddingLiquid}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Liquid Asset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Asset name"
                    value={newLiquidAsset.name}
                    onChange={(e) => setNewLiquidAsset({ ...newLiquidAsset, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={newLiquidAsset.value}
                    onChange={(e) => setNewLiquidAsset({ ...newLiquidAsset, value: parseFloat(e.target.value) || 0 })}
                  />
                  <IconSelector
                    value={newLiquidAsset.icon}
                    onChange={(value) => setNewLiquidAsset({ ...newLiquidAsset, icon: value })}
                    placeholder="Choose an icon"
                  />
                  <Button onClick={handleAddLiquidAsset} className="w-full">
                    Add Asset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
          </div>
          <div className="text-xs text-green-600">
            {data.liquidAssets.length - activeLiquidAssets.length} assets inactive
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.liquidAssets.map((asset) => {
            const Icon = iconMap[asset.icon] || Coins;
            const percentage = totalLiquid > 0 ? (asset.value / totalLiquid) * 100 : 0;
            
            return (
              <div key={asset.id} className={`space-y-2 ${!asset.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Select value={asset.icon} onValueChange={(value) => updateLiquidAsset(asset.id, { icon: value })}>
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
                      onChange={(e) => updateLiquidAsset(asset.id, { name: e.target.value })}
                      className="border-none p-0 font-medium bg-transparent w-32"
                    />
                    <Button
                      onClick={() => updateLiquidAsset(asset.id, { isActive: !asset.isActive })}
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
                          onSave={(value) => updateLiquidAsset(asset.id, { value: Number(value) })}
                          type="number"
                          className="inline"
                        />
                      </div>
                      {asset.isActive && <div className="text-xs text-slate-600">{percentage.toFixed(1)}%</div>}
                    </div>
                    <Button
                      onClick={() => removeLiquidAsset(asset.id)}
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

      {/* Illiquid Assets */}
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

      {/* Portfolio Summary */}
      <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Liquid (Active)</div>
              <div className="text-xl font-bold text-green-600">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalLiquid.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalPortfolio > 0 ? ((totalLiquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Illiquid (Active)</div>
              <div className="text-xl font-bold text-slate-600">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalIlliquid.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                {totalPortfolio > 0 ? ((totalIlliquid / totalPortfolio) * 100).toFixed(1) : 0}% of portfolio
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-blue-200">
              <div className="text-sm text-slate-600">Total Portfolio (Active)</div>
              <div className="text-2xl font-bold text-blue-600">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalPortfolio.toLocaleString()}
              </div>
              <Badge variant="outline" className="mt-1">Active Assets Only</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
