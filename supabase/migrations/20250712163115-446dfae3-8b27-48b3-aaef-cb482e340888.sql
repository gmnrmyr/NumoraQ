-- Fix user_points table schema (user_id is already the primary key)
ALTER TABLE public.user_points 
ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS activity_date DATE DEFAULT CURRENT_DATE;

-- Fix user_premium_status table schema
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS premium_type TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_session_id TEXT;

-- Update premium_type from premium_plan
UPDATE public.user_premium_status SET premium_type = premium_plan WHERE premium_type IS NULL;

-- Update expires_at from premium_expires_at  
UPDATE public.user_premium_status SET expires_at = premium_expires_at WHERE expires_at IS NULL;

-- Fix premium_codes table schema
ALTER TABLE public.premium_codes 
ADD COLUMN IF NOT EXISTS code_type TEXT DEFAULT 'lifetime',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update existing codes to be active
UPDATE public.premium_codes SET is_active = true WHERE is_active IS NULL;