
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Trash2, Building, MapPin, Info } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
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
  const [isAddingProperty, setIsAddingProperty] = useState(false);

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
      statusText: 'Rented',
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
    },
    {
      id: '3',
      name: 'Suburban House',
      value: 680000,
      status: 'planned' as const,
      currentRent: 0,
      expectedRent: 3200,
      statusIcon: '📋',
      statusText: 'Planned Purchase',
      prediction: 'Target: Q3 2024',
      rentRange: '$3,000 - $3,500'
    }
  ];

  const totalRealEstateValue = properties.reduce((sum, property) => sum + property.value, 0);
  const totalCurrentRent = properties.reduce((sum, property) => sum + property.currentRent, 0);
  const totalProjectedRent = properties.reduce((sum, property) => sum + property.expectedRent, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer';
      case 'renovating': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer';
      case 'planned': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 cursor-pointer';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 cursor-pointer';
    }
  };

  const togglePropertyStatus = (propertyId: string, currentStatus: string) => {
    const statuses = ['rented', 'renovating', 'planned'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    // In real implementation, this would update the property status
    console.log(`Toggling property ${propertyId} from ${currentStatus} to ${nextStatus}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Real Estate Summary */}
      <Card className="bg-card/95 backdrop-blur-md border-2 border-blue-600 brutalist-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-blue-400 text-sm sm:text-base font-mono uppercase flex items-center gap-2">
                <Building size={20} />
                REAL ESTATE PORTFOLIO
              </CardTitle>
              <div className="text-lg sm:text-2xl font-bold text-blue-400 font-mono">
                {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'} {totalRealEstateValue.toLocaleString()}
              </div>
              <div className="text-xs text-blue-400/70 font-mono">
                {properties.length} properties • Current rent: {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{totalCurrentRent}/mo • 
                Projected: {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{totalProjectedRent}/mo
              </div>
            </div>
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
                    placeholder="Property name & address"
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
                    placeholder="Current monthly rent"
                    value={newProperty.currentRent}
                    onChange={(e) => setNewProperty({ ...newProperty, currentRent: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Input
                    type="number"
                    placeholder="Expected monthly rent"
                    value={newProperty.expectedRent}
                    onChange={(e) => setNewProperty({ ...newProperty, expectedRent: parseFloat(e.target.value) || 0 })}
                    className="brutalist-input"
                  />
                  <Button onClick={() => setIsAddingProperty(false)} className="w-full brutalist-button">
                    Add Property
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Info Banner */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 font-mono">
              <strong>Reference Only:</strong> These values are for tracking purposes. 
              Add rental income to the Income tab for accurate financial calculations.
            </div>
          </div>

          {/* Real Estate Properties */}
          <div className="space-y-3">
            {properties.map((property) => (
              <div key={property.id} className="p-4 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{property.statusIcon}</span>
                      <div>
                        <div className="font-medium text-sm font-mono text-foreground">{property.name}</div>
                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <MapPin size={12} />
                          {property.prediction}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-400 font-mono">
                        {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{property.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Market Value
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Status</div>
                      <Badge 
                        className={getStatusColor(property.status)}
                        onClick={() => togglePropertyStatus(property.id, property.status)}
                      >
                        {property.statusText}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Current Rent</div>
                      <div className="font-bold font-mono text-green-600">
                        {property.currentRent > 0 
                          ? `${data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}${property.currentRent}/mo`
                          : 'Not rented'
                        }
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Expected Rent</div>
                      <div className="font-bold font-mono text-blue-600">
                        {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{property.expectedRent}/mo
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground font-mono">
                      Market Range: {property.rentRange}
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
