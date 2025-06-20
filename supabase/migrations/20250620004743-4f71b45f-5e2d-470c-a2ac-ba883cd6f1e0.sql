
-- Add a unique UID column to profiles table for better UID management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_uid TEXT;

-- Create a function to generate unique UIDs from names
CREATE OR REPLACE FUNCTION public.generate_unique_uid(base_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    clean_name TEXT;
    candidate_uid TEXT;
    counter INTEGER := 0;
BEGIN
    -- Clean the name: remove spaces, special chars, convert to uppercase
    clean_name := UPPER(REGEXP_REPLACE(COALESCE(base_name, 'USER'), '[^A-Za-z0-9]', '', 'g'));
    
    -- Limit to 8 characters max
    clean_name := LEFT(clean_name, 8);
    
    -- If empty after cleaning, use 'USER'
    IF LENGTH(clean_name) = 0 THEN
        clean_name := 'USER';
    END IF;
    
    candidate_uid := clean_name;
    
    -- Check for duplicates and add numbers if needed
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE user_uid = candidate_uid) LOOP
        counter := counter + 1;
        -- Truncate base name to make room for number
        candidate_uid := LEFT(clean_name, 6) || LPAD(counter::TEXT, 2, '0');
    END LOOP;
    
    RETURN candidate_uid;
END;
$$;

-- Update existing profiles to have UIDs based on their names
UPDATE public.profiles 
SET user_uid = public.generate_unique_uid(name)
WHERE user_uid IS NULL;

-- Create a trigger to auto-generate UID for new users
CREATE OR REPLACE FUNCTION public.auto_generate_uid()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.user_uid IS NULL THEN
        NEW.user_uid := public.generate_unique_uid(NEW.name);
    END IF;
    RETURN NEW;
END;
$$;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS trigger_auto_generate_uid ON public.profiles;
CREATE TRIGGER trigger_auto_generate_uid
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_uid();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_uid ON public.profiles(user_uid);
