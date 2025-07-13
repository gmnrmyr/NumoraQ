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
WHERE activity_type IN ('daily_login', 'referral');

-- 5. Create admin views for tracking
DROP VIEW IF EXISTS public.admin_premium_status;
CREATE VIEW public.admin_premium_status AS
SELECT 
  ups.user_id,
  p.name,
  p.user_uid,
  ups.is_premium,
  ups.premium_type,
  ups.activated_at,
  ups.expires_at,
  COALESCE(ups.activation_source, 'unknown') as activation_source,
  COALESCE(ups.source_details, '{}') as source_details,
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

DROP VIEW IF EXISTS public.admin_user_points;
CREATE VIEW public.admin_user_points AS
SELECT 
  up.user_id,
  p.name,
  p.user_uid,
  up.points,
  up.activity_type,
  up.activity_date,
  COALESCE(up.points_source, 'manual') as points_source,
  COALESCE(up.source_details, '{}') as source_details,
  up.assigned_by_admin,
  admin_p.name as assigned_by_admin_name,
  up.created_at
FROM public.user_points up
JOIN public.profiles p ON up.user_id = p.id
LEFT JOIN public.profiles admin_p ON up.assigned_by_admin = admin_p.id
ORDER BY up.created_at DESC;

-- 6. Update existing records
UPDATE public.user_premium_status 
SET 
  activation_source = COALESCE(activation_source, 'legacy'),
  source_details = COALESCE(source_details, '{"migrated": true}')
WHERE activation_source IS NULL OR source_details IS NULL;

UPDATE public.user_points 
SET 
  points_source = COALESCE(points_source, 'legacy'),
  source_details = COALESCE(source_details, '{"migrated": true}')
WHERE points_source IS NULL OR source_details IS NULL;

-- 7. Ensure trial users exist
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
WHERE ups.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING; 