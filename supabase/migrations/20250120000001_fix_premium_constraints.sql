-- Fix premium_type constraint to support all plan types used in the system
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1year', '5years', 'lifetime', '30day_trial', '1month', '3months', '6months'));

-- Fix premium_codes constraint to support all code types
ALTER TABLE public.premium_codes 
DROP CONSTRAINT IF EXISTS premium_codes_code_type_check;

ALTER TABLE public.premium_codes 
ADD CONSTRAINT premium_codes_code_type_check 
CHECK (code_type IN ('1year', '5years', 'lifetime', '1month', '3months', '6months'));

-- Ensure that the user_points table constraint allows for multiple manual entries
-- This helps with admin point assignment
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Add back the constraint but allow multiple manual entries by using a different approach
CREATE UNIQUE INDEX IF NOT EXISTS user_points_unique_daily_activity 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- This allows multiple donation and manual entries per day while keeping daily_login unique per day 