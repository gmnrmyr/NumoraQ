
import React, { useState } from 'react';
import { AlertCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const UnsavedChangesIndicator = () => {
  const { data, lastSync } = useFinancialData();
  
  // Check if data has been modified since last sync
  const hasUnsavedChanges = () => {
    if (!lastSync) return true; // No sync yet
    if (!data.lastModified) return false; // No modifications tracked
    
    const lastSyncTime = new Date(lastSync).getTime();
    const lastModifiedTime = new Date(data.lastModified).getTime();
    
    return lastModifiedTime > lastSyncTime;
  };

  const getChangeSummary = () => {
    const changes = [];
    
    if (!lastSync) {
      changes.push("Initial data not synced");
      return changes;
    }

    // This is a simplified version - in a real app you'd track specific changes
    const lastSyncTime = new Date(lastSync).getTime();
    const dataTime = new Date(data.lastModified || 0).getTime();
    
    if (dataTime > lastSyncTime) {
      changes.push("Data modified locally");
      
      // Add more specific change detection based on timestamps or change logs
      if (data.liquidAssets.length > 0) changes.push(`${data.liquidAssets.length} liquid assets`);
      if (data.expenses.length > 0) changes.push(`${data.expenses.length} expenses`);
      if (data.passiveIncome.length > 0) changes.push(`${data.passiveIncome.length} income sources`);
    }
    
    return changes;
  };

  const unsavedChanges = hasUnsavedChanges();
  const changeSummary = getChangeSummary();

  if (!unsavedChanges) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
        >
          <AlertCircle size={14} className="mr-1" />
          Unsaved Changes
          <Eye size={12} className="ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-600" />
            <h4 className="font-medium text-sm">Unsaved Changes</h4>
          </div>
          
          <div className="space-y-2">
            {changeSummary.length > 0 ? (
              changeSummary.map((change, index) => (
                <Badge key={index} variant="outline" className="block text-xs p-2">
                  {change}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-gray-600">
                Local data differs from cloud backup
              </p>
            )}
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            {lastSync && (
              <p>Last sync: {new Date(lastSync).toLocaleString()}</p>
            )}
            {data.lastModified && (
              <p>Last modified: {new Date(data.lastModified).toLocaleString()}</p>
            )}
          </div>
          
          <p className="text-xs text-gray-600">
            Click "Save to Cloud" to sync your changes.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
