-- MROM Sosedi — Add user_phone to donations for linking to real users
ALTER TABLE donations ADD COLUMN IF NOT EXISTS user_phone TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_donations_user_phone ON donations(user_phone);
