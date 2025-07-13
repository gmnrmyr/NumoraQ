-- TARGETED MIGRATION FOR CRITICAL FIXES
-- This migration focuses on the specific issues without recreating existing policies

-- =====================================
-- 1. FIX PREMIUM TYPE CONSTRAINTS
-- =====================================

-- Update constraint to support all plan types including 30day_trial
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- =====================================
-- 2. ADD SOURCE TRACKING COLUMNS
-- =====================================

-- Add source tracking to user_premium_status if not exists
DO $$ 
BEGIN
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
END $$;

-- Add source tracking to user_points if not exists  
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

-- =====================================
-- 3. FIX USER_POINTS CONSTRAINTS
-- =====================================

-- Drop existing unique constraint that prevents multiple entries per day
DROP INDEX IF EXISTS user_points_unique_daily_activity;
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Create new constraint that only applies to daily_login and referral
CREATE UNIQUE INDEX IF NOT EXISTS user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- =====================================
-- 4. CREATE 30-DAY TRIALS FOR EXISTING USERS
-- =====================================

-- Give existing users without premium status a 30-day trial
INSERT INTO public.user_premium_status (user_id, is_premium, premium_type, activated_at, expires_at, activation_source, source_details)
SELECT 
    p.id,
    false,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'trial_backfill',
    '{"trial_type": "30_day", "backfilled": true}'
FROM public.profiles p
LEFT JOIN public.user_premium_status ups ON p.id = ups.user_id
WHERE ups.user_id IS NULL;

-- =====================================
-- 5. UPDATE EXISTING RECORDS WITH SOURCE TRACKING
-- =====================================

-- Update existing premium status records with source information
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
WHERE activation_source = 'unknown' OR activation_source IS NULL;

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
  WHEN activity_type = 'donation' THEN '{"source": "stripe_donation"}'
  WHEN activity_type = 'daily_login' THEN '{"source": "daily_login"}'
  WHEN activity_type = 'referral' THEN '{"source": "referral_bonus"}'
  WHEN activity_type = 'manual' THEN '{"source": "admin_assigned"}'
  ELSE '{}'
END
WHERE points_source = 'manual' OR points_source IS NULL;

-- =====================================
-- 6. UPDATE USER SIGNUP TRIGGER
-- =====================================

-- Drop and recreate the user signup trigger to include trials
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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
    false, -- Trial users are not premium but have access
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    'trial_signup',
    '{"trial_type": "30_day", "auto_created": true}'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 