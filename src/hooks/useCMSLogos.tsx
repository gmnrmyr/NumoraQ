
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogoSettings {
  square_logo_url: string;
  horizontal_logo_url: string;
  vertical_logo_url: string;
  symbol_logo_url: string;
}

export const useCMSLogos = () => {
  const [logos, setLogos] = useState<LogoSettings>({
    square_logo_url: '/lovable-uploads/89c457c6-e2ea-43c9-b3b5-7b544e95d75b.png',
    horizontal_logo_url: '/lovable-uploads/89c457c6-e2ea-43c9-b3b5-7b544e95d75b.png',
    vertical_logo_url: '/lovable-uploads/89c457c6-e2ea-43c9-b3b5-7b544e95d75b.png',
    symbol_logo_url: '/lovable-uploads/89c457c6-e2ea-43c9-b3b5-7b544e95d75b.png'
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
    } catch (error) {
      console.error('Error updating logo:', error);
    }
  };

  return { logos, loading, refetch: fetchLogos, updateLogo };
};
