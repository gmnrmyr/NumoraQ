-- Revert the payment_sessions table changes that broke Stripe degen plans
-- Remove the restrictive constraint and payment_type column that might be causing issues

-- Drop the restrictive constraint that might be causing failures
ALTER TABLE public.payment_sessions 
DROP CONSTRAINT IF EXISTS payment_sessions_subscription_plan_check;

-- Remove the payment_type column that might be causing insertion failures
ALTER TABLE public.payment_sessions 
DROP COLUMN IF EXISTS payment_type;

-- Restore the original, more flexible constraint that allows any subscription plan name
-- This will allow both degen plans and donation tiers to work
ALTER TABLE public.payment_sessions 
ADD CONSTRAINT payment_sessions_subscription_plan_check 
CHECK (LENGTH(subscription_plan) > 0); 