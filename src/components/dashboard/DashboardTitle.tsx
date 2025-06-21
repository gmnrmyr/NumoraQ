
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const DashboardTitle = () => {
  const { user } = useAuth();
  const [profileName, setProfileName] = React.useState<string>('');

  // Load user profile name
  React.useEffect(() => {
    const loadProfileName = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

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

  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground brutalist-heading">
        FINANCIAL COMMAND CENTER
      </h1>
      {profileName && (
        <div className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap">
          <span className="text-accent">Welcome back, {profileName}</span>
        </div>
      )}
      <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-wider px-4">
        COMPLETE OVERSIGHT // DATA DRIVEN DECISIONS
      </p>
    </div>
  );
};
