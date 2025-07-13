-- Add 30-day trial to existing users who don't have premium status
-- This ensures all users get the trial period regardless of when they joined
-- Trial users should see ads like non-degens (is_premium: false)

-- First, add the trial_activated_at column if it doesn't exist
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS trial_activated_at TIMESTAMP WITH TIME ZONE;

-- Insert 30-day trial for existing users who don't have any premium status
INSERT INTO public.user_premium_status (
  user_id, 
  is_premium, 
  premium_type, 
  activated_at,
  expires_at,
  trial_activated_at,
  created_at,
  updated_at
)
SELECT 
  u.id as user_id,
  false as is_premium, -- Trial users should see ads like non-degens
  '30day_trial' as premium_type,
  NOW() as activated_at,
  NOW() + INTERVAL '30 days' as expires_at,
  NOW() as trial_activated_at,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.id NOT IN (
  SELECT user_id 
  FROM public.user_premium_status 
  WHERE user_id = u.id
)
AND u.email_confirmed_at IS NOT NULL; -- Only for confirmed users

-- Update the constraint to ensure trial types are valid
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial')); 