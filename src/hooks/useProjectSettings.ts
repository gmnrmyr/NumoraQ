
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectSettings {
  project_name: string;
  project_description: string;
  donation_wallet_evm: string;
  donation_wallet_solana: string;
  donation_wallet_btc: string;
  donation_wallet_bch: string;
  donation_paypal_email: string;
  square_logo_url: string;
  horizontal_logo_url: string;
  vertical_logo_url: string;
  symbol_logo_url: string;
  website_version: string;
  upcoming_features: string;
  color_scheme: string;
}

export const useProjectSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProjectSettings>({
    project_name: 'OPEN FINDASH',
    project_description: 'Financial Dashboard & Crypto Portfolio Tracker',
    donation_wallet_evm: '',
    donation_wallet_solana: '',
    donation_wallet_btc: '',
    donation_wallet_bch: '',
    donation_paypal_email: '',
    square_logo_url: '',
    horizontal_logo_url: '',
    vertical_logo_url: '',
    symbol_logo_url: '',
    website_version: '1.0.0',
    upcoming_features: '',
    color_scheme: 'default'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*');

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading project settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Partial<ProjectSettings> = {};
        data.forEach(row => {
          const key = row.setting_key as keyof ProjectSettings;
          if (key in settings) {
            settingsMap[key] = row.setting_value as string;
          }
        });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error('Error loading project settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof ProjectSettings, value: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        });

      if (error) {
        console.error('Error updating setting:', error);
        return;
      }

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const updateMultipleSettings = async (updates: Partial<ProjectSettings>) => {
    if (!user) return;

    try {
      const settingsToUpsert = Object.entries(updates).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      const { error } = await supabase
        .from('cms_settings')
        .upsert(settingsToUpsert);

      if (error) {
        console.error('Error updating settings:', error);
        return;
      }

      setSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return {
    settings,
    loading,
    updateSetting,
    updateMultipleSettings,
    refresh: loadSettings
  };
};
