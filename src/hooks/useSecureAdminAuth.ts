
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  is_admin: boolean;
  admin_level: 'super' | 'standard';
}

export const useSecureAdminAuth = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminUser(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Check session expiry every minute
    const interval = setInterval(() => {
      if (sessionExpiry && new Date() > sessionExpiry) {
        handleSessionExpiry();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check if user has admin role in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, admin_role, admin_level')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const isUserAdmin = profile?.admin_role === true;
      
      if (isUserAdmin) {
        const adminUserData: AdminUser = {
          id: user.id,
          email: user.email || '',
          is_admin: true,
          admin_level: profile.admin_level || 'standard'
        };
        
        setAdminUser(adminUserData);
        setIsAdmin(true);
        // Set session expiry to 30 minutes
        setSessionExpiry(new Date(Date.now() + 30 * 60 * 1000));
        
        toast({
          title: "Admin Access Granted",
          description: `Welcome, ${profile.name || 'Admin'}. Session expires in 30 minutes.`,
        });
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminUser(null);
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpiry = () => {
    setIsAdmin(false);
    setAdminUser(null);
    setSessionExpiry(null);
    
    toast({
      title: "Admin Session Expired",
      description: "Please re-authenticate to continue admin operations.",
      variant: "destructive"
    });
  };

  const refreshAdminSession = async () => {
    if (!isAdmin) return false;
    
    await checkAdminStatus();
    return true;
  };

  const logAdminAction = async (action: string, details?: any) => {
    if (!adminUser) return;

    try {
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminUser.id,
          action,
          details: details ? JSON.stringify(details) : null,
          timestamp: new Date().toISOString(),
          ip_address: 'client', // In production, get from server
        });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return {
    isAdmin,
    adminUser,
    loading,
    sessionExpiry,
    checkAdminStatus,
    refreshAdminSession,
    logAdminAction,
    timeRemaining: sessionExpiry ? Math.max(0, sessionExpiry.getTime() - Date.now()) : 0
  };
};
