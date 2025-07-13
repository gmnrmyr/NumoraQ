-- COMPREHENSIVE MIGRATION TO FIX ALL CRITICAL ISSUES
-- This migration addresses all issues in test_negative_feedback.md

-- =====================================
-- 1. FIX PREMIUM TYPE CONSTRAINTS
-- =====================================

-- Drop existing constraint and add support for all plan types
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- Fix premium_codes constraint 
ALTER TABLE public.premium_codes 
DROP CONSTRAINT IF EXISTS premium_codes_code_type_check;

ALTER TABLE public.premium_codes 
ADD CONSTRAINT premium_codes_code_type_check 
CHECK (code_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime'));

-- =====================================
-- 2. FIX USER_POINTS UNIQUE CONSTRAINTS
-- =====================================

-- Drop the existing unique constraint that prevents multiple entries per day
DROP INDEX IF EXISTS user_points_unique_daily_activity;
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Add new constraint that only applies to daily_login and referral
-- This allows multiple donation and manual entries per day
CREATE UNIQUE INDEX user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- Ensure ID column exists for multiple entries per day
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- =====================================
-- 3. ADD SOURCE TRACKING COLUMNS
-- =====================================

-- Add source tracking to user_premium_status
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activation_source TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS activated_by_admin UUID REFERENCES auth.users(id);

-- Add source tracking to user_points  
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS points_source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS assigned_by_admin UUID REFERENCES auth.users(id);

-- =====================================
-- 4. CREATE ADMIN AUDIT LOG TABLE
-- =====================================

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

-- Create RLS policies for admin audit log
CREATE POLICY "Admins can read audit logs" ON public.admin_audit_log
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND admin_role = true
      )
    );

CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_log
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND admin_role = true
      )
    );

-- =====================================
-- 5. UPDATE USER SIGNUP TRIGGER FOR 30-DAY TRIALS
-- =====================================

-- Drop and recreate the user signup trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function that creates both profile and 30-day trial
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

-- =====================================
-- 6. BACKFILL EXISTING USERS WITH TRIALS
-- =====================================

-- Give existing users without premium status a 30-day trial (one-time fix)
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
-- 7. UPDATE EXISTING RECORDS WITH SOURCE TRACKING
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
-- 8. CREATE PERFORMANCE INDEXES
-- =====================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_points_donation_manual 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('donation', 'manual');

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON public.admin_audit_log(timestamp);

-- =====================================
-- VERIFICATION QUERIES (FOR TESTING)
-- =====================================

-- You can run these to verify the migration worked:
-- 
-- 1. Check constraint is updated:
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conname LIKE '%user_premium_status_premium_type%';
--
-- 2. Check trial users exist:
-- SELECT count(*) FROM user_premium_status WHERE premium_type = '30day_trial';
--
-- 3. Check source tracking is populated:
-- SELECT activation_source, count(*) FROM user_premium_status GROUP BY activation_source;
-- SELECT points_source, count(*) FROM user_points GROUP BY points_source; 