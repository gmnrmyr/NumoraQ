-- Add source tracking columns to user_premium_status table
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activation_source TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS activated_by_admin UUID REFERENCES auth.users(id);

-- Add source tracking columns to user_points table  
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS points_source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS assigned_by_admin UUID REFERENCES auth.users(id);

-- Create an audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin audit log (only admins can read)
CREATE POLICY "Admins can read audit logs" ON public.admin_audit_log
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND admin_role = true
      )
    );

-- Create RLS policy for admin users to insert audit logs
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_log
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND admin_role = true
      )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON public.admin_audit_log(timestamp);

-- Update existing records to have basic source information
UPDATE public.user_premium_status 
SET activation_source = CASE 
  WHEN activated_code IS NOT NULL THEN 'premium_code'
  WHEN payment_session_id IS NOT NULL THEN 'stripe_payment'
  WHEN premium_type = '30day_trial' THEN 'trial_signup'
  ELSE 'unknown'
END,
source_details = CASE
  WHEN activated_code IS NOT NULL THEN json_build_object('code', activated_code)
  WHEN payment_session_id IS NOT NULL THEN json_build_object('session_id', payment_session_id)
  WHEN premium_type = '30day_trial' THEN json_build_object('trial_type', '30_day')
  ELSE '{}'
END
WHERE activation_source = 'unknown';

UPDATE public.user_points 
SET points_source = CASE 
  WHEN activity_type = 'donation' THEN 'stripe_donation'
  WHEN activity_type = 'daily_login' THEN 'daily_login'
  WHEN activity_type = 'referral' THEN 'referral_bonus'
  WHEN activity_type = 'manual' THEN 'admin_assigned'
  ELSE 'unknown'
END
WHERE points_source = 'manual'; 