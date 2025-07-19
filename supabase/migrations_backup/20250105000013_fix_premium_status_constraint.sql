-- Fix user_premium_status table constraint to include all valid premium types
-- Ensure degen plans, trials, grace periods, and other types work correctly

-- Drop existing constraint if it exists
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

-- Add comprehensive constraint that includes all valid premium types
ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN (
  -- Degen plans
  '1month', '3months', '6months', '1year', '5years', 'lifetime',
  -- Trial types  
  '30day_trial',
  -- Grace period types
  '3day_grace'
) OR premium_type IS NULL);

-- Ensure all trial and grace period tracking columns exist
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS trial_activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS grace_period_activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS grace_period_used BOOLEAN DEFAULT false; 