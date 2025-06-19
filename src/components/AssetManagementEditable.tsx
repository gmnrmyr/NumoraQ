
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
  const { data, addProperty, updateProperty, removeProperty } = useFinancialData();
  const { t } = useTranslation();
  const [newProperty, setNewProperty] = useState({
    name: '',
    value: 0,
    status: 'rented' as 'rented' | 'renovating' | 'planned',
    currentRent: 0,
    expectedRent: 0,
    statusIcon: '🏠',
    statusText: 'Rented',
    prediction: 'Current',
    rentRange: 'N/A'
  });
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  // Calculate totals
  const totalRealEstateValue = data.properties.reduce((sum, property) => sum + property.value, 0);
  const totalCurrentRent = data.properties.reduce((sum, property) => sum + property.currentRent, 0);
  const totalProjectedRent = data.properties.reduce((sum, property) => sum + property.expectedRent, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer';
      case 'renovating': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer';
      case 'planned': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 cursor-pointer';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 cursor-pointer';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rented': return '🏠';
      case 'renovating': return '🔧';
      case 'planned': return '📋';
      default: return '🏠';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rented': return 'Rented';
      case 'renovating': return 'Under Renovation';
      case 'planned': return 'Planned Purchase';
      default: return 'Rented';
    }
  };

  const togglePropertyStatus = (propertyId: string, currentStatus: string) => {
    const statuses = ['rented', 'renovating', 'planned'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length] as 'rented' | 'renovating' | 'planned';
    
    const statusIcon = getStatusIcon(nextStatus);
    const statusText = getStatusText(nextStatus);
    const prediction = nextStatus === 'rented' ? 'Current' : nextStatus === 'renovating' ? 'Spring 2025' : '2026';
    const rentRange = nextStatus === 'rented' ? 'N/A' : nextStatus === 'renovating' ? '$2,000-2,400' : '$180-220/night';
    
    updateProperty(propertyId, { 
      status: nextStatus, 
      statusIcon, 
      statusText, 
      prediction, 
      rentRange 
    });
  };

  const handleAddProperty = () => {
    if (newProperty.name.trim()) {
      addProperty(newProperty);
      setNewProperty({
        name: '',
        value: 0,
        status: 'rented',
        currentRent: 0,
        expectedRent: 0,
        statusIcon: '🏠',
        statusText: 'Rented',
        prediction: 'Current',
        rentRange: 'N/A'
      });
      setIsAddingProperty(false);
    }
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
                {data.properties.length} properties • Current rent: {data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$'}{totalCurrentRent}/mo • 
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
                  <Button onClick={handleAddProperty} className="w-full brutalist-button">
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
            {data.properties.map((property) => (
              <div key={property.id} className="p-4 bg-background/50 border-2 border-border brutalist-card">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(property.status)}</span>
                      <div className="flex-1">
                        <Input
                          value={property.name}
                          onChange={(e) => updateProperty(property.id, { name: e.target.value })}
                          className="font-medium text-sm font-mono bg-transparent border-none p-0 text-foreground"
                        />
                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          Property Details
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-400 font-mono">
                        <Input
                          type="number"
                          value={property.value}
                          onChange={(e) => updateProperty(property.id, { value: parseFloat(e.target.value) || 0 })}
                          className="text-right font-bold text-lg text-blue-400 font-mono bg-transparent border-none p-0 w-32"
                        />
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
                        {getStatusText(property.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Current Rent</div>
                      <Input
                        type="number"
                        value={property.currentRent}
                        onChange={(e) => updateProperty(property.id, { currentRent: parseFloat(e.target.value) || 0 })}
                        className="font-bold font-mono text-green-600 bg-transparent border-none p-0 text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-mono">Expected Rent</div>
                      <Input
                        type="number"
                        value={property.expectedRent}
                        onChange={(e) => updateProperty(property.id, { expectedRent: parseFloat(e.target.value) || 0 })}
                        className="font-bold font-mono text-blue-600 bg-transparent border-none p-0 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground font-mono">
                      Click status to cycle through options
                    </div>
                    <Button
                      onClick={() => removeProperty(property.id)}
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
            
            {data.properties.length === 0 && (
              <div className="text-center py-8 text-muted-foreground font-mono">
                <Building size={48} className="mx-auto mb-4 opacity-50" />
                <p>No properties added yet</p>
                <p className="text-xs mt-2">Add your first property to start tracking real estate</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
