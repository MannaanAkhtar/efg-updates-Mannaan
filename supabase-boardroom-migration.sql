-- ═══════════════════════════════════════════════════════════════════════════
-- BOARDROOM TABLES MIGRATION
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Boardrooms table
CREATE TABLE IF NOT EXISTS boardrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT UNIQUE NOT NULL,
  room_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Virtual Boardroom',
  description TEXT,
  scheduled_time TIMESTAMPTZ,
  max_participants INTEGER DEFAULT 15,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  host_email TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boardroom registrations table
CREATE TABLE IF NOT EXISTS boardroom_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL REFERENCES boardrooms(room_name) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  join_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'joined', 'no_show')),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_name, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_boardrooms_status ON boardrooms(status);
CREATE INDEX IF NOT EXISTS idx_boardrooms_scheduled ON boardrooms(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_registrations_room ON boardroom_registrations(room_name);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON boardroom_registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_token ON boardroom_registrations(join_token);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS boardrooms_updated_at ON boardrooms;
CREATE TRIGGER boardrooms_updated_at
  BEFORE UPDATE ON boardrooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE boardrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE boardroom_registrations ENABLE ROW LEVEL SECURITY;

-- Policies (allow service role full access)
CREATE POLICY "Service role full access on boardrooms" ON boardrooms
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on registrations" ON boardroom_registrations
  FOR ALL USING (auth.role() = 'service_role');

-- Public can view active boardrooms
CREATE POLICY "Public can view active boardrooms" ON boardrooms
  FOR SELECT USING (status IN ('scheduled', 'live'));
