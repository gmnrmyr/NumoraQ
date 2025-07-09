import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { FinancialData } from '@/contexts/financial-data/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BackupItem {
  id: string;
  name: string;
  timestamp: string;
  data: FinancialData;
  size: number;
  isAutomatic: boolean;
}

export const useBackupManager = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load backups from cloud when user changes
  useEffect(() => {
    const loadBackups = async () => {
      if (!user) {
        setBackups([]);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_backups')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading backups:', error);
          toast({
            title: "Error Loading Backups",
            description: "Failed to load backups from cloud",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const processedBackups = data.map((backup: any) => ({
            id: backup.id,
            name: backup.backup_name,
            timestamp: backup.created_at,
            data: backup.backup_data,
            size: JSON.stringify(backup.backup_data).length,
            isAutomatic: backup.backup_type === 'automatic'
          }));
          setBackups(processedBackups);
        }
      } catch (error) {
        console.error('Error loading backups:', error);
        toast({
          title: "Error Loading Backups",
          description: "Failed to load backups from cloud",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBackups();
  }, [user]);

  const saveBackupsToCloud = useCallback(async (backupData: FinancialData, name: string, isAutomatic: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create backups",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: newBackup, error } = await supabase
        .from('user_backups')
        .insert({
          user_id: user.id,
          backup_name: name,
          backup_data: backupData,
          backup_type: isAutomatic ? 'automatic' : 'manual'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating backup:', error);
        toast({
          title: "Backup Failed",
          description: "Failed to create backup in cloud",
          variant: "destructive",
        });
        return null;
      }

      return newBackup;
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to create backup in cloud",
        variant: "destructive",
      });
      return null;
    }
  }, [user]);

  const createBackup = useCallback(async (data: FinancialData, name?: string, isAutomatic = false) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create backups",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      const backupName = name || `Manual Backup ${new Date().toLocaleString()}`;
      const timestamp = new Date().toISOString();
      const backupData = { ...data, lastModified: timestamp };
      
      const newBackup = await saveBackupsToCloud(backupData, backupName, isAutomatic);
      
      if (newBackup) {
        const backupItem: BackupItem = {
          id: newBackup.id,
          name: newBackup.backup_name,
          timestamp: newBackup.created_at,
          data: newBackup.backup_data,
          size: JSON.stringify(newBackup.backup_data).length,
          isAutomatic: newBackup.backup_type === 'automatic'
        };
        
        // Update local state
        setBackups(prev => [backupItem, ...prev]);
        
        toast({
          title: "Backup Created",
          description: `${isAutomatic ? 'Automatic' : 'Manual'} backup saved successfully`,
        });
        
        return newBackup.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to create backup",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, saveBackupsToCloud]);

  const restoreBackup = useCallback((backupId: string): FinancialData | null => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) {
      toast({
        title: "Restore Failed",
        description: "Backup not found",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Backup Restored",
      description: `Data restored from ${backup.name}`,
    });

    return backup.data;
  }, [backups]);

  const deleteBackup = useCallback(async (backupId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete backups",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_backups')
        .delete()
        .eq('id', backupId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting backup:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete backup",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setBackups(prev => prev.filter(b => b.id !== backupId));
      
      toast({
        title: "Backup Deleted",
        description: "Backup removed successfully",
      });
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete backup",
        variant: "destructive",
      });
    }
  }, [user]);

  const getBackupStats = useCallback(() => {
    const manual = backups.filter(b => !b.isAutomatic);
    const automatic = backups.filter(b => b.isAutomatic);
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
    
    return {
      totalBackups: backups.length,
      manualBackups: manual.length,
      automaticBackups: automatic.length,
      totalSize: Math.round(totalSize / 1024), // KB
      latestBackup: backups.length > 0 ? backups[0].timestamp : null
    };
  }, [backups]);

  const formatBackupSize = useCallback((size: number) => {
    const kb = size / 1024;
    return kb < 1024 ? `${Math.round(kb)} KB` : `${Math.round(kb / 1024)} MB`;
  }, []);

  return {
    backups,
    isLoading,
    createBackup,
    restoreBackup,
    deleteBackup,
    getBackupStats,
    formatBackupSize
  };
}; 