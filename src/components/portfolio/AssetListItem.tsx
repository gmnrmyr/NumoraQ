
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Eye, EyeOff, Bitcoin, TrendingUp, Building } from "lucide-react";
import { iconMap, groupedIcons } from './IconData';

interface AssetListItemProps {
  asset: any;
  currency: string;
  onToggleActive: (id: string) => void;
  onEdit: (asset: any) => void;
  onDelete: (id: string) => void;
  onIconChange: (id: string, icon: string) => void;
}

export const AssetListItem = ({ 
  asset, 
  currency, 
  onToggleActive, 
  onEdit, 
  onDelete, 
  onIconChange 
}: AssetListItemProps) => {
  const Icon = iconMap[asset.icon] || iconMap['Wallet'];

  const getAssetBadge = () => {
    if (asset.isCrypto) {
      return (
        <Badge variant="outline" className="text-xs font-mono">
          <Bitcoin size={10} className="mr-1" />
          {asset.cryptoSymbol}
        </Badge>
      );
    }
    if (asset.isStock && !asset.isReit) {
      return (
        <Badge variant="outline" className="text-xs font-mono">
          <TrendingUp size={10} className="mr-1" />
          {asset.stockSymbol}
        </Badge>
      );
    }
    if (asset.isReit) {
      return (
        <Badge variant="outline" className="text-xs font-mono">
          <Building size={10} className="mr-1" />
          {asset.stockSymbol}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div 
      className={`flex items-center justify-between p-3 bg-muted border-2 border-border ${
        !asset.isActive ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <Select value={asset.icon} onValueChange={(value) => onIconChange(asset.id, value)}>
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
          <div className="flex items-center gap-2">
            <div className="font-mono font-bold text-sm truncate" title={asset.name}>
              {asset.name}
            </div>
            {getAssetBadge()}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {currency} {asset.value.toLocaleString()}
            {asset.isCrypto && asset.quantity && (
              <span className="ml-2">({asset.quantity} {asset.cryptoSymbol})</span>
            )}
            {(asset.isStock || asset.isReit) && asset.quantity && (
              <span className="ml-2">({asset.quantity} {asset.isReit ? 'quotas' : 'shares'})</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleActive(asset.id)}
          className="brutalist-button p-1 h-8 w-8"
          title={asset.isActive ? 'Deactivate' : 'Activate'}
        >
          {asset.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(asset)}
          className="brutalist-button p-1 h-8 w-8"
          title="Edit"
        >
          <Edit size={12} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(asset.id)}
          className="brutalist-button p-1 h-8 w-8 hover:bg-red-50 hover:border-red-200"
          title="Delete"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
};
