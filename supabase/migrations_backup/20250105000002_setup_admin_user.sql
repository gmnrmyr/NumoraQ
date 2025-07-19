-- Setup admin user for the application
-- This will enable the admin panel functionality

-- First, let's create a temporary admin setup function
CREATE OR REPLACE FUNCTION setup_admin_user(admin_email TEXT)
RETURNS void AS $$
BEGIN
  -- Set admin role for the specified email
  UPDATE public.profiles 
  SET admin_role = true, admin_level = 'super'
  WHERE id IN (
    SELECT id FROM auth.users WHERE email = admin_email
  );
  
  -- If no profile exists, create one
  INSERT INTO public.profiles (id, name, admin_role, admin_level)
  SELECT id, 'Admin User', true, 'super'
  FROM auth.users 
  WHERE email = admin_email
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.users.id
  );
END;
$$ LANGUAGE plpgsql;

-- Setup admin user for the main admin email
-- You can modify this email to match your admin account
-- Common admin emails to try:
SELECT setup_admin_user('admin@numoraq.com');
SELECT setup_admin_user('numoraq@gmail.com');
SELECT setup_admin_user('deckard.hardsurface@gmail.com');

-- Create a function to quickly check admin status
CREATE OR REPLACE FUNCTION check_admin_users()
RETURNS TABLE(email TEXT, is_admin BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.email,
    COALESCE(p.admin_role, false) as is_admin
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE u.email IS NOT NULL
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- You can run this to check which users have admin access:
-- SELECT * FROM check_admin_users();

-- Drop the temporary function
DROP FUNCTION setup_admin_user(TEXT); 