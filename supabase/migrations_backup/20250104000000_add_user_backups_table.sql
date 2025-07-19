-- Add user_backups table for cloud-based backup functionality
-- This enables users to create, restore, and manage backups tied to their accounts

-- Create user_backups table
CREATE TABLE IF NOT EXISTS user_backups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  backup_name text NOT NULL DEFAULT 'Manual Backup',
  backup_data jsonb NOT NULL,
  backup_type text NOT NULL DEFAULT 'manual' CHECK (backup_type IN ('manual', 'automatic')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own backups" ON user_backups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backups" ON user_backups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backups" ON user_backups
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backups" ON user_backups
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_backups_user_id ON user_backups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_backups_created_at ON user_backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_backups_type ON user_backups(backup_type);

-- Function to clean up old backups (keep last 2 manual backups per user)
CREATE OR REPLACE FUNCTION cleanup_old_backups() RETURNS TRIGGER AS $$
BEGIN
  -- Delete old manual backups, keeping only the 2 most recent
  DELETE FROM user_backups 
  WHERE user_id = NEW.user_id 
    AND backup_type = 'manual' 
    AND id NOT IN (
      SELECT id 
      FROM user_backups 
      WHERE user_id = NEW.user_id 
        AND backup_type = 'manual' 
      ORDER BY created_at DESC 
      LIMIT 2
    );
  
  -- Delete old automatic backups, keeping only the 3 most recent
  DELETE FROM user_backups 
  WHERE user_id = NEW.user_id 
    AND backup_type = 'automatic' 
    AND id NOT IN (
      SELECT id 
      FROM user_backups 
      WHERE user_id = NEW.user_id 
        AND backup_type = 'automatic' 
      ORDER BY created_at DESC 
      LIMIT 3
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to clean up old backups
CREATE TRIGGER trigger_cleanup_old_backups
  AFTER INSERT ON user_backups
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_backups();

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER trigger_update_user_backups_updated_at
  BEFORE UPDATE ON user_backups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 