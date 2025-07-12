
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AvatarSelector } from './profile/AvatarSelector';
import { NicknameEditor } from './profile/NicknameEditor';
import { UserPreferences } from './profile/UserPreferences';
import { DegenModeSection } from './profile/DegenModeSection';
import { CloudSyncStatus } from './profile/CloudSyncStatus';
import { AccountLinking } from './profile/AccountLinking';
import { WalletLinking } from './profile/WalletLinking';
import { DataManagementSection } from './DataManagementSection';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { ChevronRight, ChevronDown, Cloud, Save, Mail, LogOut, LogIn, UserPlus } from 'lucide-react';

export const UserProfileSection = () => {
  const { data, saveToCloud, syncState, lastSync } = useFinancialData();
  const { user, signOut, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCloudSave = () => {
    if (user) {
      saveToCloud();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      window.location.href = '/auth';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return t.neverSynced;
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return t.justNow;
    if (diffMinutes < 60) return `${diffMinutes}m ${t.updatedAgo}`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ${t.updatedAgo}`;
    
    // Format as DD/MM/YYYY, HH:MM:SS with current timezone
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const truncateEmail = (email: string, maxLength: number = 15) => {
    if (email.length <= maxLength) return email;
    return email.substring(0, maxLength - 3) + '...';
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
              <span className="font-mono text-sm">{t.userInfoConfigUI}</span>
            </Button>
            
            {/* When collapsed, show functional cloud save button and user info */}
            {!isExpanded && user && (
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 min-w-0">
                {/* User info - stacked on mobile, responsive layout */}
                <div className="flex items-center gap-2 min-w-0 order-2 sm:order-1">
                  <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {truncateEmail(user.email || '', window.innerWidth < 640 ? 12 : 15)}
                  </span>
                  <Button 
                    onClick={handleLogout} 
                    size="sm" 
                    variant="outline" 
                    className="brutalist-button text-xs flex-shrink-0"
                  >
                    <LogOut size={12} />
                  </Button>
                </div>
                
                {/* Cloud save button */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button
                    onClick={handleCloudSave}
                    disabled={syncState === 'saving' || syncState === 'loading'}
                    variant="outline"
                    size="sm"
                    className="brutalist-button flex items-center gap-1"
                    title={`Save to cloud - Last sync: ${formatLastSync(lastSync)}`}
                  >
                    {syncState === 'saving' ? (
                      <Save size={14} className="animate-spin" />
                    ) : (
                      <Cloud size={14} />
                    )}
                    <span className="text-xs hidden sm:inline">{t.save}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* When collapsed and user is not logged in, show login/register buttons */}
            {!isExpanded && !user && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleLogin}
                  size="sm"
                  variant="outline"
                  className="brutalist-button text-xs flex items-center gap-1"
                >
                  <LogIn size={12} />
                  <span className="hidden sm:inline">{t.login}</span>
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth'}
                  size="sm"
                  variant="default"
                  className="brutalist-button text-xs flex items-center gap-1"
                >
                  <UserPlus size={12} />
                  <span className="hidden sm:inline">{t.register}</span>
                </Button>
              </div>
            )}

            {/* When expanded and user is not logged in, show login/register buttons */}
            {isExpanded && !user && (
              <div className="border-t border-border pt-4">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleLogin}
                    size="sm"
                    variant="outline"
                    className="brutalist-button text-xs flex items-center gap-1"
                  >
                    <LogIn size={12} />
                    <span className="hidden sm:inline">{t.login}</span>
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/auth'}
                    size="sm"
                    variant="default"
                    className="brutalist-button text-xs flex items-center gap-1"
                  >
                    <UserPlus size={12} />
                    <span className="hidden sm:inline">{t.register}</span>
                  </Button>
                </div>
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
                  👤 <strong>{t.userProfile}:</strong> {t.profileCustomizeDesc}
                </div>
              </div>

              {/* Account Linking Panel - Only show for authenticated users */}
              {user && (
                <div className="border-t border-border pt-4">
                  <AccountLinking />
                </div>
              )}

              {/* Wallet Linking Panel - Only show for authenticated users */}
              {user && (
                <div className="border-t border-border pt-4">
                  <WalletLinking 
                    onWalletLinked={(wallet) => {
                      // Could add analytics or notifications here
                      console.log('Wallet linked:', wallet);
                    }}
                    onWalletUnlinked={(type) => {
                      console.log('Wallet unlinked:', type);
                    }}
                  />
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
