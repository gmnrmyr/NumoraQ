
import React, { useState } from 'react';
import { AlertCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';

export const UnsavedChangesIndicator = () => {
  const { data, lastSync } = useFinancialData();
  const { t } = useTranslation();
  
  // Check if data has been modified since last sync, excluding automatic updates
  const hasUnsavedChanges = () => {
    if (!lastSync) return true; // No sync yet
    if (!data.lastModified) return false; // No modifications tracked
    
    const lastSyncTime = new Date(lastSync).getTime();
    const lastModifiedTime = new Date(data.lastModified).getTime();
    
    // Only consider as unsaved if modified more than 10 seconds after sync
    // This filters out automatic exchange rate updates
    return lastModifiedTime > (lastSyncTime + 10000);
  };

  const getChangeSummary = () => {
    const changes = [];
    
    if (!lastSync) {
      changes.push(t.noDataYet);
      return changes;
    }

    // More specific change detection based on actual user data
    const lastSyncTime = new Date(lastSync).getTime();
    const dataTime = new Date(data.lastModified || 0).getTime();
    
    if (dataTime > lastSyncTime + 10000) { // 10 second buffer for auto-updates
      // Only show changes if there's actual user content
      if (data.liquidAssets.length > 0 || 
          data.expenses.length > 0 || 
          data.passiveIncome.length > 0 || 
          data.activeIncome.length > 0 ||
          data.debts.length > 0 || 
          data.properties.length > 0 ||
          data.tasks.length > 0) {
        changes.push("User data has been modified");
      }
    }
    
    return changes;
  };

  const unsavedChanges = hasUnsavedChanges();
  const changeSummary = getChangeSummary();

  // Don't show indicator if no real changes detected
  if (!unsavedChanges || changeSummary.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
        >
          <AlertCircle size={14} className="mr-1" />
          <span className="hidden sm:inline">{t.unsavedChanges}</span>
          <span className="sm:hidden">Changes</span>
          <Eye size={10} className="ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white z-50" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-600" />
            <h4 className="font-medium text-sm">{t.unsavedChanges}</h4>
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
              <p>{t.lastSync}: {new Date(lastSync).toLocaleString()}</p>
            )}
            {data.lastModified && (
              <p>{t.lastModified}: {new Date(data.lastModified).toLocaleString()}</p>
            )}
          </div>
          
          <p className="text-xs text-gray-600">
            {t.unsavedChangesDesc}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
