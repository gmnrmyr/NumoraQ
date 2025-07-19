-- Migration: New User 30-Day Free Trial
-- This sets up automatic 30-day trial for new users

-- Create function to grant 30-day trial to new users
CREATE OR REPLACE FUNCTION grant_new_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_premium_status with 30-day trial
  INSERT INTO public.user_premium_status (
    user_id,
    is_premium,
    premium_type,
    activated_at,
    expires_at,
    activated_code,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    true,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'FREE_TRIAL_30',
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate trials

  -- Also create basic profile entry
  INSERT INTO public.profiles (
    id,
    name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when new user is created in auth.users
DROP TRIGGER IF EXISTS trigger_grant_new_user_trial ON auth.users;
CREATE TRIGGER trigger_grant_new_user_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION grant_new_user_trial();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION grant_new_user_trial() TO service_role;
GRANT EXECUTE ON FUNCTION grant_new_user_trial() TO authenticated;

-- Add comment
COMMENT ON FUNCTION grant_new_user_trial() IS 'Automatically grants 30-day free trial to new users'; 