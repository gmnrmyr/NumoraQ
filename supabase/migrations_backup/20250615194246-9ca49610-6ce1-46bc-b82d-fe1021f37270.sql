
-- Add unique constraint to user_id in the financial_data table so upserts work
ALTER TABLE public.financial_data
ADD CONSTRAINT financial_data_user_id_unique UNIQUE (user_id);
