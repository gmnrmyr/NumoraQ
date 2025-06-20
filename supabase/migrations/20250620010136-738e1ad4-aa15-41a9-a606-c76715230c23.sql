
-- Add admin role and level columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN admin_role boolean DEFAULT false,
ADD COLUMN admin_level text DEFAULT 'standard';

-- Create admin audit log table
CREATE TABLE public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    action text NOT NULL,
    details text,
    timestamp timestamp with time zone DEFAULT now(),
    ip_address text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin audit log (only admins can read their own logs)
CREATE POLICY "Admins can read their own audit logs" ON public.admin_audit_log
    FOR SELECT USING (admin_user_id = auth.uid());

-- Create RLS policy for admin users to insert audit logs
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_log
    FOR INSERT WITH CHECK (admin_user_id = auth.uid());
