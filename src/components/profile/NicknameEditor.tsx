
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserTitleBadge } from '@/components/dashboard/UserTitleBadge';

export const NicknameEditor = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [currentUID, setCurrentUID] = useState('');
  const [updatingNickname, setUpdatingNickname] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  
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
    if (!newNickname.trim() || newNickname === nickname) {
      setValidationState('idle');
      return true;
    }
    
    setIsChecking(true);
    setValidationState('checking');
    
    try {
      // Check if another user already has this nickname
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', newNickname.trim())
        .neq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking nickname availability:', error);
        setValidationState('error');
        return false;
      }

      const isAvailable = !existingProfile;
      setValidationState(isAvailable ? 'available' : 'taken');
      return isAvailable;
    } catch (error) {
      console.error('Error checking nickname availability:', error);
      setValidationState('error');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleNicknameChange = async (newValue: string) => {
    setNickname(newValue);
    
    // Debounce the availability check
    setTimeout(() => {
      checkNicknameAvailability(newValue);
    }, 500);
  };

  const updateNickname = async () => {
    const trimmedNickname = nickname.trim();
    
    if (!trimmedNickname || trimmedNickname === currentUID) {
      return;
    }
    
    setUpdatingNickname(true);
    
    try {
      // Final availability check before saving
      const isAvailable = await checkNicknameAvailability(trimmedNickname);
      
      if (!isAvailable) {
        toast({
          title: "Nickname Unavailable",
          description: "This nickname is already taken. Please choose another one.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name: trimmedNickname })
        .eq('id', user?.id);

      if (error) throw error;

      await loadUserProfile(); // Reload to get the new UID
      setValidationState('idle');
      
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

  const getValidationIcon = () => {
    switch (validationState) {
      case 'checking':
        return <div className="animate-spin w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full" />;
      case 'available':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'taken':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'error':
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationState) {
      case 'available':
        return 'Available';
      case 'taken':
        return 'Already taken';
      case 'error':
        return 'Check failed';
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div title="Nickname">
        <User size={14} className="text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1">
          <Input
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            onBlur={updateNickname}
            onKeyDown={(e) => e.key === 'Enter' && updateNickname()}
            placeholder="Enter your nickname"
            className="font-mono bg-input border-2 border-border pr-8"
            disabled={updatingNickname}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {getValidationIcon()}
          </div>
        </div>
        {validationState !== 'idle' && validationState !== 'checking' && (
          <div className={`text-xs font-mono ${
            validationState === 'available' ? 'text-green-500' : 
            validationState === 'taken' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            {getValidationMessage()}
          </div>
        )}
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
