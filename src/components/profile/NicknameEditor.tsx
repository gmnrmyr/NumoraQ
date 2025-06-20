
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserTitleBadge } from '@/components/dashboard/UserTitleBadge';

export const NicknameEditor = () => {
  const { user } = useAuth();
  const { data, updateUserProfile } = useFinancialData();
  const [nickname, setNickname] = useState(data.userProfile.name || '');
  const [currentUID, setCurrentUID] = useState('');
  const [updatingNickname, setUpdatingNickname] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadUserUID();
    }
  }, [user]);

  const loadUserUID = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_uid')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setCurrentUID(profile?.user_uid || '');
    } catch (error) {
      console.error('Error loading user UID:', error);
    }
  };

  const updateNickname = async (newNickname: string) => {
    if (!newNickname.trim() || newNickname === nickname) return;
    
    setUpdatingNickname(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: newNickname.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      setNickname(newNickname.trim());
      updateUserProfile({ name: newNickname.trim() });
      await loadUserUID(); // Reload UID as it's auto-generated from name
      
      toast({
        title: "Nickname Updated",
        description: "Your nickname and UID have been updated successfully!"
      });
    } catch (error) {
      console.error('Error updating nickname:', error);
      toast({
        title: "Error",
        description: "Failed to update nickname",
        variant: "destructive"
      });
    } finally {
      setUpdatingNickname(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div title="Nickname">
        <User size={14} className="text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={() => updateNickname(nickname)}
          onKeyDown={(e) => e.key === 'Enter' && updateNickname(nickname)}
          placeholder="Enter your nickname"
          className="font-mono bg-input border-2 border-border"
          disabled={updatingNickname}
        />
        {currentUID && (
          <Badge variant="outline" className="font-mono text-xs px-2 py-1">
            UID: {currentUID}
          </Badge>
        )}
      </div>
      <UserTitleBadge />
    </div>
  );
};
