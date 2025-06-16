
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FinancialData } from '../types';

export const useCloudSync = (
  data: FinancialData,
  setData: (data: FinancialData) => void,
  importFromJSON: (jsonData: string) => boolean,
  user: any
) => {
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'saving'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(() => {
    // Initialize from localStorage
    return localStorage.getItem('lastSync');
  });
  const { toast } = useToast();

  // Persist lastSync to localStorage whenever it changes
  useEffect(() => {
    if (lastSync) {
      localStorage.setItem('lastSync', lastSync);
    } else {
      localStorage.removeItem('lastSync');
    }
  }, [lastSync]);

  const loadFromCloud = async (isSilent = false) => {
    if (!user) {
      if (!isSilent) {
        toast({ title: "Error", description: "You must be logged in to load data from the cloud.", variant: "destructive" });
      }
      return;
    }

    setSyncState('loading');
    try {
      const { data: cloudData, error } = await supabase
        .from('financial_data')
        .select('data, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (cloudData && cloudData.data) {
        const success = importFromJSON(JSON.stringify(cloudData.data));
        if (success) {
          // Use server timestamp for consistency across devices
          const serverTimestamp = new Date(cloudData.updated_at).toISOString();
          setLastSync(serverTimestamp);
          if (!isSilent) {
            toast({
              title: "Data loaded from cloud",
              description: "Your data has been synced from the cloud."
            });
          }
        } else {
          throw new Error("Failed to parse cloud data.");
        }
      } else if (!isSilent) {
        toast({
          title: "No cloud data found",
          description: "There is no saved data in the cloud for your account."
        });
      }
    } catch (err: any) {
      if (!isSilent) {
        toast({
          title: "Cloud Load Failed",
          description: err.message || "Could not fetch data from the cloud.",
          variant: "destructive",
        });
      }
      console.error("Cloud load failed:", err);
    } finally {
      setSyncState('idle');
    }
  };

  const saveToCloud = async () => {
    setSyncState('saving');
    const userId = user?.id;
    if (!userId) {
      toast({ title: "Error", description: "No user found for sync.", variant: "destructive" });
      setSyncState('idle');
      return;
    }
    
    try {
      // Create timestamp on client but will be overridden by server
      const now = new Date().toISOString();
      const dataToSave = { ...data, lastModified: now };
      
      const { data: savedData, error: upsertErr } = await supabase
        .from("financial_data")
        .upsert(
          [{ user_id: userId, data: dataToSave as any }],
          { onConflict: "user_id" }
        )
        .select('updated_at')
        .single();

      if (upsertErr) {
        toast({ title: "Cloud Save Failed", description: upsertErr.message, variant: "destructive" });
      } else {
        // Use the server timestamp returned from the upsert and update data state
        const serverTimestamp = savedData?.updated_at || now;
        setLastSync(serverTimestamp);
        
        // Also update the data state with the same timestamp to sync everything
        setData({ ...dataToSave, lastModified: serverTimestamp });
        
        toast({ title: "Saved!", description: "Data synced to cloud." });
      }
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message || String(err), variant: "destructive" });
    } finally {
      setSyncState('idle');
    }
  };

  return {
    syncState,
    lastSync,
    loadFromCloud,
    saveToCloud
  };
};
