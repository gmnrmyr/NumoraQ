-- Add 30day_trial to the premium_type constraint
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1year', '5years', 'lifetime', '30day_trial', '1month', '3months', '6months'));

-- Update the handle_new_user function to create a 30-day trial
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
  
  -- Create 30-day trial status
  INSERT INTO public.user_premium_status (
    user_id, 
    is_premium, 
    premium_type,
    activated_at,
    expires_at
  )
  VALUES (
    NEW.id,
    false, -- Trial users are not premium but have access
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days'
  );
  
  RETURN NEW;
END;
$$;

-- Optional: Update existing users without premium status to have trial (if they don't have one)
INSERT INTO public.user_premium_status (user_id, is_premium, premium_type, activated_at, expires_at)
SELECT 
    p.id,
    false,
    '30day_trial',
    NOW(),
    NOW() + INTERVAL '30 days'
FROM public.profiles p
LEFT JOIN public.user_premium_status ups ON p.id = ups.user_id
WHERE ups.user_id IS NULL;

-- Create index for better performance on trial queries
CREATE INDEX IF NOT EXISTS idx_user_premium_status_trial 
ON public.user_premium_status (user_id, is_premium, expires_at)
WHERE premium_type = '30day_trial'; 