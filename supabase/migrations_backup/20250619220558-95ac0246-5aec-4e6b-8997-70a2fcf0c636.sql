
-- Create a table for CMS/site configuration
CREATE TABLE public.cms_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for premium/degen codes with proper user tracking
CREATE TABLE public.premium_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  code_type TEXT NOT NULL CHECK (code_type IN ('1year', '5years', 'lifetime')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  user_email TEXT
);

-- Create a table for user premium status
CREATE TABLE public.user_premium_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  premium_type TEXT CHECK (premium_type IN ('1year', '5years', 'lifetime')),
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  activated_code TEXT REFERENCES public.premium_codes(code),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user points/activities
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('daily_login', 'donation', 'referral', 'manual')),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_type, activity_date)
);

-- Enable Row Level Security
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_premium_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cms_settings (admin only)
CREATE POLICY "Admin can manage CMS settings" 
  ON public.cms_settings 
  FOR ALL 
  USING (true);

-- Create RLS policies for premium_codes (admin only)
CREATE POLICY "Admin can manage premium codes" 
  ON public.premium_codes 
  FOR ALL 
  USING (true);

-- Create RLS policies for user_premium_status
CREATE POLICY "Users can view their own premium status" 
  ON public.user_premium_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can update premium status" 
  ON public.user_premium_status 
  FOR ALL 
  USING (true);

-- Create RLS policies for user_points
CREATE POLICY "Users can view their own points" 
  ON public.user_points 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user points" 
  ON public.user_points 
  FOR ALL 
  USING (true);

-- Insert default CMS settings
INSERT INTO public.cms_settings (setting_key, setting_value) VALUES
('website_name', '"Numoraq"'),
('project_wallet', '"0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD"'),
('crypto_donations_enabled', 'true'),
('paypal_donations_enabled', 'true'),
('donation_goal', '10000'),
('github_link', '""'),
('discord_link', '""'),
('twitter_link', '""')
ON CONFLICT (setting_key) DO NOTHING;
