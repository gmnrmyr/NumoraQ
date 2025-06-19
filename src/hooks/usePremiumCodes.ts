
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PremiumCode {
  id: string;
  code: string;
  code_type: '1year' | '5years' | 'lifetime';
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  created_by: string | null;
  used_by: string | null;
  used_at: string | null;
  user_email: string | null;
}

interface PremiumStatus {
  id: string;
  user_id: string;
  is_premium: boolean;
  premium_type: string | null;
  activated_at: string | null;
  expires_at: string | null;
  activated_code: string | null;
}

export const usePremiumCodes = () => {
  const [codes, setCodes] = useState<PremiumCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Error loading premium codes:', error);
      toast({
        title: "Error",
        description: "Failed to load premium codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (codeType: '1year' | '5years' | 'lifetime') => {
    try {
      const code = `DEGEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      let expiresAt = null;
      if (codeType !== 'lifetime') {
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + (codeType === '1year' ? 1 : 5));
        expiresAt = expiry.toISOString();
      }

      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('premium_codes')
        .insert({
          code,
          code_type: codeType,
          expires_at: expiresAt,
          created_by: user.user?.id
        });

      if (error) throw error;

      await loadCodes();
      
      toast({
        title: "Code Generated",
        description: `Premium code ${code} (${codeType}) created successfully`
      });

      return code;
    } catch (error) {
      console.error('Error generating premium code:', error);
      toast({
        title: "Error",
        description: "Failed to generate premium code",
        variant: "destructive"
      });
      return null;
    }
  };

  const activateCode = async (code: string, userEmail?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Error",
          description: "You must be logged in to activate a code",
          variant: "destructive"
        });
        return false;
      }

      // Check if code exists and is active
      const { data: codeData, error: codeError } = await supabase
        .from('premium_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .is('used_by', null)
        .single();

      if (codeError || !codeData) {
        toast({
          title: "Invalid Code",
          description: "Code not found or already used",
          variant: "destructive"
        });
        return false;
      }

      // Calculate expiry based on code type
      const now = new Date();
      let expiresAt: Date | null = null;
      
      switch (codeData.code_type) {
        case '1year':
          expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          break;
        case '5years':
          expiresAt = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
          break;
        case 'lifetime':
          expiresAt = new Date(2099, 11, 31);
          break;
      }

      // Update premium code as used
      const { error: updateError } = await supabase
        .from('premium_codes')
        .update({
          used_by: user.user.id,
          used_at: now.toISOString(),
          user_email: userEmail || user.user.email
        })
        .eq('code', code);

      if (updateError) throw updateError;

      // Update user premium status
      const { error: statusError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: user.user.id,
          is_premium: true,
          premium_type: codeData.code_type,
          activated_at: now.toISOString(),
          expires_at: expiresAt?.toISOString(),
          activated_code: code
        });

      if (statusError) throw statusError;

      await loadCodes();
      
      toast({
        title: "Code Activated",
        description: `Premium access activated successfully (${codeData.code_type})`
      });

      return true;
    } catch (error) {
      console.error('Error activating premium code:', error);
      toast({
        title: "Error",
        description: "Failed to activate premium code",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCode = async (codeId: string) => {
    try {
      const { error } = await supabase
        .from('premium_codes')
        .delete()
        .eq('id', codeId);

      if (error) throw error;

      await loadCodes();
      
      toast({
        title: "Code Deleted",
        description: "Premium code deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting premium code:', error);
      toast({
        title: "Error",
        description: "Failed to delete premium code",
        variant: "destructive"
      });
    }
  };

  const getCodeStats = () => {
    const total = codes.length;
    const used = codes.filter(c => c.used_by !== null).length;
    const active = total - used;
    
    return { total, used, active };
  };

  return {
    codes,
    loading,
    generateCode,
    activateCode,
    deleteCode,
    getCodeStats,
    reload: loadCodes
  };
};
