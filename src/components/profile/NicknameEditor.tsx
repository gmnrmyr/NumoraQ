
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserTitleBadge } from '@/components/dashboard/UserTitleBadge';

export const NicknameEditor = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [currentUID, setCurrentUID] = useState('');
  const [updatingNickname, setUpdatingNickname] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, user_uid')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setNickname(profile?.name || '');
      setCurrentUID(profile?.user_uid || '');
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkNicknameAvailability = async (newNickname: string) => {
    if (!newNickname.trim()) return false;
    
    // Check if another user already has this nickname
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', newNickname.trim())
      .neq('id', user?.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      throw error;
    }

    return !existingProfile; // Returns true if available, false if taken
  };

  const updateNickname = async (newNickname: string) => {
    if (!newNickname.trim() || newNickname === nickname) return;
    
    setUpdatingNickname(true);
    try {
      // Check if nickname is available
      const isAvailable = await checkNicknameAvailability(newNickname);
      
      if (!isAvailable) {
        toast({
          title: "Nickname Unavailable",
          description: "This nickname is already taken. Please choose another one.",
          variant: "destructive"
        });
        setNickname(nickname); // Reset to previous value
        setUpdatingNickname(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name: newNickname.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      setNickname(newNickname.trim());
      await loadUserProfile(); // Reload to get the new UID
      
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
      setNickname(nickname); // Reset to previous value
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
          <Badge 
            variant="outline" 
            className="font-mono text-xs px-2 py-1 cursor-help"
            title="Internal user identifier for system purposes"
          >
            UID: {currentUID}
          </Badge>
        )}
      </div>
      <UserTitleBadge />
    </div>
  );
};
