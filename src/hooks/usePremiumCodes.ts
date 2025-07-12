
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
      setCodes((data || []) as PremiumCode[]);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Use the edge function to generate code
      const response = await fetch(`https://hcnoxyfztviuwkiysitm.supabase.co/functions/v1/premium-codes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ codeType })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }

      const data = await response.json();
      await loadCodes();
      
      toast({
        title: "Code Generated",
        description: `Premium code ${data.code} (${codeType}) created successfully`
      });

      return data.code;
    } catch (error) {
      console.error('Error generating premium code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate premium code",
        variant: "destructive"
      });
      return null;
    }
  };

  const activateCode = async (code: string, userEmail?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to activate a code",
          variant: "destructive"
        });
        return false;
      }

      // Use the edge function to activate code
      const response = await fetch(`https://hcnoxyfztviuwkiysitm.supabase.co/functions/v1/premium-codes/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code, userEmail })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to activate code');
      }

      const data = await response.json();
      await loadCodes();
      
      toast({
        title: "Code Activated",
        description: `Premium access activated successfully (${data.codeType})`
      });

      return true;
    } catch (error) {
      console.error('Error activating premium code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to activate premium code",
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
