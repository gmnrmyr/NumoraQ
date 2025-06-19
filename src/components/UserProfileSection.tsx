
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, DollarSign, Globe, LogOut } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { EditableValue } from './ui/editable-value';

export const UserProfileSection = () => {
  const { data, updateUserProfile } = useFinancialData();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Card className="bg-card border-2 border-border brutalist-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 font-mono uppercase">
          <User size={16} />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-muted text-muted-foreground font-mono text-xl">
              {data.userProfile.name ? data.userProfile.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              <EditableValue
                value={data.userProfile.name}
                onSave={(value) => updateUserProfile({ name: String(value) })}
                type="text"
                placeholder="Your name"
                className="font-medium bg-input border-2 border-border font-mono"
              />
            </div>
            {user && (
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">{user.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="brutalist-button text-xs"
                >
                  <LogOut size={12} className="mr-1" />
                  Logout
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-muted-foreground" />
              <EditableValue
                value={data.userProfile.defaultCurrency}
                onSave={(value) => updateUserProfile({ defaultCurrency: String(value) })}
                type="text"
                className="font-mono bg-input border-2 border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-muted-foreground" />
              <EditableValue
                value={data.userProfile.language}
                onSave={(value) => updateUserProfile({ language: String(value) })}
                type="text"
                className="font-mono bg-input border-2 border-border"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
          👤 <strong>Profile:</strong> Customize your dashboard experience and preferences.
        </div>
      </CardContent>
    </Card>
  );
};
