-- Fix payment_sessions table to support donation tiers
-- The table constraint only allows degen plan names, not donation tier names

-- Remove the restrictive constraint on subscription_plan
ALTER TABLE public.payment_sessions 
DROP CONSTRAINT IF EXISTS payment_sessions_subscription_plan_check;

-- Add a more flexible constraint that allows both degen plans and donation tiers
ALTER TABLE public.payment_sessions 
ADD CONSTRAINT payment_sessions_subscription_plan_check 
CHECK (subscription_plan IN (
  -- Degen plans
  '1month', '3months', '6months', '1year', '5years', 'lifetime', 
  -- Donation tiers
  'whale', 'legend', 'patron', 'champion', 'supporter', 'backer', 
  'donor', 'contributor', 'helper', 'friend', 'supporter-basic', 'newcomer'
));

-- Add a payment_type column to distinguish between degen and donation payments
ALTER TABLE public.payment_sessions 
ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'degen' CHECK (payment_type IN ('degen', 'donation'));

-- Update existing sessions to have payment_type based on their plan
UPDATE public.payment_sessions 
SET payment_type = CASE 
  WHEN subscription_plan IN ('1month', '3months', '6months', '1year', '5years', 'lifetime') THEN 'degen'
  ELSE 'donation'
END
WHERE payment_type IS NULL OR payment_type = 'degen';

-- Create index for better performance on payment_type queries
CREATE INDEX IF NOT EXISTS idx_payment_sessions_payment_type ON public.payment_sessions(payment_type);

-- Create function to validate payment session data
CREATE OR REPLACE FUNCTION validate_payment_session()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate that payment_type matches subscription_plan
    IF NEW.payment_type = 'degen' AND NEW.subscription_plan NOT IN ('1month', '3months', '6months', '1year', '5years', 'lifetime') THEN
        RAISE EXCEPTION 'Invalid degen plan: %', NEW.subscription_plan;
    END IF;
    
    IF NEW.payment_type = 'donation' AND NEW.subscription_plan NOT IN ('whale', 'legend', 'patron', 'champion', 'supporter', 'backer', 'donor', 'contributor', 'helper', 'friend', 'supporter-basic', 'newcomer') THEN
        RAISE EXCEPTION 'Invalid donation tier: %', NEW.subscription_plan;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to validate payment session data
DROP TRIGGER IF EXISTS validate_payment_session_trigger ON public.payment_sessions;
CREATE TRIGGER validate_payment_session_trigger
    BEFORE INSERT OR UPDATE ON public.payment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION validate_payment_session(); 