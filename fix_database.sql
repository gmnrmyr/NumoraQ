-- Quick fix script to run directly in Supabase SQL Editor
-- This fixes the critical issues without complex migrations

-- 1. Add missing columns safely (including activated_code)
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activation_source TEXT DEFAULT 'unknown';

ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}';

ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activated_by_admin UUID REFERENCES auth.users(id);

-- Add the activated_code column first (this was missing!)
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS activated_code TEXT;

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS points_source TEXT DEFAULT 'manual';

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS source_details JSONB DEFAULT '{}';

ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS assigned_by_admin UUID REFERENCES auth.users(id);

-- 2. Fix the activated_code foreign key constraint (now that column exists)
ALTER TABLE public.user_premium_status
DROP CONSTRAINT IF EXISTS user_premium_status_activated_code_fkey;

ALTER TABLE public.user_premium_status
ADD CONSTRAINT user_premium_status_activated_code_fkey
FOREIGN KEY (activated_code) REFERENCES public.premium_codes(code)
ON DELETE SET NULL;

-- 3. Update premium_type constraint to support 30day_trial
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- 4. Fix user_points unique constraint
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

DROP INDEX IF EXISTS user_points_unique_login_referral;
CREATE UNIQUE INDEX IF NOT EXISTS user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('login', 'referral');

-- 5. Create admin views WITHOUT SECURITY DEFINER (to fix security issues)
DROP VIEW IF EXISTS public.admin_premium_status;
CREATE VIEW public.admin_premium_status AS
SELECT 
    ups.user_id,
    ups.is_premium,
    ups.premium_type,
    ups.activated_at,
    ups.expires_at,
    ups.payment_session_id,
    ups.activation_source,
    ups.source_details,
    ups.activated_by_admin,
    ups.activated_code,
    ups.created_at,
    ups.updated_at,
    u.email,
    u.created_at as user_created_at
FROM public.user_premium_status ups
JOIN auth.users u ON ups.user_id = u.id;

DROP VIEW IF EXISTS public.admin_user_points;
CREATE VIEW public.admin_user_points AS
SELECT 
    up.user_id,
    up.points,
    up.activity_type,
    up.activity_date,
    up.points_source,
    up.source_details,
    up.assigned_by_admin,
    up.created_at,
    u.email,
    u.created_at as user_created_at
FROM public.user_points up
JOIN auth.users u ON up.user_id = u.id;

-- 6. Fix function search_path issues - DROP TRIGGERS AND FUNCTIONS WITH CASCADE
-- Drop dependent triggers first
DROP TRIGGER IF EXISTS trigger_cleanup_old_backups ON public.user_backups;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_update_updated_at ON public.payment_sessions;
DROP TRIGGER IF EXISTS trigger_auto_generate_uid ON auth.users;

-- Now drop functions with CASCADE to handle any remaining dependencies
DROP FUNCTION IF EXISTS public.cleanup_old_backups() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_unique_uid() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_uid() CASCADE;
DROP FUNCTION IF EXISTS public.check_admin_users() CASCADE;
DROP FUNCTION IF EXISTS public.update_payment_sessions_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;

-- Now recreate the functions with proper search_path
-- This function is for manual cleanup, not a trigger function
CREATE OR REPLACE FUNCTION public.cleanup_old_backups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM public.user_backups 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_uid()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    new_uid TEXT;
    uid_exists BOOLEAN;
BEGIN
    LOOP
        new_uid := upper(substring(md5(random()::text) from 1 for 8));
        
        SELECT EXISTS(
            SELECT 1 FROM auth.users WHERE raw_user_meta_data->>'uid' = new_uid
        ) INTO uid_exists;
        
        IF NOT uid_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_uid;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_generate_uid()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.raw_user_meta_data->>'uid' IS NULL THEN
        NEW.raw_user_meta_data = COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
                                 jsonb_build_object('uid', public.generate_unique_uid());
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_admin_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Check if admin users exist
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email IN ('manera@gmail.com', 'manera@numoraq.online', 'admin@numoraq.online')
    ) THEN
        RAISE NOTICE 'No admin users found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_payment_sessions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 7. Update user signup trigger to activate 30-day trial
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Insert trial premium status for new users
    INSERT INTO public.user_premium_status (
        user_id,
        is_premium,
        premium_type,
        activated_at,
        expires_at,
        activation_source,
        source_details
    ) VALUES (
        NEW.id,
        true,
        '30day_trial',
        NOW(),
        NOW() + INTERVAL '30 days',
        'auto_trial',
        jsonb_build_object('type', 'new_user_trial', 'auto_activated', true)
    );
    
    RETURN NEW;
END;
$$;

-- Recreate the essential triggers (only the ones that are actually trigger functions)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Recreate payment sessions trigger if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_sessions') THEN
        CREATE TRIGGER trigger_update_payment_sessions_updated_at
            BEFORE UPDATE ON public.payment_sessions
            FOR EACH ROW EXECUTE FUNCTION public.update_payment_sessions_updated_at();
    END IF;
END $$;

-- Recreate UID generation trigger if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'auth') THEN
        CREATE TRIGGER trigger_auto_generate_uid
            BEFORE INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.auto_generate_uid();
    END IF;
END $$;

-- 8. Grant proper permissions for admin views
GRANT SELECT ON public.admin_premium_status TO authenticated;
GRANT SELECT ON public.admin_user_points TO authenticated; 