
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/securityUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithSolana: () => Promise<{ error: any }>;
  signInWithDiscord: () => Promise<{ error: any }>;
  linkAccount: (provider: 'solana' | 'discord') => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get the correct redirect URL based on environment
const getRedirectUrl = () => {
  // Check if we're in development vs production
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    // In development, use the actual local URL
    return window.location.origin;
  } else {
    // In production, always use the production domain
    // Check if we're on a Lovable preview domain or custom domain
    const hostname = window.location.hostname;
    
    if (hostname.includes('lovable.app')) {
      // Use the current Lovable preview URL
      return window.location.origin;
    } else {
      // For custom domains, use the current origin
      return window.location.origin;
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        secureLog('Auth state change:', { event, hasSession: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      secureLog('Initial session check:', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    secureLog('Attempting sign in');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      secureLog('Sign in error:', { errorMessage: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      secureLog('Sign in successful');
    }
    
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    secureLog('Attempting sign up');
    const redirectUrl = getRedirectUrl();
    
    secureLog('Using redirect URL:', { redirectUrl });
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectUrl}/auth?confirmed=true`,
        data: {
          email: email
        }
      }
    });
    
    if (error) {
      secureLog('Sign up error:', { errorMessage: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      secureLog('Sign up initiated successfully');
      toast({
        title: "Success",
        description: "Check your email for the confirmation link! Make sure to check your spam folder.",
        duration: 8000,
      });
    }
    
    return { error };
  };

  const signInWithSolana = async () => {
    secureLog('Attempting Solana sign in');
    const redirectUrl = getRedirectUrl();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github' as any,
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      secureLog('Solana sign in error:', { errorMessage: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      secureLog('Solana sign in initiated');
    }
    
    return { error };
  };

  const signInWithDiscord = async () => {
    secureLog('Attempting Discord sign in');
    const redirectUrl = getRedirectUrl();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      secureLog('Discord sign in error:', { errorMessage: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      secureLog('Discord sign in initiated');
    }
    
    return { error };
  };

  const linkAccount = async (provider: 'solana' | 'discord') => {
    secureLog(`Attempting to link ${provider} account`);
    
    const providerMap = {
      solana: 'github' as any,
      discord: 'discord'
    };
    
    const { error } = await supabase.auth.linkIdentity({
      provider: providerMap[provider],
    });
    
    if (error) {
      secureLog(`${provider} link error:`, { errorMessage: error.message });
      toast({
        title: "Error",
        description: `Failed to link ${provider} account: ${error.message}`,
        variant: "destructive",
      });
    } else {
      secureLog(`${provider} link initiated`);
      toast({
        title: "Success",
        description: `${provider} account linked successfully!`,
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    secureLog('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      secureLog('Sign out error:', { errorMessage: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signOut,
      signInWithEmail,
      signUpWithEmail,
      signInWithSolana,
      signInWithDiscord,
      linkAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
