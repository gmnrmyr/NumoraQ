
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
    if (!lastSync) {
      // Only show unsaved changes if there's actual user content
      return data.liquidAssets.length > 0 || 
             data.expenses.length > 0 || 
             data.passiveIncome.length > 0 || 
             data.activeIncome.length > 0 ||
             data.debts.length > 0 || 
             data.properties.length > 0 ||
             data.tasks.length > 0 ||
             data.userProfile.name !== "User"; // User changed their name
    }
    
    if (!data.lastModified) return false; // No modifications tracked
    
    const lastSyncTime = new Date(lastSync).getTime();
    const lastModifiedTime = new Date(data.lastModified).getTime();
    const exchangeRateUpdateTime = new Date(data.exchangeRates.lastUpdated).getTime();
    
    // If the last modification is very close to the exchange rate update, it's likely an automatic update
    const isLikelyExchangeRateUpdate = Math.abs(lastModifiedTime - exchangeRateUpdateTime) < 5000; // 5 seconds
    
    // Only consider as unsaved if:
    // 1. Modified more than 30 seconds after sync (bigger buffer)
    // 2. NOT likely an exchange rate update
    // 3. AND there's actual user content
    const hasUserContent = data.liquidAssets.length > 0 || 
                          data.expenses.length > 0 || 
                          data.passiveIncome.length > 0 || 
                          data.activeIncome.length > 0 ||
                          data.debts.length > 0 || 
                          data.properties.length > 0 ||
                          data.tasks.length > 0 ||
                          data.userProfile.name !== "User";
    
    return lastModifiedTime > (lastSyncTime + 30000) && 
           !isLikelyExchangeRateUpdate && 
           hasUserContent;
  };

  const getChangeSummary = () => {
    const changes = [];
    
    if (!lastSync) {
      // Only show unsaved changes message if there's actual user content
      const hasUserContent = data.liquidAssets.length > 0 || 
                            data.expenses.length > 0 || 
                            data.passiveIncome.length > 0 || 
                            data.activeIncome.length > 0 ||
                            data.debts.length > 0 || 
                            data.properties.length > 0 ||
                            data.tasks.length > 0 ||
                            data.userProfile.name !== "User";
      
      if (hasUserContent) {
        changes.push("Data not yet synced to cloud");
      }
      return changes;
    }

    // More specific change detection based on actual user data
    const lastSyncTime = new Date(lastSync).getTime();
    const dataTime = new Date(data.lastModified || 0).getTime();
    const exchangeRateUpdateTime = new Date(data.exchangeRates.lastUpdated).getTime();
    
    // Check if this is likely an exchange rate update
    const isLikelyExchangeRateUpdate = Math.abs(dataTime - exchangeRateUpdateTime) < 5000;
    
    if (dataTime > lastSyncTime + 30000 && !isLikelyExchangeRateUpdate) {
      // Only show changes if there's actual user content
      const hasUserContent = data.liquidAssets.length > 0 || 
                            data.expenses.length > 0 || 
                            data.passiveIncome.length > 0 || 
                            data.activeIncome.length > 0 ||
                            data.debts.length > 0 || 
                            data.properties.length > 0 ||
                            data.tasks.length > 0 ||
                            data.userProfile.name !== "User";
      
      if (hasUserContent) {
        changes.push("Local changes not yet synced");
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
