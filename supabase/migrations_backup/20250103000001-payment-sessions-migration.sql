-- Ensure payment_sessions table exists and is properly configured
-- This migration ensures the payment processing system can work

-- Create payment_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'crypto')),
  subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('1month', '3months', '6months', '1year', '5years', 'lifetime')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add payment_session_id to user_premium_status table if not exists
ALTER TABLE public.user_premium_status 
ADD COLUMN IF NOT EXISTS payment_session_id TEXT REFERENCES public.payment_sessions(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_id ON public.payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON public.payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_expires_at ON public.payment_sessions(expires_at);

-- Enable RLS for payment_sessions
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Users can create their own payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "System can update payment sessions" ON public.payment_sessions;
DROP POLICY IF EXISTS "Admin can manage all payment sessions" ON public.payment_sessions;

-- Create RLS policies for payment_sessions
CREATE POLICY "Users can view their own payment sessions" 
  ON public.payment_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment sessions" 
  ON public.payment_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payment sessions" 
  ON public.payment_sessions 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin can manage all payment sessions" 
  ON public.payment_sessions 
  FOR ALL 
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_payment_sessions_updated_at ON public.payment_sessions;
CREATE TRIGGER update_payment_sessions_updated_at 
    BEFORE UPDATE ON public.payment_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired payment sessions
CREATE OR REPLACE FUNCTION cleanup_expired_payment_sessions()
RETURNS void AS $$
BEGIN
    UPDATE public.payment_sessions 
    SET status = 'cancelled' 
    WHERE status = 'pending' 
    AND expires_at < now();
END;
$$ language 'plpgsql';

-- Add configuration settings for payment processing
INSERT INTO public.cms_settings (setting_key, setting_value) VALUES
('stripe_enabled', 'true'),
('paypal_enabled', 'false'),
('crypto_payments_enabled', 'true'),
('demo_period_days', '30')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Add environment variables for payment methods
INSERT INTO public.cms_settings (setting_key, setting_value) VALUES
('VITE_PAYPAL_ENABLED', 'false'),
('VITE_CRYPTO_PAYMENTS_ENABLED', 'true')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value; 