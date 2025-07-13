-- MANUAL SQL FIXES FOR CRITICAL ISSUES
-- Run this script directly in the Supabase SQL Editor

-- 1. Fix premium type constraint to support 30day_trial
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- 2. Add source tracking columns if they don't exist
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activation_source TEXT DEFAULT 'unknown';

ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}';

ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activated_by_admin UUID REFERENCES auth.users(id);

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS points_source TEXT DEFAULT 'manual';

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}';

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS assigned_by_admin UUID REFERENCES auth.users(id);

-- 3. Fix user_points constraints to allow multiple donations per day
DROP INDEX IF EXISTS user_points_unique_daily_activity;
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Create new constraint that only applies to daily_login and referral
CREATE UNIQUE INDEX IF NOT EXISTS user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- 4. Create 30-day trials for existing users without premium status
INSERT INTO public.user_premium_status (user_id, is_premium, premium_type, activated_at, expires_at, activation_source, source_details)
SELECT 
    p.id,
    false,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'trial_backfill',
    '{"trial_type": "30_day", "backfilled": true}'::jsonb
FROM public.profiles p
LEFT JOIN public.user_premium_status ups ON p.id = ups.user_id
WHERE ups.user_id IS NULL;

-- 5. Update existing records with source tracking (safely handle missing columns)
-- First check what columns exist and update accordingly
DO $$
DECLARE
    activated_code_exists BOOLEAN;
    payment_session_exists BOOLEAN;
BEGIN
    -- Check if activated_code column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_premium_status' AND column_name = 'activated_code'
    ) INTO activated_code_exists;
    
    -- Check if payment_session_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_premium_status' AND column_name = 'payment_session_id'
    ) INTO payment_session_exists;
    
    -- Update source tracking based on available columns
    IF activated_code_exists AND payment_session_exists THEN
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
          ELSE '{}'::jsonb
        END
        WHERE activation_source = 'unknown' OR activation_source IS NULL;
    ELSIF payment_session_exists THEN
        UPDATE public.user_premium_status 
        SET activation_source = CASE 
          WHEN payment_session_id IS NOT NULL THEN 'stripe_payment'
          WHEN premium_type = '30day_trial' THEN 'trial_signup'
          ELSE 'unknown'
        END,
        source_details = CASE
          WHEN payment_session_id IS NOT NULL THEN json_build_object('session_id', payment_session_id)
          WHEN premium_type = '30day_trial' THEN json_build_object('trial_type', '30_day')
          ELSE '{}'::jsonb
        END
        WHERE activation_source = 'unknown' OR activation_source IS NULL;
    ELSE
        -- Fallback: only update based on premium_type
        UPDATE public.user_premium_status 
        SET activation_source = CASE 
          WHEN premium_type = '30day_trial' THEN 'trial_signup'
          ELSE 'unknown'
        END,
        source_details = CASE
          WHEN premium_type = '30day_trial' THEN json_build_object('trial_type', '30_day')
          ELSE '{}'::jsonb
        END
        WHERE activation_source = 'unknown' OR activation_source IS NULL;
    END IF;
END $$;

-- Update existing points records with source information  
UPDATE public.user_points 
SET points_source = CASE 
  WHEN activity_type = 'donation' THEN 'stripe_donation'
  WHEN activity_type = 'daily_login' THEN 'daily_login'
  WHEN activity_type = 'referral' THEN 'referral_bonus'
  WHEN activity_type = 'manual' THEN 'admin_assigned'
  ELSE 'unknown'
END,
source_details = CASE
  WHEN activity_type = 'donation' THEN '{"source": "stripe_donation"}'::jsonb
  WHEN activity_type = 'daily_login' THEN '{"source": "daily_login"}'::jsonb
  WHEN activity_type = 'referral' THEN '{"source": "referral_bonus"}'::jsonb
  WHEN activity_type = 'manual' THEN '{"source": "admin_assigned"}'::jsonb
  ELSE '{}'::jsonb
END
WHERE points_source = 'manual' OR points_source IS NULL;

-- 6. Update user signup trigger to create 30-day trials
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
  );
  
  -- Create 30-day trial status for new users
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
    false,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'trial_signup',
    '{"trial_type": "30_day", "auto_created": true}'::jsonb
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Verification queries
SELECT 'Premium type constraint updated' as status;
SELECT count(*) as trial_users FROM user_premium_status WHERE premium_type = '30day_trial';
SELECT activation_source, count(*) FROM user_premium_status GROUP BY activation_source;
SELECT points_source, count(*) FROM user_points GROUP BY points_source; 