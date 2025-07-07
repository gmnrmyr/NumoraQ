
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LogoSettings {
  square_logo_url: string;
  horizontal_logo_url: string;
  vertical_logo_url: string;
  symbol_logo_url: string;
}

export const useCMSLogos = () => {
  const [logos, setLogos] = useState<LogoSettings>({
    square_logo_url: '/favicon.svg',
    horizontal_logo_url: '/favicon.svg',
    vertical_logo_url: '/favicon.svg',
    symbol_logo_url: '/favicon.svg'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['square_logo_url', 'horizontal_logo_url', 'vertical_logo_url', 'symbol_logo_url']);

      if (error) throw error;

      if (data) {
        const logoSettings: Partial<LogoSettings> = {};
        data.forEach(item => {
          logoSettings[item.setting_key as keyof LogoSettings] = item.setting_value as string;
        });
        setLogos(prev => ({ ...prev, ...logoSettings }));
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (logoType: keyof LogoSettings, url: string) => {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          setting_key: logoType,
          setting_value: url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setLogos(prev => ({ ...prev, [logoType]: url }));
      
      toast({
        title: "Logo Updated",
        description: `${logoType.replace(/_/g, ' ')} has been updated successfully`
      });
    } catch (error) {
      console.error('Error updating logo:', error);
      toast({
        title: "Error",
        description: "Failed to update logo",
        variant: "destructive"
      });
    }
  };

  return { logos, loading, refetch: fetchLogos, updateLogo };
};
