
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, LogOut, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const CloudSyncStatus = () => {
  const { user, signOut } = useAuth();
  const { syncState, lastSync } = useFinancialData();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const truncateEmail = (email: string) => {
    if (email.length <= 20) return email;
    return email.substring(0, 17) + '...';
  };

  const getSyncIcon = () => {
    if (syncState === 'saving') return <CloudOff className="animate-spin" size={14} />;
    if (syncState === 'loading') return <CloudOff className="animate-spin" size={14} />;
    if (syncState === 'error') return <CloudOff size={14} className="text-red-500" />;
    return <Cloud size={14} className="text-green-500" />;
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

  if (!user) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Mail size={14} className="text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground font-mono truncate">
          {truncateEmail(user.email)}
        </span>
        <div className="flex items-center gap-1" title={`Last sync: ${formatLastSync(lastSync)}`}>
          {getSyncIcon()}
        </div>
      </div>
      
      <Button 
        onClick={handleLogout} 
        size="sm" 
        variant="outline" 
        className="brutalist-button text-xs flex-shrink-0 ml-2"
      >
        <LogOut size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};
