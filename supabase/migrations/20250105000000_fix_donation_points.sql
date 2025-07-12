-- Fix donation points system to allow multiple donations per day
-- Remove the unique constraint that prevents multiple donations per day
ALTER TABLE public.user_points 
DROP CONSTRAINT IF EXISTS user_points_user_id_activity_type_activity_date_key;

-- Add a new unique constraint that allows multiple donations but prevents duplicate daily logins
-- We'll use a partial unique index for daily_login only
CREATE UNIQUE INDEX IF NOT EXISTS user_points_daily_login_unique 
ON public.user_points(user_id, activity_type, activity_date) 
WHERE activity_type = 'daily_login';

-- Add additional columns to support donation tracking
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS donation_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS donation_tier TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create a view to get user total points and donation summary
CREATE OR REPLACE VIEW user_points_summary AS
SELECT 
  user_id,
  SUM(points) as total_points,
  SUM(CASE WHEN activity_type = 'donation' THEN points ELSE 0 END) as donation_points,
  SUM(CASE WHEN activity_type = 'donation' THEN donation_amount ELSE 0 END) as total_donated,
  MAX(CASE WHEN activity_type = 'donation' THEN donation_tier ELSE NULL END) as highest_tier,
  COUNT(CASE WHEN activity_type = 'daily_login' THEN 1 ELSE NULL END) as login_streak,
  COUNT(CASE WHEN activity_type = 'donation' THEN 1 ELSE NULL END) as donation_count,
  MAX(created_at) as last_activity
FROM public.user_points
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON user_points_summary TO anon, authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view their own points summary" 
  ON public.user_points_summary
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Update the payment_sessions table to support donation tiers
ALTER TABLE public.payment_sessions 
DROP CONSTRAINT IF EXISTS payment_sessions_subscription_plan_check;

ALTER TABLE public.payment_sessions 
ADD CONSTRAINT payment_sessions_subscription_plan_check 
CHECK (subscription_plan IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', 'whale', 'legend', 'patron', 'champion', 'supporter', 'backer', 'donor', 'contributor', 'helper', 'friend', 'supporter-basic', 'newcomer'));

-- Create function to get user's current tier based on total points
CREATE OR REPLACE FUNCTION get_user_tier(user_points INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE 
    WHEN user_points >= 50000 THEN RETURN 'WHALE';
    WHEN user_points >= 10000 THEN RETURN 'LEGEND';
    WHEN user_points >= 5000 THEN RETURN 'PATRON';
    WHEN user_points >= 2000 THEN RETURN 'CHAMPION';
    WHEN user_points >= 1000 THEN RETURN 'SUPPORTER';
    WHEN user_points >= 500 THEN RETURN 'BACKER';
    WHEN user_points >= 100 THEN RETURN 'DONOR';
    WHEN user_points >= 50 THEN RETURN 'CONTRIBUTOR';
    WHEN user_points >= 25 THEN RETURN 'HELPER';
    WHEN user_points >= 20 THEN RETURN 'FRIEND';
    WHEN user_points >= 10 THEN RETURN 'SUPPORTER';
    ELSE RETURN 'NEWCOMER';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user tier when points change
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a placeholder for future tier update logic
  -- For now, we'll calculate tiers dynamically in the application
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_tier_trigger
  AFTER INSERT OR UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tier(); 