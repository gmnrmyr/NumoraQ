
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { StatusToggle } from "@/components/ui/status-toggle";

export const AssetManagementEditable = () => {
  const { data, updateProperty, addProperty, removeProperty } = useFinancialData();
  const [newProperty, setNewProperty] = useState({
    name: '',
    value: 0,
    minValue: 0,
    maxValue: 0,
    status: 'planned' as 'rented' | 'renovating' | 'planned',
    currentRent: 0,
    expectedRent: 0,
    statusIcon: '📋',
    statusText: 'Planejado',
    prediction: '',
    rentRange: ''
  });
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rented': return '✅';
      case 'renovating': return '🔄';
      case 'planned': return '📋';
      default: return '📋';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rented': return 'Alugado';
      case 'renovating': return 'Reformando';
      case 'planned': return 'Planejado';
      default: return 'Planejado';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800 border-green-200';
      case 'renovating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleAddProperty = () => {
    if (newProperty.name.trim()) {
      const propertyToAdd = {
        ...newProperty,
        statusIcon: getStatusIcon(newProperty.status),
        statusText: getStatusText(newProperty.status)
      };
      addProperty(propertyToAdd);
      setNewProperty({
        name: '',
        value: 0,
        minValue: 0,
        maxValue: 0,
        status: 'planned',
        currentRent: 0,
        expectedRent: 0,
        statusIcon: '📋',
        statusText: 'Planejado',
        prediction: '',
        rentRange: ''
      });
      setIsAddingProperty(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateProperty(id, {
      status: newStatus as 'rented' | 'renovating' | 'planned',
      statusIcon: getStatusIcon(newStatus),
      statusText: getStatusText(newStatus)
    });
  };

  const totalPropertyValue = data.properties.reduce((sum, property) => sum + property.value, 0);
  const totalCurrentRent = data.properties
    .filter(property => property.status === 'rented')
    .reduce((sum, property) => sum + property.currentRent, 0);
  const totalExpectedRent = data.properties.reduce((sum, property) => {
    if (property.status === 'rented') return sum + property.currentRent;
    return sum + (property.expectedRent || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Home size={20} />
              Real Estate Portfolio
            </CardTitle>
            <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Property
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Property name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Current value"
                    value={newProperty.value}
                    onChange={(e) => setNewProperty({ ...newProperty, value: parseFloat(e.target.value) || 0 })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min value (optional)"
                      value={newProperty.minValue}
                      onChange={(e) => setNewProperty({ ...newProperty, minValue: parseFloat(e.target.value) || 0 })}
                    />
                    <Input
                      type="number"
                      placeholder="Max value (optional)"
                      value={newProperty.maxValue}
                      onChange={(e) => setNewProperty({ ...newProperty, maxValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Select value={newProperty.status} onValueChange={(value: 'rented' | 'renovating' | 'planned') => setNewProperty({ ...newProperty, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="renovating">Renovating</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Current rent"
                      value={newProperty.currentRent}
                      onChange={(e) => setNewProperty({ ...newProperty, currentRent: parseFloat(e.target.value) || 0 })}
                    />
                    <Input
                      type="number"
                      placeholder="Expected rent"
                      value={newProperty.expectedRent}
                      onChange={(e) => setNewProperty({ ...newProperty, expectedRent: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Input
                    placeholder="Timeline/Prediction"
                    value={newProperty.prediction}
                    onChange={(e) => setNewProperty({ ...newProperty, prediction: e.target.value })}
                  />
                  <Input
                    placeholder="Rent range (e.g., R$ 1.500-2.000)"
                    value={newProperty.rentRange}
                    onChange={(e) => setNewProperty({ ...newProperty, rentRange: e.target.value })}
                  />
                  <Button onClick={handleAddProperty} className="w-full">
                    Add Property
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Total Portfolio Value</div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {totalPropertyValue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">{data.properties.length} properties</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Current Monthly Rent</div>
              <div className="text-2xl font-bold text-green-600">
                R$ {totalCurrentRent.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">From rented properties</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Expected Monthly Rent</div>
              <div className="text-2xl font-bold text-purple-600">
                R$ {totalExpectedRent.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Full potential</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.properties.map((property) => (
          <Card key={property.id} className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{property.statusIcon}</span>
                  <Input
                    value={property.name}
                    onChange={(e) => updateProperty(property.id, { name: e.target.value })}
                    className="border-none p-0 font-semibold bg-transparent text-lg"
                  />
                </CardTitle>
                <Button
                  onClick={() => removeProperty(property.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <StatusToggle
                status={property.status}
                onToggle={(newStatus) => handleStatusChange(property.id, newStatus)}
                options={['rented', 'renovating', 'planned']}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Property Value</span>
                  <span className="font-bold text-blue-600">
                    R$ <EditableValue
                      value={property.value}
                      onSave={(value) => updateProperty(property.id, { value: Number(value) })}
                      type="number"
                      className="inline"
                    />
                  </span>
                </div>
                
                {(property.minValue || property.maxValue) && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Value Range</span>
                    <div className="text-xs text-slate-500">
                      R$ <EditableValue
                        value={property.minValue || 0}
                        onSave={(value) => updateProperty(property.id, { minValue: Number(value) })}
                        type="number"
                        className="inline"
                      />
                      {" - "}
                      R$ <EditableValue
                        value={property.maxValue || 0}
                        onSave={(value) => updateProperty(property.id, { maxValue: Number(value) })}
                        type="number"
                        className="inline"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Current Rent</span>
                  <span className="font-medium text-green-600">
                    R$ <EditableValue
                      value={property.currentRent}
                      onSave={(value) => updateProperty(property.id, { currentRent: Number(value) })}
                      type="number"
                      className="inline"
                    />
                  </span>
                </div>

                {property.expectedRent > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Expected Rent</span>
                    <span className="font-medium text-purple-600">
                      R$ <EditableValue
                        value={property.expectedRent}
                        onSave={(value) => updateProperty(property.id, { expectedRent: Number(value) })}
                        type="number"
                        className="inline"
                      />
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Timeline</span>
                  <Input
                    value={property.prediction}
                    onChange={(e) => updateProperty(property.id, { prediction: e.target.value })}
                    className="w-32 h-6 text-xs text-right"
                    placeholder="Timeline"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Rent Range</span>
                  <Input
                    value={property.rentRange}
                    onChange={(e) => updateProperty(property.id, { rentRange: e.target.value })}
                    className="w-32 h-6 text-xs text-right"
                    placeholder="e.g., R$ 1.500-2.000"
                  />
                </div>
              </div>

              {property.status === 'rented' && property.currentRent > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-slate-500">
                    Annual yield: {((property.currentRent * 12 / property.value) * 100).toFixed(2)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
