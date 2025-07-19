-- Create premium_codes table
-- This table stores admin-generated premium codes

CREATE TABLE IF NOT EXISTS public.premium_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL CHECK (code_type IN ('1year', '5years', 'lifetime')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS premium_codes_code_idx ON public.premium_codes(code);
CREATE INDEX IF NOT EXISTS premium_codes_created_by_idx ON public.premium_codes(created_by);
CREATE INDEX IF NOT EXISTS premium_codes_used_by_idx ON public.premium_codes(used_by);
CREATE INDEX IF NOT EXISTS premium_codes_is_active_idx ON public.premium_codes(is_active);

-- Enable RLS
ALTER TABLE public.premium_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin can manage premium codes" 
  ON public.premium_codes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND admin_role = true
    )
  );

CREATE POLICY "Users can view active codes" 
  ON public.premium_codes 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "System can manage all codes" 
  ON public.premium_codes 
  FOR ALL 
  USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_premium_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_premium_codes_updated_at ON public.premium_codes;
CREATE TRIGGER update_premium_codes_updated_at 
    BEFORE UPDATE ON public.premium_codes 
    FOR EACH ROW EXECUTE FUNCTION update_premium_codes_updated_at(); 