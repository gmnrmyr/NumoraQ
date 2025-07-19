-- Migration: Add Grace Period Columns for Beta Users
-- Adds columns to track beta grace period usage

-- Add grace period columns to user_premium_status table
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS grace_period_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grace_period_activated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN public.user_premium_status.grace_period_used IS 'Tracks if user has used their one-time beta grace period';
COMMENT ON COLUMN public.user_premium_status.grace_period_activated_at IS 'Timestamp when grace period was activated';

-- Update RLS policies to include new columns
CREATE POLICY "Users can read own grace period status" ON public.user_premium_status
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own grace period status" ON public.user_premium_status
FOR UPDATE
USING (auth.uid() = user_id); 