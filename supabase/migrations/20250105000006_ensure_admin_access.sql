-- Ensure specific user has admin access based on the user ID from error logs
-- User ID: 8f94d4d5-8396-4c8b-968b-6d5693251620

-- Create or update profile for the specific user with admin access
INSERT INTO public.profiles (id, name, admin_role, admin_level)
VALUES ('8f94d4d5-8396-4c8b-968b-6d5693251620', 'Admin User', true, 'super')
ON CONFLICT (id) DO UPDATE SET 
  admin_role = true, 
  admin_level = 'super',
  updated_at = now();

-- Create a function to verify admin setup
CREATE OR REPLACE FUNCTION verify_admin_setup()
RETURNS TABLE(user_id UUID, email TEXT, admin_role BOOLEAN, admin_level TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    u.email,
    COALESCE(p.admin_role, false) as admin_role,
    COALESCE(p.admin_level, 'standard') as admin_level
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE u.id = '8f94d4d5-8396-4c8b-968b-6d5693251620'::UUID
  OR p.admin_role = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can run: SELECT * FROM verify_admin_setup(); to check admin users 