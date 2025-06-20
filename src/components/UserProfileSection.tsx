
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AvatarSelector } from './profile/AvatarSelector';
import { NicknameEditor } from './profile/NicknameEditor';
import { UserPreferences } from './profile/UserPreferences';
import { DegenModeSection } from './profile/DegenModeSection';
import { CloudSyncStatus } from './profile/CloudSyncStatus';
import { AccountLinking } from './profile/AccountLinking';
import { DataManagementSection } from './DataManagementSection';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, ChevronDown, Cloud, HardDrive } from 'lucide-react';

export const UserProfileSection = () => {
  const { data } = useFinancialData();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="bg-card border-2 border-border brutalist-card relative">
        <CardContent className="space-y-6">
          {/* Toggle Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 p-2"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="font-mono text-sm">USER_INFO_CONFIG_UI</span>
            </Button>
            
            {/* Cloud Sync Status - Always visible */}
            <div className="flex items-center gap-2">
              <CloudSyncStatus />
              {!isExpanded && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <HardDrive size={12} />
                  <Cloud size={12} />
                </div>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <>
              {/* Profile Configuration Panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Avatar Selection */}
                  <AvatarSelector nickname={data.userProfile.name || ''} />
                  
                  <div className="flex-1 space-y-3">
                    {/* Nickname Section */}
                    <NicknameEditor />

                    {/* Currency and Language Selectors */}
                    <UserPreferences />
                  </div>
                </div>

                {/* Degen Mode Section */}
                <DegenModeSection />

                <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
                  👤 <strong>Profile:</strong> Customize your dashboard experience and preferences.
                </div>
              </div>

              {/* Account Linking Panel - Only show for authenticated users */}
              {user && (
                <div className="border-t border-border pt-4">
                  <AccountLinking />
                </div>
              )}

              {/* Data Management Panel */}
              <div className="border-t border-border pt-4">
                <DataManagementSection />
              </div>
            </>
          )}
        </CardContent>
        
        {/* Bottom right corner title - improved styling */}
        <div className="absolute bottom-3 right-4 text-xs text-muted-foreground font-mono opacity-80 bg-background/50 px-4 py-2 border border-accent/30 rounded shadow-sm backdrop-blur-sm">
          <span className="text-accent font-bold">[ </span>
          USER_INFO_CONFIG_UI
          <span className="text-accent font-bold"> ]</span>
        </div>
      </Card>
    </div>
  );
};
