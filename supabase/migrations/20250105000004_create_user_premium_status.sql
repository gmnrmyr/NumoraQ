-- Create user_premium_status table
-- This table tracks premium subscriptions and statuses

CREATE TABLE IF NOT EXISTS public.user_premium_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  premium_type TEXT CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial')), -- Added trial types
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update existing constraint if table already exists
ALTER TABLE public.user_premium_status 
DROP CONSTRAINT IF EXISTS user_premium_status_premium_type_check;

ALTER TABLE public.user_premium_status 
ADD CONSTRAINT user_premium_status_premium_type_check 
CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime', '30day_trial'));

-- Create unique constraint on user_id (one premium status per user)
CREATE UNIQUE INDEX IF NOT EXISTS user_premium_status_user_id_unique 
ON public.user_premium_status(user_id);

-- Enable RLS
ALTER TABLE public.user_premium_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own premium status" 
  ON public.user_premium_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own premium status" 
  ON public.user_premium_status 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own premium status" 
  ON public.user_premium_status 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can manage all premium status" 
  ON public.user_premium_status 
  FOR ALL 
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_premium_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_premium_status_updated_at ON public.user_premium_status;
CREATE TRIGGER update_user_premium_status_updated_at 
    BEFORE UPDATE ON public.user_premium_status 
    FOR EACH ROW EXECUTE FUNCTION update_user_premium_status_updated_at(); 