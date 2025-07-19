
-- Grant admin privileges to the specified user
UPDATE public.profiles 
SET admin_role = true, 
    admin_level = 'super'
WHERE id = 'f8212535-5a0a-4e50-a420-770b8e3ae053';
