-- Fix RLS policies for premium_codes table to allow legitimate operations

-- Drop the existing overly restrictive policies
DROP POLICY IF EXISTS "Users can view unused premium codes" ON premium_codes;
DROP POLICY IF EXISTS "Service role can manage all premium codes" ON premium_codes;

-- Create new policies that allow proper functionality

-- Allow authenticated users to select premium codes they can use (unused codes)
CREATE POLICY "authenticated_users_can_view_unused_codes" ON premium_codes
FOR SELECT
TO authenticated
USING (NOT is_used AND is_active = true);

-- Allow authenticated users to update codes when activating them (only codes they're activating)
CREATE POLICY "authenticated_users_can_activate_codes" ON premium_codes
FOR UPDATE
TO authenticated
USING (NOT is_used AND is_active = true)
WITH CHECK (used_by = auth.uid());

-- Allow authenticated users with admin role to manage codes
CREATE POLICY "admin_users_can_manage_codes" ON premium_codes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND admin_role = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND admin_role = true
  )
);

-- Allow service role to manage all codes (for edge functions)
CREATE POLICY "service_role_can_manage_all_codes" ON premium_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anon role to view unused active codes (for public display if needed)
CREATE POLICY "anon_can_view_unused_codes" ON premium_codes
FOR SELECT
TO anon
USING (NOT is_used AND is_active = true);