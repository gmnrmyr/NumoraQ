
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPreferences } from "@/components/profile/UserPreferences";
import { NicknameEditor } from "@/components/profile/NicknameEditor";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { AccountLinking } from "@/components/profile/AccountLinking";
import { DegenModeSection } from "@/components/profile/DegenModeSection";
import { CloudSyncStatus } from "@/components/profile/CloudSyncStatus";
import { DataManagementSection } from "@/components/DataManagementSection";
import { DonationInterface } from "@/components/dashboard/DonationInterface";
import { PremiumStatusIndicator } from "@/components/dashboard/PremiumStatusIndicator";
import { UserTitleBadge } from "@/components/dashboard/UserTitleBadge";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useUserTitle } from '@/hooks/useUserTitle';

export const UserProfileSection = () => {
  const { data } = useFinancialData();
  const { userTitle } = useUserTitle();
  
  // Check if user has premium themes that might have animations
  const currentTheme = data.userProfile.theme;
  const hasAnimationTheme = ['black-hole', 'dark-dither', 'leras'].includes(currentTheme || '');
  
  // Apply backdrop blur when animation themes are active
  const cardClassName = hasAnimationTheme 
    ? "brutalist-card bg-card/80 backdrop-blur-md border-2 border-border/60" 
    : "brutalist-card";

  return (
    <Card className={cardClassName}>
      <CardHeader className="text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-mono uppercase">
              USER CONFIG
            </CardTitle>
            <UserTitleBadge title={userTitle.title} level={userTitle.level} />
          </div>
          <div className="flex items-center gap-2">
            <PremiumStatusIndicator />
            <CloudSyncStatus />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Settings</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NicknameEditor />
              <AvatarSelector />
            </div>
            <AccountLinking />
            <DegenModeSection />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <UserPreferences />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DataManagementSection />
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            <DonationInterface />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
