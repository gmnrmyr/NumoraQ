
-- First, let's ensure all existing users have proper UIDs generated
-- Update any profiles without user_uid to have one generated
UPDATE public.profiles 
SET user_uid = public.generate_unique_uid(name)
WHERE user_uid IS NULL OR user_uid = '' OR user_uid = 'UNKNOWN';

-- Make sure the trigger is properly set up for new users
DROP TRIGGER IF EXISTS auto_generate_uid_trigger ON public.profiles;
CREATE TRIGGER auto_generate_uid_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_uid();
