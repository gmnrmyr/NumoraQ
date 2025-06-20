
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserTitleBadge } from '@/components/dashboard/UserTitleBadge';
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const NicknameEditor = () => {
  const { user } = useAuth();
  const { saveToCloud } = useFinancialData();
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

  const generateUniqueNickname = async (baseName: string) => {
    let counter = 1;
    let candidateName = baseName;
    
    while (true) {
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', candidateName)
        .neq('id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, nickname is available
        return candidateName;
      }
      
      if (!existingProfile) {
        return candidateName;
      }
      
      // Nickname taken, try with number suffix
      candidateName = `${baseName}${counter}`;
      counter++;
      
      // Safety check to prevent infinite loop
      if (counter > 999) {
        return `${baseName}${Math.floor(Math.random() * 9999)}`;
      }
    }
  };

  const updateNickname = async (newNickname: string) => {
    if (!newNickname.trim() || newNickname === nickname) return;
    
    setUpdatingNickname(true);
    try {
      const trimmedNickname = newNickname.trim();
      
      // Check if nickname is taken and get a unique version
      const finalNickname = await generateUniqueNickname(trimmedNickname);
      
      if (finalNickname !== trimmedNickname) {
        toast({
          title: "Nickname Updated",
          description: `"${trimmedNickname}" was taken, so we set it to "${finalNickname}" instead.`,
        });
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name: finalNickname })
        .eq('id', user?.id);

      if (error) throw error;

      setNickname(finalNickname);
      await loadUserProfile(); // Reload to get the new UID
      
      // Save to cloud after nickname update
      await saveToCloud();
      
      if (finalNickname === trimmedNickname) {
        toast({
          title: "Nickname Updated",
          description: "Your nickname has been updated successfully!"
        });
      }
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
