-- Fix user_points table to support donation tiers properly
-- The table is missing columns that the donation system expects
-- Ensure all columns have proper defaults to avoid insertion failures

-- Add missing columns to user_points table with proper defaults
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS donation_amount DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS donation_tier TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS total_donated DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS highest_tier TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Remove the unique constraint that prevents multiple donations per day ONLY if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_points_user_id_activity_type_activity_date_key'
    ) THEN
        ALTER TABLE public.user_points 
        DROP CONSTRAINT user_points_user_id_activity_type_activity_date_key;
    END IF;
END $$;

-- Create a new unique constraint that allows multiple donations but prevents duplicate daily logins
CREATE UNIQUE INDEX IF NOT EXISTS user_points_daily_login_unique 
ON public.user_points (user_id, activity_type, activity_date)
WHERE activity_type = 'daily_login';

-- Create index for better performance on donation queries
CREATE INDEX IF NOT EXISTS idx_user_points_donation_tier ON public.user_points(donation_tier);
CREATE INDEX IF NOT EXISTS idx_user_points_user_activity ON public.user_points(user_id, activity_type);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_points_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_points_updated_at ON public.user_points;
CREATE TRIGGER update_user_points_updated_at 
    BEFORE UPDATE ON public.user_points 
    FOR EACH ROW EXECUTE FUNCTION update_user_points_updated_at();

-- Create function to calculate user totals
CREATE OR REPLACE FUNCTION calculate_user_totals(p_user_id UUID)
RETURNS TABLE(
    total_points INTEGER,
    total_donated DECIMAL(10, 2),
    highest_tier TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(points), 0)::INTEGER as total_points,
        COALESCE(SUM(donation_amount), 0)::DECIMAL(10, 2) as total_donated,
        (SELECT donation_tier FROM public.user_points 
         WHERE user_id = p_user_id AND donation_tier IS NOT NULL 
         ORDER BY donation_amount DESC LIMIT 1) as highest_tier
    FROM public.user_points
    WHERE user_id = p_user_id;
END;
$$ language 'plpgsql'; 