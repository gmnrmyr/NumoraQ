-- Drop and recreate the user signup trigger to ensure 30-day trial creation

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function that creates both profile and 30-day trial
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
  
  -- Create 30-day trial status for new users
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

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing users without premium status to have trial (one-time fix)
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