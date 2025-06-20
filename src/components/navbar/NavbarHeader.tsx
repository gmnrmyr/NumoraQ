import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { useCMSLogos } from "@/hooks/useCMSLogos";
import { UserSettingsPanel } from "@/components/navbar/UserSettingsPanel";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
interface NavbarHeaderProps {
  onTitleClick: () => void;
}
export const NavbarHeader = ({
  onTitleClick
}: NavbarHeaderProps) => {
  const {
    logos
  } = useCMSLogos();
  const {
    user
  } = useAuth();
  const [profileName, setProfileName] = React.useState<string>('');

  // Load user profile name
  React.useEffect(() => {
    const loadProfileName = async () => {
      if (user) {
        try {
          const {
            data: profile,
            error
          } = await supabase.from('profiles').select('name').eq('id', user.id).single();
          if (!error && profile?.name) {
            setProfileName(profile.name);
          }
        } catch (error) {
          console.error('Error loading profile name:', error);
        }
      }
    };
    loadProfileName();
  }, [user]);
  return <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onTitleClick}>
          <img src={logos.horizontal_logo_url} alt="Open Findash Logo" className="h-6 sm:h-7 md:h-8 w-auto object-contain flex-shrink-0 min-w-0" style={{
          maxWidth: '180px'
        }} />
        </div>
        {profileName}
      </div>

      {/* Universal Settings Button */}
      <div className="flex items-center">
        <UserSettingsPanel />
      </div>
    </div>;
};