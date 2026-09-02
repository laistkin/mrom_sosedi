-- MROM Sosedi — Initial Database Schema
-- Neon PostgreSQL (Lakebase Postgres)

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active', -- active | completed | hidden
  needed BIGINT NOT NULL DEFAULT 0,
  collected BIGINT NOT NULL DEFAULT 0,
  donors INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT[] NOT NULL DEFAULT '{}',
  documents TEXT[] NOT NULL DEFAULT '{}',
  reports JSONB NOT NULL DEFAULT '[]'::jsonb -- [{title, date, amount}]
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  campaign_title TEXT NOT NULL DEFAULT '',
  amount BIGINT NOT NULL,
  donor_name TEXT NOT NULL DEFAULT '',
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  method TEXT NOT NULL DEFAULT 'bank_card', -- bank_card | sbp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site content table (About + Reports)
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY DEFAULT 'default'
);

-- Admin users table (hashed password, not plaintext)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY DEFAULT 'admin-1',
  username TEXT UNIQUE NOT NULL DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
