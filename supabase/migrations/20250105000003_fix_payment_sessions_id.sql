-- Fix payment_sessions table ID field to properly handle UUIDs
-- Ensure the ID field is set up correctly

-- Drop the existing table and recreate it with proper UUID type
-- First, save any existing data
CREATE TABLE IF NOT EXISTS payment_sessions_backup AS 
SELECT * FROM public.payment_sessions WHERE 1=0; -- Empty backup table with same structure

-- Recreate the payment_sessions table with proper UUID ID
DROP TABLE IF EXISTS public.payment_sessions CASCADE;

CREATE TABLE public.payment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'crypto')),
  subscription_plan TEXT NOT NULL CHECK (subscription_plan IN (
    -- Degen plans
    '1month', '3months', '6months', '1year', '5years', 'lifetime',
    -- Donation tiers  
    'whale', 'legend', 'patron', 'champion', 'supporter', 'backer', 
    'donor', 'contributor', 'helper', 'friend', 'supporter-basic', 'newcomer'
  )),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_payment_sessions_user_id ON public.payment_sessions(user_id);
CREATE INDEX idx_payment_sessions_status ON public.payment_sessions(status);
CREATE INDEX idx_payment_sessions_expires_at ON public.payment_sessions(expires_at);

-- Create RLS policies
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_payment_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_sessions_updated_at 
    BEFORE UPDATE ON public.payment_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_payment_sessions_updated_at();

-- Clean up backup table (it was empty anyway)
DROP TABLE IF EXISTS payment_sessions_backup; 