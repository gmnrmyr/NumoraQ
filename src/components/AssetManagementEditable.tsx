
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, TrendingUp, Plus, Trash2, Building, MapPin } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";
import { useTranslation } from "@/contexts/TranslationContext";

export const AssetManagementEditable = () => {
  const { data } = useFinancialData();
  const { t } = useTranslation();
  const [newProperty, setNewProperty] = useState({
    name: '',
    value: 0,
    status: 'rented' as 'rented' | 'renovating' | 'planned',
    currentRent: 0,
    expectedRent: 0
  });
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    shares: 0,
    currentPrice: 0,
    status: 'yielding' as 'yielding' | 'growth' | 'dividend',
    yield: 0
  });
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Mock data for now - in real implementation this would come from context
  const properties = [
    {
      id: '1',
      name: 'Main Street Apartment',
      value: 450000,
      status: 'rented' as const,
      currentRent: 2500,
      expectedRent: 2800,
      statusIcon: '🏠',
      statusText: 'Rented - $2,500/mo',
      prediction: '+12% value growth',
      rentRange: '$2,400 - $2,800'
    },
    {
      id: '2',
      name: 'Downtown Condo',
      value: 320000,
      status: 'renovating' as const,
      currentRent: 0,
      expectedRent: 2200,
      statusIcon: '🔧',
      statusText: 'Under Renovation',
      prediction: 'Ready Q2 2024',
      rentRange: '$2,000 - $2,400'
    }
  ];

  const stocks = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 50,
      currentPrice: 185.50,
      totalValue: 9275,
      status: 'growth' as const,
      statusIcon: '📈',
      statusText: 'Growth Stock',
      yield: 0
    },
    {
      id: '2',
      symbol: 'REITS',
      name: 'Real Estate Investment Trust',
      shares: 100,
      currentPrice: 45.20,
      totalValue: 4520,
      status: 'yielding' as const,
      statusIcon: '💰',
      statusText: 'Dividend Yield: 6.2%',
      yield: 6.2
    }
  ];

  const totalAssetValue = [...properties, ...stocks.map(s => ({ value: s.totalValue }))].reduce((sum, asset) => sum + asset.value, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': case 'yielding': return 'bg-green-100 text-green-800 border-green-200';
      case 'renovating': case 'growth': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned': case 'dividend': return 'bg-purple-100 text-purple-800 border-purple-200';
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
                <Building size={20} />
                {t.dataManagement || "REAL ESTATE & STOCKS"}
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-blue-400 font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalAssetValue.toLocaleString()}
              </div>
              <div className="text-xs text-blue-400/70 font-mono">
                {properties.length} properties • {stocks.length} stocks
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button">
                    <Home size={16} className="mr-1" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase">Add Real Estate</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Property name"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      className="brutalist-input"
                    />
                    <Input
                      type="number"
                      placeholder="Property value"
                      value={newProperty.value}
                      onChange={(e) => setNewProperty({ ...newProperty, value: parseFloat(e.target.value) || 0 })}
                      className="brutalist-input"
                    />
                    <Select value={newProperty.status} onValueChange={(value: any) => setNewProperty({ ...newProperty, status: value })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-2 border-border z-50">
                        <SelectItem value="rented">🏠 Rented</SelectItem>
                        <SelectItem value="renovating">🔧 Renovating</SelectItem>
                        <SelectItem value="planned">📋 Planned</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Current rent"
                      value={newProperty.currentRent}
                      onChange={(e) => setNewProperty({ ...newProperty, currentRent: parseFloat(e.target.value) || 0 })}
                      className="brutalist-input"
                    />
                    <Button onClick={() => setIsAddingProperty(false)} className="w-full brutalist-button">
                      Add Property
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddingStock} onOpenChange={setIsAddingStock}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button">
                    <TrendingUp size={16} className="mr-1" />
                    Add Stock
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border z-50">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase">Add Stock</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Stock symbol (e.g., AAPL)"
                      value={newStock.symbol}
                      onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
                      className="brutalist-input"
                    />
                    <Input
                      placeholder="Company name"
                      value={newStock.name}
                      onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                      className="brutalist-input"
                    />
                    <Input
                      type="number"
                      placeholder="Number of shares"
                      value={newStock.shares}
                      onChange={(e) => setNewStock({ ...newStock, shares: parseFloat(e.target.value) || 0 })}
                      className="brutalist-input"
                    />
                    <Input
                      type="number"
                      placeholder="Current price per share"
                      value={newStock.currentPrice}
                      onChange={(e) => setNewStock({ ...newStock, currentPrice: parseFloat(e.target.value) || 0 })}
                      className="brutalist-input"
                    />
                    <Select value={newStock.status} onValueChange={(value: any) => setNewStock({ ...newStock, status: value })}>
                      <SelectTrigger className="bg-input border-2 border-border">
                        <SelectValue placeholder="Stock type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-2 border-border z-50">
                        <SelectItem value="yielding">💰 Dividend Stock</SelectItem>
                        <SelectItem value="growth">📈 Growth Stock</SelectItem>
                        <SelectItem value="dividend">🎯 High Dividend</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddingStock(false)} className="w-full brutalist-button">
                      Add Stock
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Real Estate Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-blue-400 font-mono uppercase flex items-center gap-2">
              <Home size={16} />
              Real Estate Portfolio
            </h3>
            {properties.map((property) => (
              <div key={property.id} className="p-3 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{property.statusIcon}</span>
                      <div>
                        <div className="font-medium text-sm font-mono">{property.name}</div>
                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <MapPin size={12} />
                          {property.statusText}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-blue-400 font-mono">
                        {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{property.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {property.prediction}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                    <div className="text-muted-foreground font-mono">
                      Rent: {property.rentRange}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stocks Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-blue-400 font-mono uppercase flex items-center gap-2">
              <TrendingUp size={16} />
              Stock Portfolio
            </h3>
            {stocks.map((stock) => (
              <div key={stock.id} className="p-3 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stock.statusIcon}</span>
                      <div>
                        <div className="font-medium text-sm font-mono">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground font-mono">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-blue-400 font-mono">
                        {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{stock.totalValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {stock.shares} shares @ ${stock.currentPrice}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Badge className={getStatusColor(stock.status)}>
                      {stock.statusText}
                    </Badge>
                    <div className="text-muted-foreground font-mono">
                      {stock.status === 'yielding' && `Yield: ${stock.yield}%`}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
