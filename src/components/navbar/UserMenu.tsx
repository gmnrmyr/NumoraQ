
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState<string>('');

  useEffect(() => {
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

  const displayName = profileName || user?.email || "User";

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 brutalist-button">
          <Menu size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-2 border-border z-50">
        {user && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 font-mono">
              <User size={16} />
              <span className="truncate">{displayName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
          </>
        )}
        
        <DropdownMenuItem 
          onClick={handleAuthAction}
          className="text-primary hover:text-primary-foreground hover:bg-primary font-mono"
        >
          {user ? <LogOut size={16} className="mr-2" /> : <LogIn size={16} className="mr-2" />}
          {user ? 'Sign Out' : 'Sign In'}
        </DropdownMenuItem>
        
        {!user && (
          <p className="text-xs text-muted-foreground font-mono text-center px-2 py-1">
            Demo Mode - Sign in for cloud sync
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
