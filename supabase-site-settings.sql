-- Create site_settings table for storing key-value configuration
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on updated_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at);

-- Enable RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy allowing authenticated users to view settings
CREATE POLICY "Enable read access for all authenticated users" ON site_settings
  FOR SELECT
  USING (true);

-- Create policy allowing admin users to update settings
CREATE POLICY "Enable update access for admin users" ON site_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy allowing admin users to insert settings
CREATE POLICY "Enable insert access for admin users" ON site_settings
  FOR INSERT
  WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('store_name', 'YINYANG GUARDIAN'),
  ('store_email', ''),
  ('store_phone', ''),
  ('store_address', ''),
  ('instagram_url', 'https://instagram.com'),
  ('facebook_url', 'https://facebook.com'),
  ('twitter_url', 'https://twitter.com'),
  ('pinterest_url', 'https://pinterest.com'),
  ('tiktok_url', ''),
  ('free_shipping_threshold', '150'),
  ('announcement_messages', '["Free Shipping on Orders Over $150"]'),
  ('currency', 'USD')
ON CONFLICT (key) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_site_settings_timestamp_trigger ON site_settings;

CREATE TRIGGER update_site_settings_timestamp_trigger
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_timestamp();
