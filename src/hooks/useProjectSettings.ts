
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProjectSettings {
  website_name: string;
  project_wallet_evm: string;
  project_wallet_solana: string;
  project_wallet_btc: string;
  project_wallet_bch: string;
  project_paypal_email: string;
  square_logo_url: string;
  horizontal_logo_url: string;
  vertical_logo_url: string;
  symbol_logo_url: string;
  version: string;
  upcoming_features_text: string;
  main_color_scheme: string;
}

const defaultSettings: ProjectSettings = {
      website_name: 'Numoraq',
  project_wallet_evm: '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD',
  project_wallet_solana: '',
  project_wallet_btc: '',
  project_wallet_bch: '',
  project_paypal_email: '',
      square_logo_url: '/favicon.svg',
    horizontal_logo_url: '/favicon.svg',
    vertical_logo_url: '/favicon.svg',
    symbol_logo_url: '/favicon.svg',
  version: 'v2.0.0',
  upcoming_features_text: 'Exciting new features coming soon!',
  main_color_scheme: 'default'
};

export const useProjectSettings = () => {
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const loadedSettings = { ...defaultSettings };
      data?.forEach(({ setting_key, setting_value }) => {
        if (setting_key in loadedSettings) {
          // Handle JSON string values from database
          let parsedValue = setting_value;
          if (typeof setting_value === 'string' && setting_value.startsWith('"') && setting_value.endsWith('"')) {
            parsedValue = setting_value.slice(1, -1); // Remove quotes
          }
          (loadedSettings as any)[setting_key] = parsedValue;
        }
      });

      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading project settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof ProjectSettings, value: string) => {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Setting Updated",
        description: `${key.replace(/_/g, ' ')} has been updated successfully`
      });
    } catch (error) {
      console.error('Error updating project setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const updateMultipleSettings = async (updates: Partial<ProjectSettings>) => {
    try {
      const upserts = Object.entries(updates).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('cms_settings')
        .upsert(upserts);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Settings Updated",
        description: "Multiple settings updated successfully"
      });
    } catch (error) {
      console.error('Error updating project settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    loading,
    updateSetting,
    updateMultipleSettings,
    reload: loadSettings
  };
};
