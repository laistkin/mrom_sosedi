-- Update site_content table with proper columns
ALTER TABLE site_content 
  ADD COLUMN IF NOT EXISTS about TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS help_steps JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS team JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reports JSONB DEFAULT '[]'::jsonb;
