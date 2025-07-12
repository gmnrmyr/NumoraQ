-- Fix critical payment and admin issues

-- 1. Fix payment_sessions table constraint to allow donation tiers
ALTER TABLE public.payment_sessions 
DROP CONSTRAINT IF EXISTS payment_sessions_subscription_plan_check;

ALTER TABLE public.payment_sessions 
ADD CONSTRAINT payment_sessions_subscription_plan_check 
CHECK (subscription_plan IN (
  -- Degen plans
  '1month', '3months', '6months', '1year', '5years', 'lifetime',
  -- Donation tiers
  'whale', 'legend', 'patron', 'champion', 'supporter', 'backer', 
  'donor', 'contributor', 'helper', 'friend', 'supporter-basic', 'newcomer'
));

-- 2. Ensure all required tables exist with proper structure

-- Create profiles table if it doesn't exist (for admin authentication)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  user_uid TEXT GENERATED ALWAYS AS (
    'USER-' || UPPER(substring(id::text, 1, 8))
  ) STORED,
  admin_role BOOLEAN DEFAULT false,
  admin_level TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.profiles;
CREATE POLICY "Users can view and update their own profile" 
  ON public.profiles 
  FOR ALL 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  );

-- Create trigger for profiles updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- 3. Create function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'User'));
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure user_points table has correct structure
DO $$ 
BEGIN
  -- Check if donation columns exist, if not add them
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_points' AND column_name = 'donation_amount') THEN
    ALTER TABLE public.user_points ADD COLUMN donation_amount DECIMAL(10, 2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_points' AND column_name = 'donation_tier') THEN
    ALTER TABLE public.user_points ADD COLUMN donation_tier TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_points' AND column_name = 'notes') THEN
    ALTER TABLE public.user_points ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Remove unique constraint that prevents multiple donations per day
DROP INDEX IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Create partial unique index for daily_login only (allow multiple donations)
CREATE UNIQUE INDEX IF NOT EXISTS user_points_daily_login_unique 
ON public.user_points(user_id, activity_type, activity_date) 
WHERE activity_type = 'daily_login';

-- 5. Create admin user setup (you can run this manually for your admin email)
-- Uncomment and modify the email to set up an admin user:
-- INSERT INTO public.profiles (id, name, admin_role, admin_level) 
-- SELECT id, 'Admin User', true, 'super'
-- FROM auth.users 
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (id) DO UPDATE SET admin_role = true, admin_level = 'super';

-- 6. Add debugging and error logging table
CREATE TABLE IF NOT EXISTS public.debug_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_type TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on debug_logs
ALTER TABLE public.debug_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for debug_logs (admins only)
DROP POLICY IF EXISTS "Admin can manage debug logs" ON public.debug_logs;
CREATE POLICY "Admin can manage debug logs" 
  ON public.debug_logs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  ); 