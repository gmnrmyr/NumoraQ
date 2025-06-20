
import React from 'react';
import { Card, CardContent } from './ui/card';
import { AvatarSelector } from './profile/AvatarSelector';
import { NicknameEditor } from './profile/NicknameEditor';
import { UserPreferences } from './profile/UserPreferences';
import { DegenModeSection } from './profile/DegenModeSection';
import { CloudSyncStatus } from './profile/CloudSyncStatus';
import { AccountLinking } from './profile/AccountLinking';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';

export const UserProfileSection = () => {
  const { data } = useFinancialData();
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <Card className="bg-card border-2 border-border brutalist-card relative">
        <CardContent className="space-y-4">
          {/* Email and Cloud Sync Section */}
          <CloudSyncStatus />

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
        </CardContent>
        
        {/* Bottom right corner title - improved styling */}
        <div className="absolute bottom-3 right-4 text-xs text-muted-foreground font-mono opacity-80 bg-background/50 px-4 py-2 border border-accent/30 rounded shadow-sm backdrop-blur-sm">
          <span className="text-accent font-bold">[ </span>
          USER_INFO_CONFIG_UI
          <span className="text-accent font-bold"> ]</span>
        </div>
      </Card>

      {/* Account Linking Section - Only show for authenticated users */}
      {user && <AccountLinking />}
    </div>
  );
};
