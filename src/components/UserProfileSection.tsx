
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
import { ChevronRight, ChevronDown, Cloud, Save } from 'lucide-react';

export const UserProfileSection = () => {
  const { data, saveToCloud, syncState, lastSync } = useFinancialData();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCloudSave = () => {
    if (user) {
      saveToCloud();
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never synced';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

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
            
            {/* When collapsed, show functional cloud save button and user info */}
            {!isExpanded && user && (
              <div className="flex items-center gap-2">
                <CloudSyncStatus />
                <Button
                  onClick={handleCloudSave}
                  disabled={syncState === 'saving' || syncState === 'loading'}
                  variant="outline"
                  size="sm"
                  className="brutalist-button"
                  title={`Save to cloud - Last sync: ${formatLastSync(lastSync)}`}
                >
                  {syncState === 'saving' ? (
                    <Save size={14} className="animate-spin" />
                  ) : (
                    <Cloud size={14} />
                  )}
                </Button>
              </div>
            )}
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
      </Card>
    </div>
  );
};
