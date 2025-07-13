-- =============================================
-- COMPREHENSIVE FIX FOR ALL CRITICAL ISSUES
-- =============================================

-- 1. Fix the activated_code foreign key constraint issue
-- The issue is that the foreign key reference to premium_codes(code) might be too restrictive
-- Let's drop and recreate it properly

ALTER TABLE public.user_premium_status
DROP CONSTRAINT IF EXISTS user_premium_status_activated_code_fkey;

-- Recreate the constraint with proper handling
ALTER TABLE public.user_premium_status
ADD CONSTRAINT user_premium_status_activated_code_fkey
FOREIGN KEY (activated_code) REFERENCES public.premium_codes(code)
ON DELETE SET NULL;

-- 2. Fix premium_type constraint to support all plan types
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- 3. Ensure all necessary columns exist with source tracking
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_premium_status' 
                   AND column_name='activation_source') THEN
        ALTER TABLE public.user_premium_status 
        ADD COLUMN activation_source TEXT DEFAULT 'unknown';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_premium_status' 
                   AND column_name='source_details') THEN
        ALTER TABLE public.user_premium_status 
        ADD COLUMN source_details JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_premium_status' 
                   AND column_name='activated_by_admin') THEN
        ALTER TABLE public.user_premium_status 
        ADD COLUMN activated_by_admin UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_premium_status' 
                   AND column_name='payment_session_id') THEN
        ALTER TABLE public.user_premium_status 
        ADD COLUMN payment_session_id TEXT;
    END IF;
END $$;

-- 4. Fix user_points table constraints and add source tracking
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_points' 
                   AND column_name='points_source') THEN
        ALTER TABLE public.user_points 
        ADD COLUMN points_source TEXT DEFAULT 'manual';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_points' 
                   AND column_name='source_details') THEN
        ALTER TABLE public.user_points 
        ADD COLUMN source_details JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='user_points' 
                   AND column_name='assigned_by_admin') THEN
        ALTER TABLE public.user_points 
        ADD COLUMN assigned_by_admin UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 5. Fix the unique constraint on user_points to allow multiple manual entries
DROP INDEX IF EXISTS user_points_unique_daily_activity;
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Only restrict daily_login and referral to once per day
CREATE UNIQUE INDEX IF NOT EXISTS user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- 6. Update handle_new_user function to properly create 30-day trials
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (id, name, default_currency, language)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    'BRL',
    'en'
  ) ON CONFLICT (id) DO NOTHING;
  
  -- Create 30-day trial status
  INSERT INTO public.user_premium_status (
    user_id, 
    is_premium, 
    premium_type,
    activated_at,
    expires_at,
    activation_source,
    source_details
  )
  VALUES (
    NEW.id,
    false, -- Trial users are not premium (they see ads)
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'auto_trial',
    '{"trial_type": "30_day", "auto_granted": true}'
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 7. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Fix existing users without proper premium status (give them 30-day trial)
INSERT INTO public.user_premium_status (
  user_id, 
  is_premium, 
  premium_type, 
  activated_at, 
  expires_at,
  activation_source,
  source_details
)
SELECT 
  p.id,
  false,
  '30day_trial',
  NOW(),
  NOW() + INTERVAL '30 days',
  'migration_backfill',
  '{"trial_type": "30_day", "backfilled": true}'
FROM public.profiles p
LEFT JOIN public.user_premium_status ups ON p.id = ups.user_id
WHERE ups.user_id IS NULL;

-- 9. Create admin function to check premium status with source tracking
CREATE OR REPLACE VIEW public.admin_premium_status AS
SELECT 
  ups.user_id,
  p.name,
  p.user_uid,
  ups.is_premium,
  ups.premium_type,
  ups.activated_at,
  ups.expires_at,
  ups.activation_source,
  ups.source_details,
  ups.activated_code,
  ups.activated_by_admin,
  CASE 
    WHEN ups.expires_at IS NULL THEN 'Lifetime'
    WHEN ups.expires_at < NOW() THEN 'Expired'
    WHEN ups.is_premium = true THEN 'Active Premium'
    WHEN ups.premium_type = '30day_trial' THEN 'Trial'
    ELSE 'Unknown'
  END AS status,
  CASE 
    WHEN ups.expires_at IS NULL THEN null
    WHEN ups.expires_at < NOW() THEN 0
    ELSE EXTRACT(EPOCH FROM (ups.expires_at - NOW())) / 86400
  END AS days_remaining
FROM public.user_premium_status ups
JOIN public.profiles p ON ups.user_id = p.id
ORDER BY ups.activated_at DESC;

-- 10. Create admin function to check user points with source tracking
CREATE OR REPLACE VIEW public.admin_user_points AS
SELECT 
  up.user_id,
  p.name,
  p.user_uid,
  up.points,
  up.activity_type,
  up.activity_date,
  up.points_source,
  up.source_details,
  up.assigned_by_admin,
  admin_p.name as assigned_by_admin_name,
  up.created_at
FROM public.user_points up
JOIN public.profiles p ON up.user_id = p.id
LEFT JOIN public.profiles admin_p ON up.assigned_by_admin = admin_p.id
ORDER BY up.created_at DESC;

-- 11. Update existing trial users to have proper source tracking
UPDATE public.user_premium_status 
SET 
  activation_source = 'auto_trial',
  source_details = '{"trial_type": "30_day", "auto_granted": true}'
WHERE premium_type = '30day_trial' 
  AND activation_source IS NULL;

-- 12. Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 