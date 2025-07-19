-- Fix user_points table to allow multiple donation and manual entries per day
-- while keeping daily_login unique per day

-- First, drop the existing unique constraint
DROP INDEX IF EXISTS user_points_unique_daily_activity;
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Add a new unique constraint that only applies to daily_login and referral
-- This allows multiple donation and manual entries per day
CREATE UNIQUE INDEX user_points_unique_login_referral 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('daily_login', 'referral');

-- Add an ID column to ensure we can have multiple entries per user per day for donations/manual
-- (This should already exist but making sure)
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Create an index for better performance on donation and manual entries
CREATE INDEX IF NOT EXISTS idx_user_points_donation_manual 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type IN ('donation', 'manual'); 