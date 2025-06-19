
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CMSSettings {
  website_name: string;
  project_wallet: string;
  crypto_donations_enabled: boolean;
  paypal_donations_enabled: boolean;
  donation_goal: number;
  github_link: string;
  discord_link: string;
  twitter_link: string;
}

export const useCMSSettings = () => {
  const [settings, setSettings] = useState<CMSSettings>({
    website_name: 'Open Findash',
    project_wallet: '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD',
    crypto_donations_enabled: true,
    paypal_donations_enabled: true,
    donation_goal: 10000,
    github_link: '',
    discord_link: '',
    twitter_link: ''
  });
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

      const settingsMap: Partial<CMSSettings> = {};
      data?.forEach(({ setting_key, setting_value }) => {
        settingsMap[setting_key as keyof CMSSettings] = setting_value;
      });

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error loading CMS settings:', error);
      toast({
        title: "Error",
        description: "Failed to load CMS settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof CMSSettings, value: any) => {
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
        description: `${key.replace('_', ' ')} has been updated successfully`
      });
    } catch (error) {
      console.error('Error updating CMS setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const updateMultipleSettings = async (updates: Partial<CMSSettings>) => {
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
      console.error('Error updating CMS settings:', error);
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
