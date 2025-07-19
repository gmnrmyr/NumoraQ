-- Create missing payment_sessions table referenced in stripe-setup.md
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'crypto', 'solana')),
  subscription_plan TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_sessions
CREATE POLICY "Users can view their own payment sessions" 
ON public.payment_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment sessions" 
ON public.payment_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment sessions" 
ON public.payment_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment sessions" 
ON public.payment_sessions 
FOR ALL 
USING (auth.role() = 'service_role'::text);